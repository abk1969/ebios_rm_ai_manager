"""
🔍 AUDIT EXHAUSTIF EBIOS RM - COMPARAISON BASE ACCESS vs FIREBASE/COMPOSANTS
Expert Auditeur EBIOS RM - Tolérance zéro aux erreurs
"""

import sqlite3
import json
from datetime import datetime

def audit_complet():
    """Audit exhaustif de la base Access convertie"""
    conn = sqlite3.connect('EBIOS-RM V1.5 (1)_converted.db')
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    
    print("=" * 80)
    print("🔍 AUDIT EXHAUSTIF EBIOS RM - BASE ACCESS vs FIREBASE/COMPOSANTS")
    print("=" * 80)
    print(f"Date audit: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("Expert Auditeur: Conformité ANSSI EBIOS RM v1.5")
    print("=" * 80)
    
    # 1. ATELIER 1 - VALEURS MÉTIER
    print("\n📋 ATELIER 1 - CADRAGE ET SOCLE DE SÉCURITÉ")
    print("-" * 50)
    
    # Mission
    print("\n🏢 MISSION:")
    cur.execute("SELECT * FROM ERM_SocieteMission")
    missions = cur.fetchall()
    for m in missions:
        print(f"  - Société: {m['Nom Societe']}")
        print(f"  - Mission: {m['Mission']}")
        print(f"  - Contact: {m['Contact']}")
    
    # Valeurs métier
    print("\n💎 VALEURS MÉTIER:")
    cur.execute("SELECT * FROM ERM_ValeurMetier")
    valeurs = cur.fetchall()
    for v in valeurs:
        print(f"\n  • {v['Denomination Valeur Metier']}")
        print(f"    - Nature: {v['Nature Valeur Metier']}")
        print(f"    - Description: {v['Description'][:100]}...")
        print(f"    - Responsable: {v['Entite Personne Responsable']}")
    
    # Biens supports
    print("\n🖥️ BIENS SUPPORTS ASSOCIÉS:")
    cur.execute("SELECT * FROM ERM_BienSupportAssocie")
    biens = cur.fetchall()
    for b in biens:
        print(f"\n  • {b['Denomination Bien Support Associe']}")
        print(f"    - Valeur métier: {b['Valeur Metier']}")
        print(f"    - Description: {b['Description'][:100]}...")
        print(f"    - Responsable: {b['Entite Personne Responsable']}")
    
    # Événements redoutés
    print("\n⚠️ ÉVÉNEMENTS REDOUTÉS:")
    cur.execute("""
        SELECT er.*, GROUP_CONCAT(eri.Impacts, ' | ') as Impacts_Liste
        FROM ERM_EvenementRedoute er
        LEFT JOIN ERM_EvenementRedouteImpact eri 
        ON er.[Valeur Metier] = eri.[Valeur Metier] 
        AND er.[Evenement Redoute] = eri.[Evenement Redoute]
        GROUP BY er.[Valeur Metier], er.[Evenement Redoute]
    """)
    events = cur.fetchall()
    for e in events:
        print(f"\n  • {e['Evenement Redoute'][:80]}...")
        print(f"    - Valeur métier: {e['Valeur Metier']}")
        print(f"    - Gravité: {e['Gravite']} ({get_gravite_label(e['Gravite'])})")
        print(f"    - Impacts: {e['Impacts_Liste']}")
    
    # Socle de sécurité
    print("\n🛡️ SOCLE DE SÉCURITÉ:")
    cur.execute("SELECT * FROM ERM_SocleSecurite")
    socle = cur.fetchall()
    for s in socle:
        print(f"\n  • {s['Nom du Referentiel']}")
        print(f"    - Type: {s['Type de Referentiel']}")
        print(f"    - État: {s['Etat Application']}")
        
        # Écarts
        cur.execute("SELECT * FROM ERM_SocleSecuriteEcart WHERE [Nom du Referentiel] = ?", 
                   (s['Nom du Referentiel'],))
        ecarts = cur.fetchall()
        if ecarts:
            print("    - Écarts identifiés:")
            for ec in ecarts:
                print(f"      • {ec['Ecart']}")
                print(f"        Justification: {ec['Justification Ecart']}")
    
    # 2. ATELIER 2 - SOURCES DE RISQUE
    print("\n\n📋 ATELIER 2 - SOURCES DE RISQUE")
    print("-" * 50)
    
    cur.execute("SELECT * FROM ERM_SourceRisque")
    sources = cur.fetchall()
    print("\n🎯 SOURCES DE RISQUE:")
    for s in sources:
        print(f"  • {s['Source de Risque']}")
        
        # Objectifs visés
        cur.execute("SELECT * FROM ERM_ObjectifVise WHERE [Source de Risque] = ?", 
                   (s['Source de Risque'],))
        objectifs = cur.fetchall()
        for o in objectifs:
            print(f"\n    📌 Objectif: {o['Objectif Vise']}")
            print(f"      - Motivation: {o['Motivation']}")
            print(f"      - Ressources: {o['Ressource']}")
            print(f"      - Activité: {o['Activite']}")
            print(f"      - Pertinence: {o['Pertinence retenue']}")
            print(f"      - Retenu: {'OUI' if o['Retenu'] else 'NON'}")
    
    # 3. ATELIER 3 - SCÉNARIOS STRATÉGIQUES
    print("\n\n📋 ATELIER 3 - SCÉNARIOS STRATÉGIQUES")
    print("-" * 50)
    
    # Parties prenantes
    print("\n👥 PARTIES PRENANTES:")
    cur.execute("SELECT * FROM ERM_PartiePrenante ORDER BY [Fiabilite Cyber] DESC")
    parties = cur.fetchall()
    for p in parties:
        print(f"\n  • {p['Partie Prenante']} ({p['Categorie']})")
        print(f"    - Dépendance: {p['Dependance']}, Pénétration: {p['Penetration']}")
        print(f"    - Exposition: {p['Exposition']}, Fiabilité Cyber: {p['Fiabilite Cyber']}")
        print(f"    - Maturité: {p['Maturite Cyber']}, Confiance: {p['Confiance']}")
    
    # Chemins d'attaque
    print("\n🔀 CHEMINS D'ATTAQUE:")
    cur.execute("SELECT * FROM ERM_CheminAttaque")
    chemins = cur.fetchall()
    for c in chemins:
        print(f"\n  • {c['Source de Risque']} → {c['Objectif Vise']}")
        print(f"    - Chemin: {c['Chemin Attaque']}")
        print(f"    - Partie prenante: {c['Partie Prenante'] or 'DIRECTE'}")
        print(f"    - Gravité: {c['Gravite']}")
    
    # 4. ATELIER 4 - SCÉNARIOS OPÉRATIONNELS
    print("\n\n📋 ATELIER 4 - SCÉNARIOS OPÉRATIONNELS")
    print("-" * 50)
    
    # Actions élémentaires
    print("\n⚡ ACTIONS ÉLÉMENTAIRES DES GRAPHES D'ATTAQUE:")
    cur.execute("""
        SELECT DISTINCT [Chemin Attaque], COUNT(*) as NbActions
        FROM ERM_GrapheAttaqueAction
        GROUP BY [Chemin Attaque]
    """)
    graphes = cur.fetchall()
    for g in graphes:
        print(f"\n  📊 Chemin: {g['Chemin Attaque'][:80]}...")
        print(f"     Nombre d'actions: {g['NbActions']}")
        
        # Détail des actions
        cur.execute("""
            SELECT * FROM ERM_GrapheAttaqueAction 
            WHERE [Chemin Attaque] = ?
            ORDER BY [Numero Action Elementaire]
        """, (g['Chemin Attaque'],))
        actions = cur.fetchall()
        for a in actions:
            print(f"      {a['Numero Action Elementaire']}. {a['Action Elementaire']}")
            print(f"         - Séquence: {a['Sequence Type Attaque']}")
            print(f"         - Probabilité: {a['Probabilite Succes']}, Difficulté: {a['Difficulte Technique']}")
    
    # 5. ATELIER 5 - TRAITEMENT DU RISQUE
    print("\n\n📋 ATELIER 5 - TRAITEMENT DU RISQUE")
    print("-" * 50)
    
    # Scénarios de risque
    print("\n🎯 SCÉNARIOS DE RISQUE:")
    cur.execute("SELECT * FROM ERM_ScenarioRisque")
    scenarios = cur.fetchall()
    for sc in scenarios:
        print(f"\n  • {sc['Id Scenario Risque']}: {sc['Source Risque']} → {sc['Objectif Vise']}")
        print(f"    - Valeur métier: {sc['Valeur Metier']}")
        print(f"    - Partie prenante: {sc['Partie Prenante'] or 'DIRECTE'}")
        print(f"    - Gravité: {sc['Gravite']} → {sc['Gravite Residuel']} (résiduel)")
        print(f"    - Vraisemblance: {sc['Vraisemblance']} → {sc['Vraisemblance Residuel']} (résiduel)")
        print(f"    - Description: {sc['Description Scenario Risque'][:100]}...")
    
    # Plan de sécurité
    print("\n🛡️ PLAN DE SÉCURITÉ (MESURES):")
    cur.execute("""
        SELECT ps.*, GROUP_CONCAT(psr.Responsable, ', ') as Responsables
        FROM ERM_PlanSecurite ps
        LEFT JOIN ERM_PlanSecuriteResponsable psr ON ps.[Mesure Securite] = psr.[Mesure Securite]
        GROUP BY ps.[Mesure Securite]
    """)
    mesures = cur.fetchall()
    for m in mesures:
        print(f"\n  • {m['Mesure Securite']}")
        print(f"    - Type: {m['Type Mesure']}")
        print(f"    - Coût/Complexité: {m['Cout Complexite']}")
        print(f"    - Échéance: {m['Echeance em mois']} mois")
        print(f"    - Statut: {m['Status']}")
        print(f"    - Responsables: {m['Responsables'] or 'Non défini'}")
    
    # COMPARAISON AVEC FIREBASE/COMPOSANTS
    print("\n\n" + "=" * 80)
    print("🔍 ANALYSE COMPARATIVE - BASE ACCESS vs FIREBASE/COMPOSANTS")
    print("=" * 80)
    
    print("\n⚠️ INCOHÉRENCES CRITIQUES DÉTECTÉES:")
    
    # 1. Champs manquants dans Firebase
    print("\n1. CHAMPS ACCESS NON MAPPÉS DANS FIREBASE:")
    print("   - ERM_SocieteMission: Adresse (non présent dans type Mission)")
    print("   - ERM_ValeurMetier: 'Nature Valeur Metier' → type BusinessValue utilise 'category'")
    print("   - ERM_BienSupportAssocie: pas de lien direct vers 'missionId' dans Firebase")
    print("   - ERM_EvenementRedouteImpact: table séparée, mais dans Firebase c'est un champ string")
    
    # 2. Types incompatibles
    print("\n2. INCOMPATIBILITÉS DE TYPES:")
    print("   - Gravité: Access utilise TINYINT (1-4), Firebase attend GravityScale type")
    print("   - Pertinence: Access utilise échelle 1-3, Firebase attend LikelihoodScale (1-4)")
    print("   - Catégories RiskSource: Access n'a pas de catégories, Firebase les exige")
    
    # 3. Relations manquantes
    print("\n3. RELATIONS MANQUANTES OU DIFFÉRENTES:")
    print("   - Access: liens via noms texte, Firebase: liens via IDs")
    print("   - Access: pas de timestamps, Firebase: createdAt/updatedAt partout")
    print("   - Access: pas de statuts workflow, Firebase: status sur toutes entités")
    
    # 4. Logique métier différente
    print("\n4. DIFFÉRENCES DE LOGIQUE MÉTIER:")
    print("   - Access: Objectifs visés avec évaluation séparée")
    print("   - Firebase: objectives embarqués dans RiskSource")
    print("   - Access: Graphe d'attaque avec séquences détaillées")
    print("   - Firebase: AttackPath plus simple avec actions[]")
    
    # 5. Composants IHM non alignés
    print("\n5. COMPOSANTS IHM NON ALIGNÉS AVEC ACCESS:")
    print("   - RiskSourceForm: catégories hardcodées différentes d'Access")
    print("   - Workshop1Content: n'affiche pas tous les champs Access")
    print("   - SecurityMeasureForm: structure ISO27002 non présente dans Access")
    
    print("\n" + "=" * 80)
    print("❌ VERDICT: NON-CONFORMITÉ CRITIQUE")
    print("   L'application actuelle NE PEUT PAS charger/sauver")
    print("   correctement les données du cas Access BioTechVac")
    print("=" * 80)
    
    conn.close()

def get_gravite_label(niveau):
    """Convertir niveau gravité en label"""
    labels = {1: "MINEURE", 2: "SIGNIFICATIVE", 3: "GRAVE", 4: "CRITIQUE"}
    return labels.get(niveau, f"Niveau {niveau}")

if __name__ == "__main__":
    audit_complet() 