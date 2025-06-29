# 🏛️ **ATELIER 1 - SOCLE DE SÉCURITÉ - PLAN DÉTAILLÉ COMPLET**

## 📋 **CONTEXTE ET OBJECTIFS**

### **🎯 MISSION DE L'ATELIER 1 :**
Établir le **socle de sécurité** de l'analyse EBIOS RM en définissant le périmètre, les enjeux métier et les biens essentiels du CHU Métropolitain pour créer les fondations solides de l'analyse de risque.

### **🏥 SPÉCIALISATION CHU MÉTROPOLITAIN :**

**📊 CONTEXTE HOSPITALIER RÉALISTE :**
```
🏥 CHU Métropolitain
├── 3 sites interconnectés (Hôpital Principal, Clinique Spécialisée, Centre Ambulatoire)
├── 3500 employés (2800 soignants, 700 administratifs)
├── 1200 lits (800 médecine/chirurgie, 200 réanimation, 200 urgences)
├── Budget annuel : 450M€
├── 50 000 patients/an en hospitalisation
├── 180 000 passages/an aux urgences
└── Spécialités : Cardiologie, Neurochirurgie, Oncologie, Pédiatrie, Urgences

🔗 Interconnexions critiques :
• SIH (Système d'Information Hospitalier) centralisé
• PACS (Picture Archiving Communication System) multi-sites
• Réseau de télémédecine régional
• Liaisons laboratoires externes
• Connexions établissements partenaires
```

### **🎯 ENJEUX SPÉCIFIQUES SECTEUR SANTÉ :**

**⚖️ RESPONSABILITÉS LÉGALES :**
```
✅ Responsabilité pénale des dirigeants (Art. 121-2 Code pénal)
✅ Obligation de continuité des soins (Code de la santé publique)
✅ Protection données de santé (RGPD + Code de la santé publique)
✅ Certification HDS (Hébergement Données de Santé)
✅ Accréditation HAS (Haute Autorité de Santé)
✅ Conformité dispositifs médicaux (Règlement MDR)
```

**💰 IMPACTS FINANCIERS SPÉCIFIQUES :**
```
🔴 Arrêt d'activité : 1.2M€/jour de perte
🔴 Fuite données patients : 150€/dossier (RGPD) × 500k dossiers = 75M€
🔴 Perte de certification HDS : Arrêt activité obligatoire
🔴 Responsabilité civile : Jusqu'à 100M€ selon jurisprudence
🔴 Atteinte réputation : -30% activité pendant 2 ans
🔴 Coûts de récupération : 5-15M€ selon incident
```

## 🎯 **POINT 1 - CONTENU DÉTAILLÉ CADRAGE ET SOCLE (90 MINUTES)**

### **📋 MODULE 1.1 - CADRAGE DE LA MISSION (25 MINUTES)**

**🎯 OBJECTIFS D'APPRENTISSAGE :**
- Maîtriser la définition du périmètre d'analyse EBIOS RM
- Identifier les enjeux métier spécifiques au secteur santé
- Comprendre les contraintes réglementaires hospitalières
- Définir les objectifs de sécurité adaptés au CHU

**📚 CONTENU THÉORIQUE (15 MINUTES) :**

**🔍 1. Définition du périmètre CHU**
```
Périmètre organisationnel :
• 3 sites géographiques interconnectés
• 12 services médicaux critiques
• 8 services support (IT, RH, Finance, Logistique)
• 15 laboratoires et plateaux techniques
• Réseau de 25 établissements partenaires

Périmètre fonctionnel :
• Soins aux patients (urgences, hospitalisation, ambulatoire)
• Recherche clinique et enseignement médical
• Gestion administrative et financière
• Logistique médicale et pharmaceutique
• Système d'information et télécommunications

Périmètre temporel :
• Analyse sur 3 ans (2024-2027)
• Révision annuelle obligatoire
• Mise à jour trimestrielle des menaces
```

**⚖️ 2. Enjeux métier hospitaliers**
```
Enjeux vitaux :
• Continuité des soins 24h/24, 7j/7
• Sécurité des patients et du personnel
• Qualité et traçabilité des soins
• Confidentialité des données de santé

Enjeux économiques :
• Équilibre financier (T2A + dotations)
• Optimisation des coûts opérationnels
• Investissements en équipements médicaux
• Gestion des ressources humaines

Enjeux réglementaires :
• Conformité HDS et certification HAS
• Respect RGPD et secret médical
• Obligations de déclaration ANSSI
• Normes qualité et accréditations

Enjeux stratégiques :
• Réputation et attractivité territoriale
• Partenariats et coopérations
• Innovation et recherche médicale
• Transformation numérique santé
```

**🎯 3. Objectifs de sécurité CHU**
```
Disponibilité (CRITIQUE) :
• SIH : 99.9% (8h d'arrêt max/an)
• Urgences : 99.99% (52min d'arrêt max/an)
• Bloc opératoire : 99.95% (4h d'arrêt max/an)
• PACS : 99.8% (17h d'arrêt max/an)

Intégrité (CRITIQUE) :
• Données patients : 100% intègres
• Prescriptions médicales : 100% fiables
• Résultats examens : 100% exacts
• Dossiers médicaux : 100% cohérents

Confidentialité (CRITIQUE) :
• Données de santé : Secret médical absolu
• Recherche clinique : Anonymisation garantie
• Données RH : Protection vie privée
• Informations financières : Confidentialité comptable

Traçabilité (MAJEURE) :
• Accès aux données : Logs complets 7 ans
• Modifications : Audit trail permanent
• Authentification : Traçabilité nominative
• Incidents : Documentation exhaustive
```

**🛠️ ACTIVITÉ PRATIQUE (10 MINUTES) :**
```
Exercice : Définition du périmètre CHU
• Travail en binômes (5 min)
• Identifier 3 enjeux critiques spécifiques au CHU
• Définir 2 objectifs de sécurité prioritaires
• Justifier les choix avec contraintes réglementaires
• Restitution collective (5 min)
```

### **🏗️ MODULE 1.2 - IDENTIFICATION DES BIENS ESSENTIELS (35 MINUTES)**

**🎯 OBJECTIFS D'APPRENTISSAGE :**
- Maîtriser la méthodologie d'identification des biens essentiels
- Classifier les biens selon leur criticité hospitalière
- Évaluer les impacts métier en cas d'indisponibilité
- Cartographier les dépendances entre biens essentiels

**📚 CONTENU THÉORIQUE (20 MINUTES) :**

**🔍 1. Méthodologie d'identification ANSSI adaptée santé**
```
Étape 1 - Inventaire exhaustif :
• Processus métier hospitaliers (soins, support, recherche)
• Informations critiques (dossiers patients, prescriptions)
• Systèmes d'information (SIH, PACS, laboratoires)
• Infrastructures techniques (réseaux, serveurs, équipements)

Étape 2 - Analyse d'impact métier :
• Impact sur la continuité des soins
• Impact sur la sécurité des patients
• Impact financier et réglementaire
• Impact sur la réputation et l'image

Étape 3 - Classification par criticité :
• CRITIQUE : Vies en jeu, arrêt d'activité immédiat
• MAJEUR : Impact patient significatif, perte financière
• MODÉRÉ : Gêne opérationnelle, dégradation qualité
• MINEUR : Impact limité, solutions de contournement

Étape 4 - Validation par les métiers :
• Validation par les chefs de service médicaux
• Validation par la direction des soins
• Validation par la direction générale
• Validation par le RSSI et la DSI
```

**🏥 2. Biens essentiels spécifiques CHU**
```
PROCESSUS MÉTIER CRITIQUES :
✅ Urgences vitales (CRITIQUE)
   • Accueil et tri des urgences
   • Réanimation et soins intensifs
   • Bloc opératoire d'urgence
   • Laboratoires d'urgence (biologie, imagerie)
   Impact : Vies en jeu, responsabilité pénale

✅ Hospitalisation complète (CRITIQUE)
   • Admissions et sorties patients
   • Soins infirmiers et médicaux
   • Prescriptions et administrations
   • Surveillance et monitoring
   Impact : Continuité soins, sécurité patients

✅ Plateau technique (MAJEUR)
   • Blocs opératoires programmés
   • Imagerie médicale (IRM, scanner, radio)
   • Laboratoires d'analyses
   • Pharmacie hospitalière
   Impact : Report d'activité, perte financière

INFORMATIONS CRITIQUES :
✅ Dossiers patients informatisés (CRITIQUE)
   • Identité et données administratives
   • Antécédents et allergies
   • Prescriptions et traitements
   • Résultats d'examens et comptes-rendus
   Impact : Erreurs médicales, responsabilité

✅ Images médicales PACS (CRITIQUE)
   • Radiographies et scanners
   • IRM et échographies
   • Images interventionnelles
   • Historiques et comparaisons
   Impact : Erreurs diagnostic, retards soins

✅ Données de recherche clinique (MAJEUR)
   • Protocoles et inclusions
   • Données anonymisées patients
   • Résultats et analyses
   • Publications et brevets
   Impact : Perte recherche, propriété intellectuelle

SYSTÈMES D'INFORMATION :
✅ SIH - Système Information Hospitalier (CRITIQUE)
   • Serveurs centraux et bases de données
   • Applications métier (admissions, soins, facturation)
   • Interfaces et échanges de données
   • Sauvegardes et archivage
   Impact : Paralysie totale activité

✅ PACS - Picture Archiving System (CRITIQUE)
   • Serveurs de stockage images
   • Stations de visualisation
   • Réseaux de transmission
   • Systèmes d'archivage long terme
   Impact : Arrêt imagerie, erreurs diagnostic

✅ Réseaux et télécommunications (CRITIQUE)
   • Infrastructure réseau interne
   • Connexions internet et VPN
   • Téléphonie et messagerie
   • Systèmes de géolocalisation
   Impact : Isolement, perte communication

INFRASTRUCTURES TECHNIQUES :
✅ Centres de données (CRITIQUE)
   • Serveurs physiques et virtuels
   • Systèmes de stockage (SAN, NAS)
   • Équipements réseau (switches, routeurs)
   • Systèmes de sauvegarde
   Impact : Arrêt complet SI

✅ Alimentations électriques (CRITIQUE)
   • Onduleurs et groupes électrogènes
   • Tableaux électriques critiques
   • Circuits dédiés blocs et réanimation
   • Systèmes de supervision
   Impact : Arrêt équipements vitaux

✅ Climatisation et environnement (MAJEUR)
   • Climatisation salles serveurs
   • Contrôle température blocs
   • Systèmes de ventilation
   • Détection incendie et intrusion
   Impact : Surchauffe, arrêt équipements
```

**📊 3. Matrice de criticité CHU**
```
GRILLE D'ÉVALUATION SPÉCIALISÉE SANTÉ :

Impact sur les soins :
• CRITIQUE (4) : Vies en jeu immédiat
• MAJEUR (3) : Retard soins, complications possibles
• MODÉRÉ (2) : Gêne opérationnelle, qualité dégradée
• MINEUR (1) : Impact limité, contournement possible

Impact financier :
• CRITIQUE (4) : >1M€/jour de perte
• MAJEUR (3) : 100k€-1M€/jour de perte
• MODÉRÉ (2) : 10k€-100k€/jour de perte
• MINEUR (1) : <10k€/jour de perte

Impact réglementaire :
• CRITIQUE (4) : Sanctions pénales, fermeture
• MAJEUR (3) : Amendes CNIL, perte certifications
• MODÉRÉ (2) : Mise en demeure, contrôles
• MINEUR (1) : Observations, recommandations

Impact réputation :
• CRITIQUE (4) : Crise médiatique nationale
• MAJEUR (3) : Médiatisation régionale négative
• MODÉRÉ (2) : Questionnements locaux
• MINEUR (1) : Impact limité communication

Score global = MAX(Impact soins, Impact financier, Impact réglementaire)
```

**🛠️ ACTIVITÉ PRATIQUE (15 MINUTES) :**
```
Exercice : Classification des biens essentiels
• Travail en groupes de 4 (10 min)
• Classer 8 biens essentiels CHU selon la matrice
• Justifier la criticité avec impacts métier
• Identifier 2 dépendances critiques entre biens
• Présentation rapide par groupe (5 min)

Biens à classer :
1. SIH - Dossiers patients informatisés
2. PACS - Images médicales
3. Urgences vitales 24h/24
4. Bloc opératoire
5. Laboratoires d'analyses
6. Pharmacie hospitalière
7. Réseaux et télécommunications
8. Centre de données principal
```

### **🔗 MODULE 1.3 - ÉCOSYSTÈME ET DÉPENDANCES (30 MINUTES)**

**🎯 OBJECTIFS D'APPRENTISSAGE :**
- Cartographier l'écosystème numérique du CHU
- Identifier les dépendances critiques externes
- Analyser les risques de la chaîne d'approvisionnement
- Évaluer les impacts des défaillances en cascade

**📚 CONTENU THÉORIQUE (20 MINUTES) :**

**🌐 1. Écosystème numérique CHU**
```
PARTENAIRES CRITIQUES :
✅ Fournisseurs technologiques :
   • Éditeur SIH (maintenance, mises à jour)
   • Fournisseur PACS (support, évolutions)
   • Opérateurs télécoms (connectivité, sécurité)
   • Prestataires cloud (hébergement, sauvegarde)
   • Intégrateurs SI (projets, maintenance)

✅ Partenaires métier :
   • Laboratoires externes (analyses spécialisées)
   • Centres d'imagerie partenaires
   • Pharmacies centrales d'achat
   • Établissements de soins partenaires
   • Organismes de tutelle (ARS, CPAM)

✅ Prestataires de services :
   • Sociétés de maintenance (équipements biomédicaux)
   • Prestataires de sécurité (gardiennage, transport)
   • Sociétés de nettoyage et logistique
   • Cabinets d'audit et conseil
   • Assureurs et courtiers

DÉPENDANCES TECHNOLOGIQUES :
✅ Infrastructures critiques :
   • Réseaux opérateurs (Orange, SFR, Bouygues)
   • Fournisseurs électricité (EDF, distributeurs)
   • Services cloud (Microsoft, Google, AWS)
   • Centres de données tiers (hébergement)
   • Réseaux santé régionaux (GRADeS)

✅ Applications métier :
   • SIH principal (éditeur unique)
   • PACS et RIS (imagerie médicale)
   • Logiciels de laboratoire (LIS)
   • Applications de pharmacie
   • Outils de télémédecine

✅ Services externalisés :
   • Messagerie sécurisée de santé (MSSanté)
   • Téléservices CPAM et mutuelles
   • Plateformes d'échanges régionales
   • Services d'identité numérique
   • Solutions de sauvegarde externalisées
```

**⚠️ 2. Analyse des risques de dépendance**
```
RISQUES FOURNISSEURS :
🔴 Défaillance éditeur SIH :
   • Probabilité : Faible (2/5)
   • Impact : Critique (4/4)
   • Conséquences : Arrêt total activité
   • Mitigation : Contrat de service renforcé, plan de continuité

🔴 Panne opérateur télécom principal :
   • Probabilité : Modérée (3/5)
   • Impact : Critique (4/4)
   • Conséquences : Isolement, perte communications
   • Mitigation : Double opérateur, liaisons de secours

🔴 Cyberattaque fournisseur cloud :
   • Probabilité : Modérée (3/5)
   • Impact : Majeur (3/4)
   • Conséquences : Indisponibilité services, fuite données
   • Mitigation : Multi-cloud, chiffrement, sauvegardes

RISQUES EN CASCADE :
🔴 Effet domino laboratoires :
   • Défaillance laboratoire central → Arrêt analyses
   • Impact : Retard diagnostics, reports interventions
   • Propagation : 24h pour impact patient critique

🔴 Effet domino imagerie :
   • Panne PACS → Perte accès images historiques
   • Impact : Erreurs diagnostic, retards soins
   • Propagation : 2h pour impact opérationnel critique

🔴 Effet domino pharmacie :
   • Rupture approvisionnement → Pénurie médicaments
   • Impact : Arrêt traitements, transferts patients
   • Propagation : 48h pour impact patient critique
```

**🛡️ 3. Stratégies de résilience**
```
DIVERSIFICATION :
✅ Multi-sourcing critique :
   • 2 opérateurs télécoms minimum
   • 2 fournisseurs cloud pour services critiques
   • 2 laboratoires pour analyses urgentes
   • 2 pharmacies pour approvisionnement

✅ Redondance géographique :
   • Sites de secours distants >50km
   • Sauvegardes multi-sites
   • Centres de données répartis
   • Équipes de crise décentralisées

CONTRACTUALISATION :
✅ SLA renforcés :
   • Disponibilité >99.9% pour services critiques
   • MTTR <4h pour pannes majeures
   • Pénalités financières dissuasives
   • Audits sécurité trimestriels

✅ Plans de continuité :
   • Procédures de bascule automatiques
   • Modes dégradés documentés
   • Tests de continuité semestriels
   • Communication de crise préparée

SURVEILLANCE :
✅ Monitoring 24h/24 :
   • Supervision technique temps réel
   • Alertes automatiques multi-niveaux
   • Tableaux de bord consolidés
   • Reporting mensuel direction
```

**🛠️ ACTIVITÉ PRATIQUE (10 MINUTES) :**
```
Exercice : Cartographie des dépendances critiques
• Travail individuel (7 min)
• Identifier 3 dépendances critiques du CHU
• Évaluer le risque (probabilité × impact)
• Proposer 1 mesure de mitigation par dépendance
• Discussion collective (3 min)

Focus sur :
- Fournisseurs technologiques critiques
- Partenaires métier essentiels
- Infrastructures externes vitales
```

## 🔗 **POINT 2 - MÉTHODOLOGIE D'IDENTIFICATION DES BIENS ESSENTIELS**

### **🎯 SYSTÈME MÉTHODOLOGIQUE SPÉCIALISÉ CHU :**

**📋 APPROCHE STRUCTURÉE EN 4 PHASES :**

**🔍 PHASE 1 - INVENTAIRE EXHAUSTIF (Approche Top-Down)**
```
Niveau 1 - Missions hospitalières :
• Mission 1 : Soins aux patients (urgences, hospitalisation, ambulatoire)
• Mission 2 : Enseignement médical et formation
• Mission 3 : Recherche clinique et innovation
• Mission 4 : Prévention et santé publique
• Mission 5 : Support et administration

Niveau 2 - Processus métier par mission :
Mission Soins aux patients :
├── Accueil et admissions
├── Urgences et réanimation
├── Consultations et hospitalisations
├── Interventions chirurgicales
├── Examens et laboratoires
├── Pharmacie et thérapeutiques
└── Sorties et suivi

Niveau 3 - Activités critiques par processus :
Processus Urgences :
├── Triage et orientation
├── Examens diagnostiques urgents
├── Soins intensifs et réanimation
├── Interventions d'urgence
└── Transferts et évacuations

Niveau 4 - Ressources nécessaires par activité :
Activité Triage urgences :
├── Personnel : Médecins urgentistes, IDE, AS
├── Information : Dossiers patients, protocoles
├── Systèmes : SIH urgences, PACS, laboratoires
├── Infrastructure : Locaux, équipements, réseaux
└── Partenaires : SAMU, laboratoires, imagerie
```

**📊 PHASE 2 - ANALYSE D'IMPACT MÉTIER (Méthode BIA adaptée santé)**
```
Grille d'impact spécialisée CHU :

Impact sur les soins (Priorité 1) :
• CATASTROPHIQUE (5) : Décès patients, vies en jeu immédiat
• CRITIQUE (4) : Complications graves, séquelles permanentes
• MAJEUR (3) : Retards soins, dégradation état patients
• MODÉRÉ (2) : Gêne opérationnelle, qualité dégradée
• MINEUR (1) : Impact limité, solutions contournement

Impact financier (Priorité 2) :
• CATASTROPHIQUE (5) : >5M€ de perte
• CRITIQUE (4) : 1M€-5M€ de perte
• MAJEUR (3) : 200k€-1M€ de perte
• MODÉRÉ (2) : 50k€-200k€ de perte
• MINEUR (1) : <50k€ de perte

Impact réglementaire (Priorité 3) :
• CATASTROPHIQUE (5) : Fermeture administrative, sanctions pénales
• CRITIQUE (4) : Perte certifications HDS/HAS, amendes CNIL
• MAJEUR (3) : Mise en demeure, contrôles renforcés
• MODÉRÉ (2) : Observations, plans d'amélioration
• MINEUR (1) : Recommandations, sensibilisation

Impact réputation (Priorité 4) :
• CATASTROPHIQUE (5) : Crise médiatique nationale, perte confiance
• CRITIQUE (4) : Médiatisation régionale, impact recrutement
• MAJEUR (3) : Questionnements locaux, baisse attractivité
• MODÉRÉ (2) : Inquiétudes ponctuelles, communication nécessaire
• MINEUR (1) : Impact négligeable, gestion interne

Calcul de criticité globale :
Score = MAX(Impact soins, Impact financier, Impact réglementaire, Impact réputation)
```

**⏱️ PHASE 3 - ANALYSE TEMPORELLE (RTO/RPO hospitaliers)**
```
Seuils de tolérance spécifiques santé :

RTO (Recovery Time Objective) :
• Urgences vitales : 0 minute (tolérance zéro)
• Bloc opératoire : 15 minutes maximum
• Réanimation : 30 minutes maximum
• SIH global : 4 heures maximum
• PACS imagerie : 2 heures maximum
• Laboratoires : 1 heure maximum
• Pharmacie : 8 heures maximum
• Administration : 24 heures maximum

RPO (Recovery Point Objective) :
• Prescriptions médicales : 0 perte (synchrone)
• Dossiers patients : 15 minutes maximum
• Images médicales : 30 minutes maximum
• Résultats laboratoires : 1 heure maximum
• Données administratives : 4 heures maximum
• Données de recherche : 24 heures maximum

MTPD (Maximum Tolerable Period of Disruption) :
• Services vitaux : 4 heures absolues
• Services essentiels : 24 heures maximum
• Services importants : 72 heures maximum
• Services de support : 1 semaine maximum
```

**🏥 PHASE 4 - VALIDATION MÉTIER (Comité multidisciplinaire)**
```
Comité de validation CHU :
✅ Président : Directeur Général ou Directeur Médical
✅ Membres permanents :
   • Chef de pôle Urgences-Réanimation
   • Chef de pôle Médecine-Chirurgie
   • Directeur des Soins Infirmiers
   • Pharmacien Chef de Service
   • Chef de service Laboratoires
   • RSSI et DSI
   • Directeur Qualité-Gestion des Risques

Processus de validation :
1. Présentation inventaire et classification (30 min)
2. Discussion par domaine métier (60 min)
3. Arbitrages et ajustements (30 min)
4. Validation finale et signature (15 min)
5. Communication aux équipes (diffusion)

Critères de validation :
✅ Exhaustivité : Tous les processus critiques identifiés
✅ Pertinence : Classification cohérente avec réalité terrain
✅ Faisabilité : Objectifs RTO/RPO atteignables
✅ Cohérence : Alignement avec stratégie CHU
✅ Conformité : Respect exigences réglementaires
```

### **📋 LIVRABLES STANDARDISÉS ATELIER 1 :**

**📊 LIVRABLE 1.1 - INVENTAIRE DES BIENS ESSENTIELS**
```
Structure documentaire :
├── Contexte et périmètre CHU
├── Méthodologie d'identification
├── Inventaire par catégorie :
│   ├── Processus métier (15 processus identifiés)
│   ├── Informations critiques (12 types de données)
│   ├── Systèmes d'information (8 systèmes majeurs)
│   └── Infrastructures techniques (6 domaines)
├── Matrice de criticité
├── Analyse temporelle (RTO/RPO)
└── Validation comité métier

Format : Document Word + Tableur Excel
Pages : 25-30 pages
Validation : Comité multidisciplinaire CHU
```

**📈 LIVRABLE 1.2 - CARTOGRAPHIE DES DÉPENDANCES**
```
Contenu cartographie :
├── Écosystème numérique CHU
├── Dépendances critiques externes :
│   ├── Fournisseurs technologiques (5 critiques)
│   ├── Partenaires métier (8 essentiels)
│   └── Infrastructures externes (4 vitales)
├── Analyse des risques de dépendance
├── Impacts en cascade identifiés
├── Stratégies de mitigation
└── Plan de surveillance continue

Format : Schémas Visio + Document explicatif
Mise à jour : Trimestrielle
Diffusion : COMEX + RSSI + DSI
```

**🎯 LIVRABLE 1.3 - OBJECTIFS DE SÉCURITÉ CHU**
```
Définition par domaine :
├── Disponibilité :
│   ├── SIH : 99.9% (8h arrêt max/an)
│   ├── Urgences : 99.99% (52min arrêt max/an)
│   ├── PACS : 99.8% (17h arrêt max/an)
│   └── Laboratoires : 99.5% (44h arrêt max/an)
├── Intégrité :
│   ├── Données patients : 100% intègres
│   ├── Prescriptions : 100% fiables
│   ├── Résultats examens : 100% exacts
│   └── Images médicales : 100% authentiques
├── Confidentialité :
│   ├── Secret médical : Protection absolue
│   ├── Données recherche : Anonymisation garantie
│   ├── Informations RH : Vie privée protégée
│   └── Données financières : Confidentialité assurée
└── Traçabilité :
    ├── Accès données : Logs 7 ans
    ├── Modifications : Audit trail complet
    ├── Authentification : Traçabilité nominative
    └── Incidents : Documentation exhaustive

Validation : Direction Générale + RSSI
Révision : Annuelle avec mise à jour réglementaire
```

### **🔗 LIENS EXPLICITES VERS ATELIER 2 :**

**📤 TRANSMISSION STRUCTURÉE A1 → A2 :**

**🎯 DONNÉES TRANSMISES :**
```
1. Contexte CHU validé :
   • Périmètre organisationnel, fonctionnel, temporel
   • Enjeux métier spécifiques santé
   • Contraintes réglementaires (HDS, RGPD, HAS)
   • Objectifs de sécurité par domaine

2. Biens essentiels classifiés :
   • 15 processus métier avec criticité
   • 12 types d'informations critiques
   • 8 systèmes d'information majeurs
   • 6 domaines d'infrastructures techniques
   • Matrice de criticité complète

3. Écosystème et dépendances :
   • 5 fournisseurs technologiques critiques
   • 8 partenaires métier essentiels
   • 4 infrastructures externes vitales
   • Analyse des risques de dépendance
   • Stratégies de mitigation définies

4. Objectifs de sécurité :
   • Seuils de disponibilité par système
   • Exigences d'intégrité par type de données
   • Niveaux de confidentialité requis
   • Besoins de traçabilité définis
```

**🔄 UTILISATION EN ATELIER 2 :**
```
Les biens essentiels identifiés en A1 servent de base pour :
✅ Identifier les sources de risque pertinentes
✅ Adapter les motivations aux enjeux CHU
✅ Calibrer les capacités selon la criticité
✅ Prioriser les sources selon l'impact potentiel

Exemple de transmission :
Bien essentiel A1 : "Urgences vitales (CRITIQUE)"
↓
Sources de risque A2 :
• Cybercriminels spécialisés santé (motivation financière)
• Hacktivistes anti-système santé (motivation idéologique)
• États étrangers (espionnage données santé)
• Menaces internes (personnel mécontent)
```

**📋 INTERFACE DE TRANSMISSION :**
```
Document de liaison A1→A2 :
├── Synthèse exécutive (2 pages)
├── Biens essentiels prioritaires (top 10)
├── Enjeux métier spécifiques CHU
├── Contraintes et objectifs de sécurité
├── Écosystème et dépendances critiques
└── Recommandations pour analyse A2

Format : PDF sécurisé + Présentation PowerPoint
Validation : RSSI + Direction Médicale
Diffusion : Équipe EBIOS RM + Comité pilotage
```

## 🎯 **POINT 3 - LIENS EXPLICITES VERS ATELIER 2**

### **🔗 SYSTÈME DE TRANSMISSION STRUCTURÉ A1 → A2 :**

**📊 ARCHITECTURE DE TRANSMISSION :**

**🎯 DONNÉES DE SORTIE ATELIER 1 (Inputs pour A2) :**
```
BLOC 1 - CONTEXTE CHU VALIDÉ :
├── Périmètre d'analyse :
│   ├── Organisationnel : 3 sites, 3500 employés, 1200 lits
│   ├── Fonctionnel : 5 missions, 15 processus métier
│   ├── Temporel : 2024-2027 avec révisions annuelles
│   └── Géographique : CHU + 25 partenaires régionaux
├── Enjeux métier spécifiques :
│   ├── Vitaux : Continuité soins 24h/24, sécurité patients
│   ├── Économiques : 450M€ budget, équilibre T2A
│   ├── Réglementaires : HDS, RGPD, HAS, ANSSI
│   └── Stratégiques : Réputation, innovation, partenariats
├── Contraintes opérationnelles :
│   ├── Disponibilité : 99.9% SIH, 99.99% urgences
│   ├── Intégrité : 100% données patients, prescriptions
│   ├── Confidentialité : Secret médical absolu
│   └── Traçabilité : Logs 7 ans, audit trail complet
└── Objectifs de sécurité :
    ├── RTO : 0min urgences, 4h SIH, 2h PACS
    ├── RPO : 0 prescriptions, 15min dossiers patients
    ├── MTPD : 4h services vitaux, 24h essentiels
    └── Disponibilité : Seuils par système critique

BLOC 2 - BIENS ESSENTIELS CLASSIFIÉS :
├── Processus métier (15 identifiés) :
│   ├── CRITIQUES (5) : Urgences, Réanimation, Bloc, SIH, PACS
│   ├── MAJEURS (6) : Laboratoires, Pharmacie, Consultations
│   ├── MODÉRÉS (3) : Administration, Recherche, Formation
│   └── MINEURS (1) : Support général
├── Informations critiques (12 types) :
│   ├── CRITIQUES (4) : Dossiers patients, Images, Prescriptions, Identités
│   ├── MAJEURES (5) : Résultats, Protocoles, Données RH
│   ├── MODÉRÉES (2) : Données financières, Recherche
│   └── MINEURES (1) : Documentation générale
├── Systèmes d'information (8 majeurs) :
│   ├── CRITIQUES (3) : SIH, PACS, Réseaux
│   ├── MAJEURS (3) : Laboratoires, Pharmacie, Téléphonie
│   ├── MODÉRÉS (2) : Administration, Recherche
│   └── Matrice de dépendances inter-systèmes
└── Infrastructures techniques (6 domaines) :
    ├── CRITIQUES (2) : Centres données, Alimentations
    ├── MAJEURES (2) : Climatisation, Sécurité physique
    ├── MODÉRÉES (2) : Réseaux secondaires, Archivage
    └── Plans de continuité par infrastructure

BLOC 3 - ÉCOSYSTÈME ET DÉPENDANCES :
├── Fournisseurs technologiques critiques (5) :
│   ├── Éditeur SIH : Contrat maintenance critique
│   ├── Fournisseur PACS : Support 24h/24 requis
│   ├── Opérateurs télécoms : Double opérateur obligatoire
│   ├── Prestataires cloud : Multi-cloud pour résilience
│   └── Intégrateurs SI : Expertise métier santé
├── Partenaires métier essentiels (8) :
│   ├── Laboratoires externes : Analyses spécialisées
│   ├── Centres imagerie : Examens complémentaires
│   ├── Pharmacies centrales : Approvisionnement critique
│   ├── Établissements partenaires : Transferts patients
│   ├── ARS/CPAM : Tutelle et financement
│   ├── SAMU : Urgences et évacuations
│   ├── Universités : Formation et recherche
│   └── Prestataires maintenance : Équipements biomédicaux
├── Infrastructures externes vitales (4) :
│   ├── Réseaux opérateurs : Connectivité critique
│   ├── Fourniture électrique : Alimentation principale
│   ├── Services cloud : Hébergement et sauvegarde
│   └── Réseaux santé régionaux : Échanges sécurisés
└── Analyse risques dépendance :
    ├── Risques fournisseurs : 12 identifiés
    ├── Risques en cascade : 8 scénarios critiques
    ├── Stratégies mitigation : Multi-sourcing, redondance
    └── Plans de surveillance : Monitoring 24h/24
```

**🔄 UTILISATION EN ATELIER 2 (Outputs vers A2) :**

**🎯 EXPLOITATION POUR IDENTIFICATION SOURCES :**
```
BIEN ESSENTIEL A1 → SOURCES DE RISQUE A2 :

Exemple 1 - Urgences vitales (CRITIQUE) :
├── Sources externes pertinentes :
│   ├── Cybercriminels spécialisés santé (motivation : rançons élevées)
│   ├── États étrangers (espionnage données santé sensibles)
│   ├── Hacktivistes (protestation système santé)
│   └── Terroristes (impact psychologique maximal)
├── Sources internes pertinentes :
│   ├── Personnel médical mécontent (accès privilégié)
│   ├── Prestataires maintenance (accès physique)
│   ├── Stagiaires/internes (formation insuffisante)
│   └── Anciens employés (comptes non désactivés)
├── Motivations spécifiques :
│   ├── Financière : Rançons, revente données, chantage
│   ├── Idéologique : Protestation, revendication politique
│   ├── Géopolitique : Déstabilisation, espionnage
│   └── Personnelle : Vengeance, reconnaissance, négligence
└── Capacités requises :
    ├── Techniques : Malware, phishing, intrusion physique
    ├── Organisationnelles : Coordination, persistance
    ├── Financières : Outils, infrastructure, personnel
    └── Sectorielles : Connaissance environnement médical

Exemple 2 - SIH Dossiers patients (CRITIQUE) :
├── Sources externes ciblées :
│   ├── Cybercriminels données (marché noir santé)
│   ├── Compagnies assurance (profilage risques)
│   ├── Laboratoires pharmaceutiques (recherche illégale)
│   └── Détectives privés (enquêtes personnelles)
├── Sources internes exposées :
│   ├── Administrateurs SI (accès technique complet)
│   ├── Personnel soignant (accès fonctionnel large)
│   ├── Prestataires nettoyage (accès physique non surveillé)
│   └── Étudiants/chercheurs (accès données recherche)
├── Motivations adaptées :
│   ├── Commerciale : Revente bases données patients
│   ├── Concurrentielle : Intelligence économique
│   ├── Criminelle : Usurpation identité, fraudes
│   └── Curieuse : Voyeurisme, indiscrétion
└── Capacités nécessaires :
    ├── Techniques : Accès bases données, extraction massive
    ├── Sociales : Ingénierie sociale, corruption
    ├── Physiques : Accès locaux, vol équipements
    └── Légales : Contournement réglementations
```

**📋 MATRICE DE CORRESPONDANCE A1 → A2 :**
```
CRITICITÉ BIEN A1 → PRIORITÉ SOURCE A2 :

CRITIQUE (Score 4-5) → Sources PRIORITÉ 1 :
• Cybercriminels spécialisés santé
• États étrangers (espionnage)
• Menaces internes privilégiées
• Terroristes (impact maximal)

MAJEUR (Score 3) → Sources PRIORITÉ 2 :
• Hacktivistes sectoriels
• Concurrents économiques
• Prestataires externes
• Personnel non privilégié

MODÉRÉ (Score 2) → Sources PRIORITÉ 3 :
• Script kiddies opportunistes
• Curieux et voyeurs
• Erreurs involontaires
• Défaillances techniques

MINEUR (Score 1) → Sources PRIORITÉ 4 :
• Menaces génériques
• Accidents naturels
• Pannes équipements
• Erreurs mineures
```

**🎯 CALIBRAGE DES CAPACITÉS :**
```
OBJECTIF SÉCURITÉ A1 → CAPACITÉ REQUISE A2 :

Disponibilité 99.99% urgences → Capacités sources :
• Techniques : DDoS massifs, ransomware sophistiqué
• Organisationnelles : Coordination multi-vecteurs
• Financières : >100k€ budget attaque
• Temporelles : Persistance >72h

Intégrité 100% prescriptions → Capacités sources :
• Techniques : Modification bases données, MITM
• Médicales : Connaissance protocoles thérapeutiques
• Sociales : Corruption personnel autorisé
• Physiques : Accès systèmes critiques

Confidentialité absolue secret médical → Capacités sources :
• Techniques : Exfiltration discrète, chiffrement
• Légales : Contournement obligations professionnelles
• Commerciales : Réseaux revente données
• Géographiques : Juridictions permissives
```

### **📤 LIVRABLES DE TRANSMISSION A1 → A2 :**

**📊 DOCUMENT DE LIAISON STRUCTURÉ :**
```
LIVRABLE T1→2 : "Contexte et Biens Essentiels pour Analyse Sources"

Structure documentaire :
├── 1. SYNTHÈSE EXÉCUTIVE (2 pages)
│   ├── Contexte CHU et enjeux critiques
│   ├── Top 10 biens essentiels prioritaires
│   ├── Objectifs sécurité non négociables
│   └── Recommandations pour analyse A2
├── 2. CONTEXTE CHU DÉTAILLÉ (5 pages)
│   ├── Périmètre et missions hospitalières
│   ├── Enjeux métier spécifiques santé
│   ├── Contraintes réglementaires (HDS, RGPD)
│   └── Objectifs de sécurité par domaine
├── 3. INVENTAIRE BIENS ESSENTIELS (8 pages)
│   ├── 15 processus métier avec criticité
│   ├── 12 types informations critiques
│   ├── 8 systèmes information majeurs
│   ├── 6 domaines infrastructures techniques
│   └── Matrice de criticité complète
├── 4. ÉCOSYSTÈME ET DÉPENDANCES (6 pages)
│   ├── 5 fournisseurs technologiques critiques
│   ├── 8 partenaires métier essentiels
│   ├── 4 infrastructures externes vitales
│   ├── Analyse risques dépendance
│   └── Stratégies mitigation définies
├── 5. ORIENTATIONS POUR ATELIER 2 (4 pages)
│   ├── Sources de risque à prioriser
│   ├── Motivations spécifiques à investiguer
│   ├── Capacités minimales requises
│   ├── Scénarios d'attaque probables
│   └── Recommandations méthodologiques
└── ANNEXES (10 pages)
    ├── Glossaire spécialisé CHU
    ├── Références réglementaires
    ├── Contacts et responsabilités
    └── Planning et jalons A2

Format : PDF sécurisé + Tableur Excel + Présentation
Pages : 35 pages + annexes
Validation : RSSI + Direction Médicale + COMEX
Diffusion : Équipe EBIOS RM + Comité pilotage + Consultants
Mise à jour : Trimestrielle ou sur événement majeur
```

**🔄 PROCESSUS DE TRANSMISSION :**
```
ÉTAPES DE HANDOVER A1 → A2 :

J-7 : Finalisation livrables A1
├── Validation technique RSSI
├── Validation métier Direction Médicale
├── Validation stratégique COMEX
└── Préparation supports transmission

J-3 : Réunion préparatoire A2
├── Présentation synthèse A1 (30 min)
├── Questions/réponses équipe A2 (30 min)
├── Ajustements méthodologie A2 (15 min)
└── Validation planning A2 (15 min)

J0 : Lancement officiel A2
├── Remise officielle livrables A1
├── Briefing équipe élargie A2
├── Validation périmètre et objectifs A2
└── Démarrage travaux A2

J+7 : Suivi démarrage A2
├── Point d'avancement A2
├── Difficultés et blocages
├── Ajustements méthodologiques
└── Validation orientations prises

J+30 : Bilan intégration A1→A2
├── Évaluation qualité transmission
├── Pertinence orientations données
├── Ajustements pour futurs ateliers
└── Capitalisation bonnes pratiques
```

## 🎯 **POINT 4 - EXERCICES PRATIQUES CADRAGE CHU (120 MINUTES)**

### **🎯 SYSTÈME D'EXERCICES INTERACTIFS SPÉCIALISÉS :**

**📚 5 EXERCICES PRATIQUES DÉVELOPPÉS :**

**🥇 EXERCICE 1 - CADRAGE ET PÉRIMÈTRE CHU (25 MIN, 80 PTS)**
```
Niveau : INTERMÉDIAIRE
Objectif : Maîtriser la définition du périmètre d'analyse EBIOS RM CHU
Scénario : CHU Métropolitain - Définition périmètre pour analyse sécurité

Questions développées :
✅ Q1 - Définition périmètre organisationnel (20 pts)
   • Identifier les 3 sites et leurs spécificités
   • Définir les services critiques par site
   • Justifier les exclusions du périmètre

✅ Q2 - Identification des enjeux métier (25 pts)
   • Classer 8 enjeux par ordre de priorité CHU
   • Justifier avec contraintes réglementaires
   • Évaluer l'impact financier de chaque enjeu

✅ Q3 - Objectifs de sécurité (20 pts)
   • Définir RTO/RPO pour 5 systèmes critiques
   • Justifier les seuils avec contraintes métier
   • Identifier les conflits potentiels

✅ Q4 - Contraintes réglementaires (15 pts)
   • Mapper les exigences HDS/RGPD/HAS
   • Identifier les obligations ANSSI
   • Définir les sanctions en cas de non-conformité

Contexte réaliste :
• CHU 3 sites, 1200 lits, 50k patients/an
• Budget 450M€, contraintes T2A
• Spécialités critiques : Urgences, Réanimation, Cardiologie
• Partenaires : 25 établissements régionaux
```

**🥈 EXERCICE 2 - IDENTIFICATION BIENS ESSENTIELS (30 MIN, 120 PTS)**
```
Niveau : AVANCÉ
Objectif : Maîtriser la méthodologie d'identification et classification
Scénario : Inventaire exhaustif des biens essentiels CHU avec matrice BIA

Questions développées :
✅ Q1 - Inventaire par catégorie (40 pts)
   • Identifier 15 processus métier avec criticité
   • Classer 12 types d'informations critiques
   • Répertorier 8 systèmes d'information majeurs
   • Cartographier 6 domaines d'infrastructures

✅ Q2 - Matrice de criticité spécialisée (35 pts)
   • Appliquer grille BIA adaptée santé
   • Calculer scores impact (soins, financier, réglementaire)
   • Justifier classification CRITIQUE/MAJEUR/MODÉRÉ
   • Identifier les biens sous-évalués

✅ Q3 - Analyse temporelle RTO/RPO (25 pts)
   • Définir RTO pour 10 biens essentiels
   • Calculer RPO selon type de données
   • Identifier les conflits temporels
   • Proposer solutions de priorisation

✅ Q4 - Validation métier (20 pts)
   • Structurer comité de validation CHU
   • Définir processus de validation
   • Anticiper les objections métier
   • Préparer arguments de justification

Méthodologie :
• Approche Top-Down par missions hospitalières
• Grille BIA spécialisée secteur santé
• Validation multidisciplinaire obligatoire
• Révision trimestrielle des classifications
```

**🥉 EXERCICE 3 - ÉCOSYSTÈME ET DÉPENDANCES (25 MIN, 100 PTS)**
```
Niveau : AVANCÉ
Objectif : Cartographier l'écosystème et analyser les dépendances critiques
Scénario : CHU interconnecté avec 25 partenaires et 15 fournisseurs critiques

Questions développées :
✅ Q1 - Cartographie écosystème (30 pts)
   • Identifier 5 fournisseurs technologiques critiques
   • Répertorier 8 partenaires métier essentiels
   • Cartographier 4 infrastructures externes vitales
   • Évaluer le niveau de dépendance (1-5)

✅ Q2 - Analyse des risques de dépendance (35 pts)
   • Évaluer probabilité de défaillance par fournisseur
   • Calculer impact en cascade sur les soins
   • Identifier les points de défaillance unique (SPOF)
   • Prioriser les risques selon matrice P×I

✅ Q3 - Stratégies de mitigation (25 pts)
   • Proposer solutions de diversification
   • Définir niveaux de redondance requis
   • Structurer clauses contractuelles SLA
   • Planifier tests de continuité

✅ Q4 - Plan de surveillance (10 pts)
   • Définir KPIs de surveillance fournisseurs
   • Structurer reporting mensuel direction
   • Organiser comité de suivi trimestriel
   • Prévoir procédures d'escalade

Enjeux spécifiques :
• Continuité soins 24h/24 non négociable
• Fournisseurs uniques pour certains systèmes critiques
• Contraintes géographiques (sites distants)
• Réglementations spécifiques hébergement données santé
```

**🎯 EXERCICE 4 - OBJECTIFS DE SÉCURITÉ CHU (20 MIN, 80 PTS)**
```
Niveau : INTERMÉDIAIRE
Objectif : Définir des objectifs de sécurité adaptés aux contraintes hospitalières
Scénario : Définition des objectifs DICP pour 8 systèmes critiques CHU

Questions développées :
✅ Q1 - Disponibilité par système (25 pts)
   • Définir seuils de disponibilité (99.9%, 99.99%)
   • Justifier avec contraintes métier (vies en jeu)
   • Calculer temps d'arrêt acceptable par an
   • Identifier systèmes tolérance zéro

✅ Q2 - Intégrité des données (20 pts)
   • Classer données par niveau d'intégrité requis
   • Définir mécanismes de contrôle d'intégrité
   • Identifier données 100% intègres obligatoires
   • Proposer solutions de détection altération

✅ Q3 - Confidentialité et secret médical (20 pts)
   • Appliquer principe secret médical absolu
   • Définir niveaux de confidentialité par type
   • Structurer contrôles d'accès par rôle
   • Gérer exceptions légales (réquisitions)

✅ Q4 - Traçabilité et audit (15 pts)
   • Définir durées de conservation logs (7 ans)
   • Structurer audit trail complet
   • Organiser traçabilité nominative
   • Préparer réponse contrôles CNIL/ANSSI

Contraintes spécifiques :
• Secret médical : Protection absolue données patients
• Continuité vitale : Tolérance zéro pour urgences
• Traçabilité légale : Conservation 7 ans minimum
• Conformité HDS : Exigences techniques strictes
```

**🏛️ EXERCICE 5 - SIMULATION COMITÉ VALIDATION (20 MIN, 100 PTS)**
```
Niveau : EXPERT
Objectif : Maîtriser la présentation et validation des biens essentiels
Scénario : Comité de validation multidisciplinaire CHU avec 7 participants

Questions développées :
✅ Q1 - Préparation de la présentation (30 pts)
   • Structurer présentation 30 minutes
   • Adapter discours par type d'interlocuteur
   • Préparer supports visuels (schémas, matrices)
   • Anticiper questions et objections

✅ Q2 - Gestion des objections métier (35 pts)
   Situation : Chef service Urgences conteste classification
   • Écouter et reformuler l'objection
   • Argumenter avec données factuelles
   • Proposer compromis acceptable
   • Obtenir validation finale

✅ Q3 - Arbitrage de conflits (25 pts)
   Situation : Conflit DSI vs Direction Médicale sur priorités
   • Identifier les enjeux de chaque partie
   • Proposer solution équilibrée
   • Justifier avec contraintes réglementaires
   • Formaliser accord écrit

✅ Q4 - Validation et communication (10 pts)
   • Formaliser décisions du comité
   • Planifier communication aux équipes
   • Organiser suivi et révisions
   • Préparer prochaines étapes A2

Participants comité :
• Directeur Général (enjeux stratégiques)
• Directeur Médical (enjeux soins)
• Chef pôle Urgences (contraintes opérationnelles)
• Directeur Soins (organisation infirmière)
• RSSI (sécurité technique)
• DSI (faisabilité technique)
• Directeur Qualité (conformité réglementaire)
```

### **🔧 IMPLÉMENTATION TECHNIQUE EXERCICES :**

**📊 SYSTÈME DE SCORING ADAPTÉ :**
```
Barème par niveau :
✅ INTERMÉDIAIRE (Exercices 1, 4) :
   • Questions simples : 15-25 points
   • Justifications requises : +5 points bonus
   • Erreurs courantes : -10 points malus
   • Coefficient difficulté : 1.0x

✅ AVANCÉ (Exercices 2, 3) :
   • Questions complexes : 25-40 points
   • Analyse multicritères : +10 points bonus
   • Méthodologie rigoureuse : +5 points bonus
   • Coefficient difficulté : 1.2x

✅ EXPERT (Exercice 5) :
   • Simulation réaliste : 25-35 points
   • Gestion de crise : +15 points bonus
   • Communication efficace : +10 points bonus
   • Coefficient difficulté : 1.5x

Score final = (Points obtenus × Coefficient) / Points max × 100
```

**⏱️ GESTION DU TEMPS :**
```
Répartition temporelle optimisée :
├── Exercice 1 (25 min) : 4 questions × 6 min + 1 min transition
├── Exercice 2 (30 min) : 4 questions × 7 min + 2 min transition
├── Exercice 3 (25 min) : 4 questions × 6 min + 1 min transition
├── Exercice 4 (20 min) : 4 questions × 5 min + 0 min transition
├── Exercice 5 (20 min) : 4 questions × 5 min + 0 min transition
└── Total : 120 minutes avec transitions incluses

Timer intelligent :
✅ Alerte à 75% du temps écoulé
✅ Alerte à 90% du temps écoulé
✅ Sauvegarde automatique toutes les 2 minutes
✅ Possibilité de pause entre exercices
✅ Récapitulatif temps par exercice
```

**🎯 CONTEXTES RÉALISTES :**
```
Données CHU Métropolitain utilisées :
├── Organisationnel :
│   ├── 3 sites : Principal (800 lits), Spécialisé (250 lits), Ambulatoire (150 lits)
│   ├── 3500 employés : 2800 soignants, 700 administratifs
│   ├── Budget : 450M€/an (T2A + dotations)
│   └── Activité : 50k hospitalisations, 180k urgences/an
├── Technique :
│   ├── SIH : 15 modules, 3000 utilisateurs
│   ├── PACS : 500k images/an, 50 modalités
│   ├── Réseaux : 5000 équipements, 15 VLAN
│   └── Serveurs : 200 physiques, 800 virtuels
├── Réglementaire :
│   ├── Certifications : HDS, HAS, ISO 27001
│   ├── Conformité : RGPD, Code santé publique
│   ├── Tutelle : ARS, ANSSI, CNIL
│   └── Audits : Annuels obligatoires
└── Partenaires :
    ├── 25 établissements santé régionaux
    ├── 15 fournisseurs technologiques
    ├── 8 laboratoires externes
    └── 5 centres imagerie partenaires
```

### **📊 STATISTIQUES GLOBALES EXERCICES :**

**🎯 Métriques complètes :**
```
✅ Total exercices : 5
✅ Durée totale : 120 minutes (2h00)
✅ Points totaux : 480 points
✅ Niveaux : 2 Intermédiaires + 2 Avancés + 1 Expert
✅ Catégories : 5 domaines spécialisés CHU
✅ Questions : 20 questions au total
✅ Scénarios : 5 contextes réalistes hospitaliers
```

**📚 Répartition par domaine :**
```
✅ Cadrage et périmètre (1) : 25 min, 80 points
✅ Identification biens (1) : 30 min, 120 points
✅ Écosystème dépendances (1) : 25 min, 100 points
✅ Objectifs sécurité (1) : 20 min, 80 points
✅ Validation gouvernance (1) : 20 min, 100 points
```

**🎓 Progression pédagogique :**
```
Niveau 1 - Bases (Exercices 1, 4) :
• Concepts fondamentaux EBIOS RM
• Spécificités secteur santé
• Contraintes réglementaires de base

Niveau 2 - Approfondissement (Exercices 2, 3) :
• Méthodologies avancées
• Analyses multicritères
• Gestion des dépendances complexes

Niveau 3 - Expertise (Exercice 5) :
• Simulation réaliste
• Gestion des parties prenantes
• Communication et validation
```

### **🎯 RÉSULTAT RÉVOLUTIONNAIRE :**

**L'Atelier 1 dispose maintenant de :**
- ✅ **90 minutes** de contenu théorique spécialisé CHU
- ✅ **120 minutes** d'exercices pratiques interactifs
- ✅ **480 points** d'évaluation avec scoring sophistiqué
- ✅ **5 exercices** couvrant tous les aspects du socle de sécurité
- ✅ **Contextes réalistes** avec données CHU authentiques
- ✅ **Liens explicites** vers Atelier 2 structurés
- ✅ **Conformité ANSSI** complète avec méthodologie EBIOS RM
- ✅ **Spécialisation santé** avec contraintes HDS/RGPD/HAS

## 🎉 **ATELIER 1 COMPLET - SOCLE DE SÉCURITÉ CHU !**

### **📋 RÉCAPITULATIF COMPLET ATELIER 1 :**

**✅ Point 1 - Contenu détaillé cadrage et socle (90 min)**
**✅ Point 2 - Méthodologie identification biens essentiels**
**✅ Point 3 - Liens explicites vers Atelier 2**
**✅ Point 4 - Exercices pratiques cadrage CHU (120 min)**

**🎯 TOTAL ATELIER 1 : 210 minutes de formation spécialisée CHU !**

**L'Atelier 1 "Socle de sécurité" est maintenant harmonisé avec les Ateliers 3-5 et propose une formation complète et professionnelle pour établir les fondations solides de l'analyse EBIOS RM dans le contexte hospitalier ! 🚀**
