#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script d'améliorations EBIOS AI Manager
Implémentation des corrections prioritaires basées sur l'analyse du cas d'étude BioTechVac
"""

import sqlite3
import json
import os
from pathlib import Path
from typing import Dict, List, Any

class EbiosAIImprover:
    """Classe pour implémenter les améliorations de l'application EBIOS AI Manager"""
    
    def __init__(self, db_path: str = "EBIOS-RM V1.5 (1)_converted.db"):
        self.db_path = db_path
        self.improvements = []
        self.errors = []
        
    def analyze_data_integrity(self) -> Dict[str, Any]:
        """Analyser l'intégrité des données du cas d'étude"""
        print("🔍 ANALYSE DE L'INTÉGRITÉ DES DONNÉES")
        print("=" * 50)
        
        integrity_report = {
            "missing_references": [],
            "truncated_data": [],
            "inconsistent_links": [],
            "orphaned_records": []
        }
        
        try:
            conn = sqlite3.connect(self.db_path)
            
            # 1. Vérifier les références manquantes entre ateliers
            print("\n1. Vérification des références inter-ateliers...")
            integrity_report["missing_references"] = self._check_missing_references(conn)
            
            # 2. Détecter les données tronquées
            print("\n2. Détection des données tronquées...")
            integrity_report["truncated_data"] = self._check_truncated_data(conn)
            
            # 3. Vérifier la cohérence des liens
            print("\n3. Vérification de la cohérence des liens...")
            integrity_report["inconsistent_links"] = self._check_inconsistent_links(conn)
            
            # 4. Identifier les enregistrements orphelins
            print("\n4. Identification des enregistrements orphelins...")
            integrity_report["orphaned_records"] = self._check_orphaned_records(conn)
            
            conn.close()
            
        except Exception as e:
            self.errors.append(f"Erreur lors de l'analyse d'intégrité: {e}")
            
        return integrity_report
    
    def _check_missing_references(self, conn: sqlite3.Connection) -> List[Dict[str, str]]:
        """Vérifier les références manquantes entre tables"""
        missing_refs = []
        
        # Vérifier "Prestataire informatique" dans les parties prenantes
        cursor = conn.execute("SELECT DISTINCT [Partie Prenante] FROM ERM_CheminAttaque WHERE [Partie Prenante] IS NOT NULL")
        parties_in_chemins = [row[0] for row in cursor.fetchall()]
        
        cursor = conn.execute("SELECT [Partie Prenante] FROM ERM_PartiePrenante")
        parties_in_table = [row[0] for row in cursor.fetchall()]
        
        for partie in parties_in_chemins:
            if partie and partie not in parties_in_table:
                missing_refs.append({
                    "type": "Partie Prenante manquante",
                    "table_source": "ERM_CheminAttaque",
                    "table_cible": "ERM_PartiePrenante",
                    "valeur_manquante": partie,
                    "impact": "CRITIQUE - Empêche la cohérence Atelier 4"
                })
                print(f"   ❌ Partie prenante manquante: {partie}")
        
        return missing_refs
    
    def _check_truncated_data(self, conn: sqlite3.Connection) -> List[Dict[str, str]]:
        """Détecter les données probablement tronquées"""
        truncated_data = []
        
        # Vérifier les descriptions des événements redoutés
        cursor = conn.execute("SELECT [Valeur Metier], [Evenement Redoute] FROM ERM_EvenementRedoute")
        for row in cursor.fetchall():
            valeur_metier, evenement = row
            if evenement and (len(evenement) > 80 and not evenement.endswith('.')):
                truncated_data.append({
                    "type": "Événement redouté potentiellement tronqué",
                    "table": "ERM_EvenementRedoute",
                    "valeur_metier": valeur_metier,
                    "contenu": evenement[:50] + "...",
                    "impact": "CRITIQUE - Atelier 3 compromis"
                })
                print(f"   ⚠️ Événement potentiellement tronqué: {evenement[:50]}...")
        
        # Vérifier les impacts
        cursor = conn.execute("SELECT [Valeur Metier], [Evenement Redoute], Impacts FROM ERM_EvenementRedouteImpact")
        for row in cursor.fetchall():
            valeur_metier, evenement, impact = row
            if impact and (len(impact) > 50 and not impact.endswith('.') and not impact.endswith('!')):
                truncated_data.append({
                    "type": "Impact potentiellement tronqué",
                    "table": "ERM_EvenementRedouteImpact",
                    "valeur_metier": valeur_metier,
                    "evenement": evenement,
                    "contenu": impact[:50] + "...",
                    "impact": "MAJEUR - Description des impacts incomplète"
                })
                print(f"   ⚠️ Impact potentiellement tronqué: {impact[:50]}...")
        
        return truncated_data
    
    def _check_inconsistent_links(self, conn: sqlite3.Connection) -> List[Dict[str, str]]:
        """Vérifier la cohérence des liens entre objets"""
        inconsistent_links = []
        
        # Vérifier cohérence des scénarios de risque
        cursor = conn.execute("""
            SELECT [Id Scenario Risque], [Source Risque], [Objectif Vise], [Valeur Metier]
            FROM ERM_ScenarioRisque
        """)
        
        for row in cursor.fetchall():
            scenario_id, source, objectif, valeur_metier = row
            
            # Vérifier que la source existe
            source_cursor = conn.execute("SELECT COUNT(*) FROM ERM_SourceRisque WHERE [Source de Risque] = ?", (source,))
            if source_cursor.fetchone()[0] == 0:
                inconsistent_links.append({
                    "type": "Source de risque inexistante dans scénario",
                    "scenario_id": scenario_id,
                    "source_manquante": source,
                    "impact": "CRITIQUE - Scénario de risque incohérent"
                })
                print(f"   ❌ Source manquante dans scénario {scenario_id}: {source}")
        
        return inconsistent_links
    
    def _check_orphaned_records(self, conn: sqlite3.Connection) -> List[Dict[str, str]]:
        """Identifier les enregistrements orphelins"""
        orphaned_records = []
        
        # Vérifier les mesures de sécurité sans scénarios liés
        cursor = conn.execute("""
            SELECT [Mesure Securite]
            FROM ERM_PlanSecurite 
            WHERE [Mesure Securite] NOT IN (
                SELECT [Mesure Securite] FROM ERM_PlanSecuriteScenario
            )
        """)
        
        for row in cursor.fetchall():
            mesure = row[0]
            orphaned_records.append({
                "type": "Mesure de sécurité orpheline",
                "table": "ERM_PlanSecurite",
                "enregistrement": mesure,
                "impact": "MINEUR - Mesure non reliée aux scénarios"
            })
            print(f"   ⚠️ Mesure orpheline: {mesure}")
        
        return orphaned_records
    
    def generate_recommendations(self, integrity_report: Dict[str, Any]) -> Dict[str, Any]:
        """Générer des recommandations d'amélioration"""
        print("\n🔧 GÉNÉRATION DES RECOMMANDATIONS")
        print("=" * 40)
        
        recommendations = {
            "priority_1": [],
            "priority_2": [],
            "priority_3": []
        }
        
        # Priorité 1 - Corrections critiques
        if integrity_report["missing_references"]:
            recommendations["priority_1"].append({
                "title": "Corriger les références manquantes",
                "description": "Ajouter les parties prenantes manquantes",
                "action": "ADD_MISSING_REFERENCES",
                "urgency": "IMMÉDIATE"
            })
        
        return recommendations
    
    def export_plan(self, recommendations: Dict[str, Any]) -> str:
        """Exporter le plan d'amélioration"""
        plan = {
            "version": "1.0",
            "case_study": "BioTechVac",
            "recommendations": recommendations
        }
        
        output_file = "plan_amelioration.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(plan, f, indent=2, ensure_ascii=False)
        
        return output_file
    
    def run_analysis(self):
        """Exécuter l'analyse complète"""
        print("🚀 ANALYSE EBIOS AI MANAGER")
        print("=" * 40)
        
        # Analyser l'intégrité
        integrity_report = self.analyze_data_integrity()
        
        # Générer les recommandations
        recommendations = self.generate_recommendations(integrity_report)
        
        # Exporter le plan
        plan_file = self.export_plan(recommendations)
        
        print(f"\n✅ Analyse terminée!")
        print(f"📄 Plan exporté: {plan_file}")
        
        return {
            "integrity_report": integrity_report,
            "recommendations": recommendations,
            "plan_file": plan_file
        }

def main():
    """Fonction principale"""
    print("🛠️ EBIOS AI MANAGER - ANALYSEUR")
    
    # Vérifier la base
    db_path = "EBIOS-RM V1.5 (1)_converted.db"
    if not Path(db_path).exists():
        print(f"❌ Base non trouvée: {db_path}")
        return
    
    # Lancer l'analyse
    improver = EbiosAIImprover(db_path)
    result = improver.run_analysis()
    
    print("🎉 Terminé!")

if __name__ == "__main__":
    main() 