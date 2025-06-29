#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Analyseur EBIOS RM - Cas d'étude réel
Analyse complète des ateliers EBIOS RM à partir de la base de données SQLite
"""

import sqlite3
import json
from pathlib import Path

def connect_database():
    """Connexion à la base de données SQLite"""
    db_path = Path("EBIOS-RM V1.5 (1)_converted.db")
    if not db_path.exists():
        raise FileNotFoundError(f"Base de données non trouvée : {db_path}")
    return sqlite3.connect(str(db_path))

def analyze_atelier_1(conn):
    """Atelier 1 : Cadrage et socle de sécurité"""
    print("=" * 60)
    print("ATELIER 1 : CADRAGE ET SOCLE DE SÉCURITÉ")
    print("=" * 60)
    
    # Valeurs métier
    print("\n1.1 VALEURS MÉTIER")
    print("-" * 30)
    cursor = conn.execute("SELECT * FROM ERM_ValeurMetier")
    for row in cursor.fetchall():
        print(f"• {row[0]}")
        print(f"  Mission: {row[1]}")
        print(f"  Nature: {row[2]}")
        print(f"  Description: {row[3][:100]}...")
        print(f"  Responsable: {row[4]}")
        print()
    
    # Biens supports associés
    print("\n1.2 BIENS SUPPORTS ASSOCIÉS")
    print("-" * 30)
    cursor = conn.execute("SELECT * FROM ERM_BienSupportAssocie")
    for row in cursor.fetchall():
        print(f"• {row[0]}")
        print(f"  Valeur Métier: {row[1]}")
        print(f"  Description: {row[2][:100]}...")
        print(f"  Responsable: {row[3]}")
        print()
    
    # Socle de sécurité
    print("\n1.3 SOCLE DE SÉCURITÉ")
    print("-" * 30)
    cursor = conn.execute("SELECT * FROM ERM_SocleSecurite")
    for row in cursor.fetchall():
        print(f"• Référentiel: {row[0]}")
        print(f"  Type: {row[1]}")
        print(f"  État: {row[2]}")
        print()
    
    # Écarts du socle
    cursor = conn.execute("SELECT * FROM ERM_SocleSecuriteEcart")
    for row in cursor.fetchall():
        print(f"• Écart: {row[1]}")
        print(f"  Justification: {row[2]}")
        print()

def analyze_atelier_2(conn):
    """Atelier 2 : Sources de risque et objectifs visés"""
    print("=" * 60)
    print("ATELIER 2 : SOURCES DE RISQUE ET OBJECTIFS VISÉS")
    print("=" * 60)
    
    # Sources de risque
    print("\n2.1 SOURCES DE RISQUE")
    print("-" * 30)
    cursor = conn.execute("SELECT * FROM ERM_SourceRisque")
    for row in cursor.fetchall():
        print(f"• {row[0]}")
    
    # Objectifs visés
    print("\n\n2.2 OBJECTIFS VISÉS")
    print("-" * 30)
    cursor = conn.execute("""
        SELECT [Source de Risque], [Objectif Vise], Motivation, Ressource, 
               Activite, [Pertinence proposee], [Pertinence retenue], Retenu
        FROM ERM_ObjectifVise
    """)
    for row in cursor.fetchall():
        print(f"• Source: {row[0]}")
        print(f"  Objectif: {row[1]}")
        print(f"  Motivation: {row[2]}, Ressource: {row[3]}, Activité: {row[4]}")
        print(f"  Pertinence proposée: {row[5]}, retenue: {row[6]}")
        print(f"  Retenu: {'Oui' if row[7] else 'Non'}")
        print()

def analyze_atelier_3(conn):
    """Atelier 3 : Scénarios stratégiques"""
    print("=" * 60)
    print("ATELIER 3 : SCÉNARIOS STRATÉGIQUES")
    print("=" * 60)
    
    # Événements redoutés
    print("\n3.1 ÉVÉNEMENTS REDOUTÉS")
    print("-" * 30)
    cursor = conn.execute("SELECT * FROM ERM_EvenementRedoute")
    for row in cursor.fetchall():
        print(f"• Valeur Métier: {row[0]}")
        print(f"  Événement: {row[1]}")
        print(f"  Gravité: {row[2]}")
        print()
    
    # Impacts des événements redoutés
    print("\n3.2 IMPACTS DES ÉVÉNEMENTS REDOUTÉS")
    print("-" * 30)
    cursor = conn.execute("SELECT * FROM ERM_EvenementRedouteImpact")
    for row in cursor.fetchall():
        print(f"• Valeur Métier: {row[0]}")
        print(f"  Événement: {row[1]}")
        print(f"  Impact: {row[2]}")
        print()

def analyze_atelier_4(conn):
    """Atelier 4 : Scénarios opérationnels"""
    print("=" * 60)
    print("ATELIER 4 : SCÉNARIOS OPÉRATIONNELS")
    print("=" * 60)
    
    # Parties prenantes
    print("\n4.1 PARTIES PRENANTES")
    print("-" * 30)
    cursor = conn.execute("SELECT * FROM ERM_PartiePrenante")
    for row in cursor.fetchall():
        print(f"• Catégorie: {row[0]}")
        print(f"  Partie Prenante: {row[1]}")
        print(f"  Dépendance: {row[2]}, Pénétration: {row[3]}")
        print(f"  Exposition: {row[4]}, Maturité Cyber: {row[5]}")
        print(f"  Confiance: {row[6]}, Fiabilité Cyber: {row[7]}")
        print()
    
    # Chemins d'attaque
    print("\n4.2 CHEMINS D'ATTAQUE")
    print("-" * 30)
    cursor = conn.execute("SELECT * FROM ERM_CheminAttaque")
    for row in cursor.fetchall():
        print(f"• Source de Risque: {row[0]}")
        print(f"  Objectif Visé: {row[1]}")
        print(f"  Chemin: {row[2]}")
        print(f"  Partie Prenante: {row[3]}")
        print(f"  Gravité: {row[4]}")
        print()
    
    # Actions du graphe d'attaque
    print("\n4.3 ACTIONS DU GRAPHE D'ATTAQUE")
    print("-" * 30)
    cursor = conn.execute("SELECT * FROM ERM_GrapheAttaqueAction")
    for row in cursor.fetchall():
        print(f"• Chemin: {row[0]}")
        print(f"  Séquence: {row[1]}, Action n°{row[2]}")
        print(f"  Action: {row[4]}")
        print(f"  Mode opératoire: {row[6]}")
        print(f"  Canal: {row[7]}")
        print(f"  Probabilité: {row[8]}, Difficulté: {row[9]}")
        print()

def analyze_atelier_5(conn):
    """Atelier 5 : Traitement du risque"""
    print("=" * 60)
    print("ATELIER 5 : TRAITEMENT DU RISQUE")
    print("=" * 60)
    
    # Scénarios de risque
    print("\n5.1 SCÉNARIOS DE RISQUE")
    print("-" * 30)
    cursor = conn.execute("SELECT * FROM ERM_ScenarioRisque")
    for row in cursor.fetchall():
        print(f"• ID: {row[0]}")
        print(f"  Source: {row[1]} → Objectif: {row[2]}")
        print(f"  Valeur Métier: {row[3]}")
        print(f"  Canal: {row[4]}, Partie Prenante: {row[5]}")
        print(f"  Description: {row[6][:100]}...")
        print(f"  Gravité: {row[7]}, Vraisemblance: {row[8]}")
        print(f"  Risque résiduel - Gravité: {row[10]}, Vraisemblance: {row[11]}")
        print()
    
    # Mesures de sécurité
    print("\n5.2 MESURES DE SÉCURITÉ")
    print("-" * 30)
    cursor = conn.execute("SELECT * FROM ERM_MesureSecurite")
    for row in cursor.fetchall():
        print(f"• Partie Prenante: {row[0]}")
        print(f"  Chemin d'attaque: {row[1]}")
        print(f"  Mesure: {row[2]}")
        print(f"  Menace initiale: {row[3]}")
        print(f"  Menace résiduelle: {row[4]}")
        print()
    
    # Plan de sécurité
    print("\n5.3 PLAN DE SÉCURITÉ")
    print("-" * 30)
    cursor = conn.execute("SELECT * FROM ERM_PlanSecurite")
    for row in cursor.fetchall():
        print(f"• Mesure: {row[0]}")
        print(f"  Type: {row[1]}")
        print(f"  Frein/Difficulté: {row[2]}")
        print(f"  Coût/Complexité: {row[3]}")
        print(f"  Échéance: {row[4]} mois")
        print(f"  Statut: {row[5]}")
        print()

def analyze_parametrage(conn):
    """Analyse des tables de paramétrage"""
    print("=" * 60)
    print("PARAMÉTRAGE ET RÉFÉRENTIELS")
    print("=" * 60)
    
    tables_param = [
        ('ERM_Param_GraviteDesImpacts', 'Gravité des impacts'),
        ('ERM_Param_ProbabiliteSucces', 'Probabilité de succès'),
        ('ERM_Param_DifficulteTechnique', 'Difficulté technique'),
        ('ERM_Param_Vraisemblance', 'Vraisemblance'),
        ('ERM_Param_Pertinence', 'Pertinence'),
        ('ERM_Param_CanalExfiltration', 'Canaux d\'exfiltration')
    ]
    
    for table, description in tables_param:
        print(f"\n{description.upper()}")
        print("-" * len(description))
        cursor = conn.execute(f"SELECT * FROM {table}")
        for row in cursor.fetchall():
            print(f"  {row}")

def main():
    """Fonction principale d'analyse"""
    try:
        conn = connect_database()
        
        print("ANALYSE COMPLÈTE DU CAS D'ÉTUDE EBIOS RM")
        print("=" * 80)
        print()
        
        # Informations générales
        cursor = conn.execute("SELECT * FROM ERM_SocieteMission")
        mission = cursor.fetchone()
        if mission:
            print(f"Organisation: {mission[0]}")
            print(f"Mission: {mission[3]}")
            print()
        
        # Analyse par atelier
        analyze_atelier_1(conn)
        analyze_atelier_2(conn)
        analyze_atelier_3(conn)
        analyze_atelier_4(conn)
        analyze_atelier_5(conn)
        analyze_parametrage(conn)
        
        print("=" * 80)
        print("ANALYSE TERMINÉE")
        print("=" * 80)
        
    except Exception as e:
        print(f"Erreur lors de l'analyse : {e}")
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    main() 