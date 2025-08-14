#!/usr/bin/env python3
"""
🗄️ VÉRIFICATION DU SCHÉMA UNIFIÉ POSTGRESQL
Script pour vérifier l'unification des tables EBIOS RM + AI
"""

import psycopg2
import os
from datetime import datetime

def check_unified_schema():
    """Vérifie le schéma unifié de la base de données"""
    
    try:
        # Connexion à PostgreSQL
        conn = psycopg2.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            port=os.getenv('DB_PORT', '5432'),
            database=os.getenv('DB_NAME', 'ebios'),
            user=os.getenv('DB_USER', 'postgres'),
            password=os.getenv('DB_PASSWORD', 'postgres')
        )
        
        cur = conn.cursor()
        
        print('🗄️ VÉRIFICATION DU SCHÉMA UNIFIÉ POSTGRESQL')
        print('=' * 60)
        print(f'📅 Date: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}')
        print(f'🔗 Base: {os.getenv("DB_NAME", "ebios")}@{os.getenv("DB_HOST", "localhost")}')
        
        # 1. Lister toutes les tables
        cur.execute("""
            SELECT table_name, table_type 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name;
        """)
        
        all_tables = cur.fetchall()
        
        # 2. Catégoriser les tables
        ebios_tables = []
        ai_tables = []
        other_tables = []
        
        for table_name, table_type in all_tables:
            if table_name.startswith('ai_') or table_name in ['agent_memory', 'semantic_analyses']:
                ai_tables.append((table_name, table_type))
            elif table_name in ['users', 'missions', 'workshops', 'business_values', 
                               'essential_assets', 'supporting_assets', 'stakeholders',
                               'dreaded_events', 'security_measures', 'threats', 'vulnerabilities']:
                ebios_tables.append((table_name, table_type))
            else:
                other_tables.append((table_name, table_type))
        
        # 3. Afficher les résultats
        print(f'\n📊 TABLES EBIOS RM CORE ({len(ebios_tables)}):')
        print('-' * 40)
        for table_name, table_type in ebios_tables:
            print(f'  ✅ {table_name} ({table_type})')
        
        print(f'\n🤖 TABLES AI UNIFIÉES ({len(ai_tables)}):')
        print('-' * 40)
        for table_name, table_type in ai_tables:
            print(f'  🔗 {table_name} ({table_type})')
        
        if other_tables:
            print(f'\n📋 AUTRES TABLES ({len(other_tables)}):')
            print('-' * 40)
            for table_name, table_type in other_tables:
                print(f'  📄 {table_name} ({table_type})')
        
        # 4. Vérifier les relations entre tables
        print(f'\n🔗 VÉRIFICATION DES RELATIONS:')
        print('-' * 40)
        
        # Vérifier les colonnes de liaison
        liaison_checks = [
            ('ai_sessions', 'user_id', 'users', 'id'),
            ('ai_sessions', 'mission_id', 'missions', 'id'),
            ('agent_memory', 'user_id', 'users', 'id'),
            ('agent_memory', 'mission_id', 'missions', 'id'),
            ('ai_suggestions', 'user_id', 'users', 'id'),
            ('ai_suggestions', 'mission_id', 'missions', 'id'),
            ('semantic_analyses', 'mission_id', 'missions', 'id')
        ]
        
        for ai_table, ai_column, ebios_table, ebios_column in liaison_checks:
            # Vérifier que les tables existent
            ai_exists = any(table[0] == ai_table for table in ai_tables)
            ebios_exists = any(table[0] == ebios_table for table in ebios_tables)
            
            if ai_exists and ebios_exists:
                print(f'  ✅ {ai_table}.{ai_column} → {ebios_table}.{ebios_column}')
            elif ai_exists and not ebios_exists:
                print(f'  ⚠️ {ai_table}.{ai_column} → {ebios_table}.{ebios_column} (table EBIOS manquante)')
            elif not ai_exists and ebios_exists:
                print(f'  ⚠️ {ai_table}.{ai_column} → {ebios_table}.{ebios_column} (table AI manquante)')
            else:
                print(f'  ❌ {ai_table}.{ai_column} → {ebios_table}.{ebios_column} (les deux tables manquantes)')
        
        # 5. Vérifier les index
        print(f'\n📈 VÉRIFICATION DES INDEX:')
        print('-' * 40)
        
        cur.execute("""
            SELECT schemaname, tablename, indexname, indexdef
            FROM pg_indexes 
            WHERE schemaname = 'public' 
            AND (tablename LIKE 'ai_%' OR tablename IN ('agent_memory', 'semantic_analyses'))
            ORDER BY tablename, indexname;
        """)
        
        indexes = cur.fetchall()
        
        if indexes:
            current_table = None
            for schema, table, index_name, index_def in indexes:
                if table != current_table:
                    print(f'  📊 {table}:')
                    current_table = table
                print(f'    - {index_name}')
        else:
            print('  ⚠️ Aucun index trouvé pour les tables AI')
        
        # 6. Statistiques finales
        print(f'\n📈 STATISTIQUES FINALES:')
        print('-' * 40)
        print(f'  📊 Total tables: {len(all_tables)}')
        print(f'  🏢 Tables EBIOS RM: {len(ebios_tables)}')
        print(f'  🤖 Tables AI: {len(ai_tables)}')
        print(f'  📋 Autres tables: {len(other_tables)}')
        print(f'  📈 Index AI: {len(indexes)}')
        
        # 7. État de l'unification
        unification_score = 0
        if len(ai_tables) >= 6:  # Au moins 6 tables AI attendues
            unification_score += 40
        if len(ebios_tables) >= 5:  # Au moins 5 tables EBIOS core
            unification_score += 40
        if len(indexes) > 0:  # Index présents
            unification_score += 20
        
        print(f'\n🎯 ÉTAT DE L\'UNIFICATION:')
        print('-' * 40)
        if unification_score >= 90:
            print('  🟢 EXCELLENT - Schéma parfaitement unifié')
        elif unification_score >= 70:
            print('  🟡 BON - Schéma majoritairement unifié')
        elif unification_score >= 50:
            print('  🟠 PARTIEL - Unification en cours')
        else:
            print('  🔴 INCOMPLET - Unification nécessaire')
        
        print(f'  📊 Score: {unification_score}/100')
        
        conn.close()
        return True
        
    except Exception as e:
        print(f'❌ ERREUR: {e}')
        return False

if __name__ == "__main__":
    success = check_unified_schema()
    exit(0 if success else 1)
