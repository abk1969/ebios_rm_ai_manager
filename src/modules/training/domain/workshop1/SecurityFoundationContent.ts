/**
 * 🎯 CONTENU DÉTAILLÉ ATELIER 1 - SOCLE DE SÉCURITÉ
 * Contenu spécialisé pour le cadrage et l'identification des biens essentiels CHU
 */

// 🎯 TYPES POUR LE CONTENU ATELIER 1
export interface SecurityFoundationStep {
  id: string;
  title: string;
  description: string;
  type: 'theory' | 'exercise' | 'validation';
  duration: number;
  content: string;
  learningObjectives: string[];
  keyPoints: string[];
  examples: CHUExample[];
  exercises?: SecurityFoundationExercise[];
  completed: boolean;
}

export interface CHUExample {
  title: string;
  description: string;
  context: string;
  outcome: string;
  lessons: string[];
}

export interface SecurityFoundationExercise {
  id: string;
  question: string;
  type: 'scoping' | 'asset_identification' | 'ecosystem_analysis' | 'objectives_definition';
  options?: string[];
  correctAnswer?: any;
  explanation: string;
  points: number;
}

/**
 * 🎯 CLASSE PRINCIPALE DU CONTENU ATELIER 1
 */
export class SecurityFoundationContent {
  
  // 📋 MODULE 1.1 - CADRAGE DE LA MISSION (25 MINUTES)
  static getModule1_1_ScopingMission(): SecurityFoundationStep {
    return {
      id: 'module_1_1_scoping',
      title: 'Cadrage de la Mission EBIOS RM',
      description: 'Maîtriser la définition du périmètre d\'analyse EBIOS RM pour un CHU',
      type: 'theory',
      duration: 25,
      content: `
# 🎯 CADRAGE DE LA MISSION EBIOS RM CHU

## 📋 OBJECTIFS D'APPRENTISSAGE
- Maîtriser la définition du périmètre d'analyse EBIOS RM
- Identifier les enjeux métier spécifiques au secteur santé
- Comprendre les contraintes réglementaires hospitalières
- Définir les objectifs de sécurité adaptés au CHU

## 🔍 1. DÉFINITION DU PÉRIMÈTRE CHU

### Périmètre organisationnel
Le CHU Métropolitain s'étend sur **3 sites interconnectés** :
- **Site Principal (800 lits)** : Urgences, Réanimation, Blocs opératoires
- **Site Spécialisé (250 lits)** : Cardiologie, Neurochirurgie, Oncologie  
- **Centre Ambulatoire (150 lits)** : Consultations, Hôpital de jour

**🎯 Périmètre recommandé :**
✅ **Inclure** : 3 sites + laboratoires externes critiques + prestataires maintenance vitaux
❌ **Exclure** : 25 partenaires régionaux (analyse séparée) + organismes tutelle

### Périmètre fonctionnel
**5 missions hospitalières principales :**
1. **Soins aux patients** (urgences, hospitalisation, ambulatoire)
2. **Enseignement médical** et formation
3. **Recherche clinique** et innovation
4. **Prévention** et santé publique
5. **Support et administration**

### Périmètre temporel
- **Analyse** : 3 ans (2024-2027)
- **Révision** : Annuelle obligatoire
- **Mise à jour** : Trimestrielle des menaces

## ⚖️ 2. ENJEUX MÉTIER HOSPITALIERS

### Enjeux vitaux (Priorité 1)
- **Continuité des soins 24h/24** : Vies en jeu, responsabilité pénale
- **Sécurité des patients** et du personnel : Obligation déontologique
- **Qualité et traçabilité** des soins : Certification HAS

### Enjeux économiques (Priorité 2)
- **Équilibre financier** : T2A + dotations = 450M€/an
- **Optimisation des coûts** opérationnels
- **Investissements** en équipements médicaux
- **Gestion des ressources** humaines (3500 employés)

### Enjeux réglementaires (Priorité 3)
- **Conformité HDS** et certification HAS
- **Respect RGPD** et secret médical
- **Obligations de déclaration** ANSSI
- **Normes qualité** et accréditations

### Enjeux stratégiques (Priorité 4)
- **Réputation** et attractivité territoriale
- **Partenariats** et coopérations
- **Innovation** et recherche médicale
- **Transformation numérique** santé

## 🎯 3. OBJECTIFS DE SÉCURITÉ CHU

### Disponibilité (CRITIQUE)
- **SIH** : 99.9% (8h d'arrêt max/an)
- **Urgences** : 99.99% (52min d'arrêt max/an)
- **Bloc opératoire** : 99.95% (4h d'arrêt max/an)
- **PACS** : 99.8% (17h d'arrêt max/an)

### Intégrité (CRITIQUE)
- **Données patients** : 100% intègres
- **Prescriptions médicales** : 100% fiables
- **Résultats examens** : 100% exacts
- **Dossiers médicaux** : 100% cohérents

### Confidentialité (CRITIQUE)
- **Données de santé** : Secret médical absolu
- **Recherche clinique** : Anonymisation garantie
- **Données RH** : Protection vie privée
- **Informations financières** : Confidentialité comptable

### Traçabilité (MAJEURE)
- **Accès aux données** : Logs complets 7 ans
- **Modifications** : Audit trail permanent
- **Authentification** : Traçabilité nominative
- **Incidents** : Documentation exhaustive

## 💰 IMPACTS FINANCIERS SPÉCIFIQUES

### Coûts d'arrêt d'activité
- **Arrêt complet** : 1.2M€/jour de perte
- **Urgences fermées** : 500k€/jour + responsabilité pénale
- **Bloc opératoire** : 300k€/jour + reports programmés
- **Consultations** : 100k€/jour + mécontentement patients

### Sanctions réglementaires
- **Fuite données patients** : 150€/dossier (RGPD) × 500k dossiers = 75M€ max
- **Perte certification HDS** : Arrêt activité obligatoire
- **Responsabilité civile** : Jusqu'à 100M€ selon jurisprudence
- **Atteinte réputation** : -30% activité pendant 2 ans

## 🔧 CONTRAINTES OPÉRATIONNELLES

### Contraintes vitales
- **Continuité soins 24h/24** : Non négociable, vies en jeu
- **Accès urgences** : Tolérance zéro d'interruption
- **Équipements vitaux** : Redondance obligatoire
- **Personnel médical** : Disponibilité permanente

### Contraintes réglementaires
- **Secret médical** : Protection absolue données patients
- **Conformité HDS** : Hébergement données santé certifié
- **Traçabilité** : Conservation logs 7 ans minimum
- **Déclarations ANSSI** : Incidents >24h obligatoires

### Contraintes techniques
- **Interopérabilité** : Systèmes hétérogènes à connecter
- **Legacy systems** : Équipements anciens non patchables
- **Multi-sites** : Complexité réseau et synchronisation
- **Mobilité** : Personnel nomade inter-sites
      `,
      learningObjectives: [
        'Définir un périmètre d\'analyse cohérent et réaliste',
        'Prioriser les enjeux métier selon les spécificités santé',
        'Identifier les contraintes réglementaires applicables',
        'Structurer les objectifs de sécurité par domaine'
      ],
      keyPoints: [
        'Le périmètre doit être cohérent avec les enjeux métier',
        'Les vies humaines priment sur tous les autres enjeux',
        'La conformité réglementaire est non négociable en santé',
        'Les objectifs doivent être mesurables et atteignables'
      ],
      examples: [
        {
          title: 'CHU de Rouen - Post cyberattaque 2019',
          description: 'Redéfinition du périmètre après incident majeur',
          context: 'Ransomware ayant paralysé le SIH pendant 3 semaines',
          outcome: 'Périmètre élargi aux prestataires critiques',
          lessons: [
            'Inclure les dépendances critiques dès le départ',
            'Prévoir les scénarios de crise dans le périmètre',
            'Valider avec retour d\'expérience incidents'
          ]
        },
        {
          title: 'CHU de Toulouse - Certification HAS 2023',
          description: 'Alignement objectifs sécurité avec exigences HAS',
          context: 'Préparation certification avec volet sécurité renforcé',
          outcome: 'Certification obtenue avec mention sécurité',
          lessons: [
            'Intégrer les exigences HAS dans les objectifs',
            'Documenter la traçabilité pour les auditeurs',
            'Former les équipes aux procédures sécurisées'
          ]
        }
      ],
      exercises: [
        {
          id: 'exercise_scoping_chu',
          question: 'Quel périmètre organisationnel recommandez-vous pour l\'analyse EBIOS RM du CHU Métropolitain ?',
          type: 'scoping',
          options: [
            '3 sites CHU uniquement',
            '3 sites + 25 partenaires régionaux',
            '3 sites + laboratoires externes + prestataires critiques',
            'Site principal uniquement (focus urgences)'
          ],
          correctAnswer: '3 sites + laboratoires externes + prestataires critiques',
          explanation: 'Le périmètre optimal inclut les dépendances critiques directes sans être ingérable.',
          points: 20
        }
      ],
      completed: false
    };
  }

  // 🏗️ MODULE 1.2 - IDENTIFICATION DES BIENS ESSENTIELS (35 MINUTES)
  static getModule1_2_AssetIdentification(): SecurityFoundationStep {
    return {
      id: 'module_1_2_assets',
      title: 'Identification des Biens Essentiels',
      description: 'Maîtriser la méthodologie d\'identification et classification des biens essentiels CHU',
      type: 'theory',
      duration: 35,
      content: `
# 🏗️ IDENTIFICATION DES BIENS ESSENTIELS CHU

## 📋 OBJECTIFS D'APPRENTISSAGE
- Maîtriser la méthodologie d'identification des biens essentiels
- Classifier les biens selon leur criticité hospitalière
- Évaluer les impacts métier en cas d'indisponibilité
- Cartographier les dépendances entre biens essentiels

## 🔍 1. MÉTHODOLOGIE D'IDENTIFICATION ANSSI ADAPTÉE SANTÉ

### Étape 1 - Inventaire exhaustif
**Approche Top-Down par missions hospitalières :**

**Mission Soins aux patients :**
├── Accueil et admissions
├── Urgences et réanimation  
├── Consultations et hospitalisations
├── Interventions chirurgicales
├── Examens et laboratoires
├── Pharmacie et thérapeutiques
└── Sorties et suivi

**Mission Support :**
├── Système d'information hospitalier
├── Infrastructures techniques
├── Ressources humaines spécialisées
└── Partenaires critiques

### Étape 2 - Analyse d'impact métier (BIA)
**Grille d'évaluation spécialisée santé :**

**Impact sur les soins (Priorité 1) :**
- **CATASTROPHIQUE (5)** : Décès patients, vies en jeu immédiat
- **CRITIQUE (4)** : Complications graves, séquelles permanentes
- **MAJEUR (3)** : Retards soins, dégradation état patients
- **MODÉRÉ (2)** : Gêne opérationnelle, qualité dégradée
- **MINEUR (1)** : Impact limité, solutions contournement

**Impact financier (Priorité 2) :**
- **CATASTROPHIQUE (5)** : >5M€ de perte
- **CRITIQUE (4)** : 1M€-5M€ de perte
- **MAJEUR (3)** : 200k€-1M€ de perte
- **MODÉRÉ (2)** : 50k€-200k€ de perte
- **MINEUR (1)** : <50k€ de perte

**Score global = MAX(Impact soins, Impact financier, Impact réglementaire)**

### Étape 3 - Classification par criticité
**CRITIQUE (Score 5)** : Vies en jeu, arrêt d'activité immédiat
**MAJEUR (Score 4)** : Impact patient significatif, perte financière
**MODÉRÉ (Score 3)** : Gêne opérationnelle, dégradation qualité
**MINEUR (Score 2-1)** : Impact limité, solutions de contournement

## 🏥 2. BIENS ESSENTIELS SPÉCIFIQUES CHU

### PROCESSUS MÉTIER CRITIQUES

**✅ Urgences vitales (CRITIQUE)**
- Accueil et tri des urgences
- Réanimation et soins intensifs
- Bloc opératoire d'urgence
- Laboratoires d'urgence (biologie, imagerie)
- **Impact** : Vies en jeu, responsabilité pénale

**✅ Hospitalisation complète (CRITIQUE)**
- Admissions et sorties patients
- Soins infirmiers et médicaux
- Prescriptions et administrations
- Surveillance et monitoring
- **Impact** : Continuité soins, sécurité patients

**✅ Plateau technique (MAJEUR)**
- Blocs opératoires programmés
- Imagerie médicale (IRM, scanner, radio)
- Laboratoires d'analyses
- Pharmacie hospitalière
- **Impact** : Report d'activité, perte financière

### INFORMATIONS CRITIQUES

**✅ Dossiers patients informatisés (CRITIQUE)**
- Identité et données administratives
- Antécédents et allergies
- Prescriptions et traitements
- Résultats d'examens et comptes-rendus
- **Impact** : Erreurs médicales, responsabilité

**✅ Images médicales PACS (CRITIQUE)**
- Radiographies et scanners
- IRM et échographies
- Images interventionnelles
- Historiques et comparaisons
- **Impact** : Erreurs diagnostic, retards soins

### SYSTÈMES D'INFORMATION

**✅ SIH - Système Information Hospitalier (CRITIQUE)**
- Serveurs centraux et bases de données
- Applications métier (admissions, soins, facturation)
- Interfaces et échanges de données
- Sauvegardes et archivage
- **Impact** : Paralysie totale activité

**✅ PACS - Picture Archiving System (CRITIQUE)**
- Serveurs de stockage images
- Stations de visualisation
- Réseaux de transmission
- Systèmes d'archivage long terme
- **Impact** : Arrêt imagerie, erreurs diagnostic

### INFRASTRUCTURES TECHNIQUES

**✅ Centres de données (CRITIQUE)**
- Serveurs physiques et virtuels
- Systèmes de stockage (SAN, NAS)
- Équipements réseau (switches, routeurs)
- Systèmes de sauvegarde
- **Impact** : Arrêt complet SI

**✅ Alimentations électriques (CRITIQUE)**
- Onduleurs et groupes électrogènes
- Tableaux électriques critiques
- Circuits dédiés blocs et réanimation
- Systèmes de supervision
- **Impact** : Arrêt équipements vitaux

## 📊 3. MATRICE DE CRITICITÉ CHU

### Grille d'évaluation complète
| Bien essentiel | Impact soins | Impact financier | Impact réglementaire | Score final | Criticité |
|----------------|--------------|------------------|---------------------|-------------|-----------|
| Urgences vitales | 5 | 4 | 4 | 5 | CRITIQUE |
| SIH Dossiers patients | 4 | 4 | 5 | 5 | CRITIQUE |
| PACS Imagerie | 4 | 3 | 3 | 4 | MAJEUR |
| Laboratoires analyses | 3 | 3 | 3 | 3 | MODÉRÉ |
| Pharmacie hospitalière | 3 | 2 | 3 | 3 | MODÉRÉ |
| Recherche clinique | 2 | 3 | 2 | 3 | MODÉRÉ |
| Gestion administrative | 1 | 3 | 2 | 3 | MODÉRÉ |
| Centre de données | 5 | 4 | 4 | 5 | CRITIQUE |

### Validation métier obligatoire
**Comité de validation CHU :**
- **Président** : Directeur Général ou Directeur Médical
- **Membres** : Chef pôle Urgences, Directeur Soins, RSSI, DSI, Pharmacien Chef, Chef Laboratoires, Directeur Qualité

**Processus de validation :**
1. Présentation inventaire et classification (30 min)
2. Discussion par domaine métier (60 min)
3. Arbitrages et ajustements (30 min)
4. Validation finale et signature (15 min)
      `,
      learningObjectives: [
        'Appliquer la méthodologie ANSSI d\'identification des biens essentiels',
        'Maîtriser la grille BIA adaptée au secteur santé',
        'Classifier les biens selon leur criticité métier',
        'Justifier les choix avec impacts sectoriels'
      ],
      keyPoints: [
        'L\'approche Top-Down par missions est plus efficace',
        'L\'impact sur les soins prime sur les autres critères',
        'La validation métier est obligatoire pour la crédibilité',
        'La matrice doit être régulièrement mise à jour'
      ],
      examples: [
        {
          title: 'CHU de Lille - Inventaire post-incident 2022',
          description: 'Révision complète après panne opérateur télécom',
          context: 'Perte connectivité 8h ayant impacté tous les sites',
          outcome: 'Reclassification réseaux en CRITIQUE',
          lessons: [
            'Les infrastructures réseau sont souvent sous-évaluées',
            'L\'expérience terrain enrichit la classification',
            'Prévoir les dépendances en cascade'
          ]
        }
      ],
      exercises: [],
      completed: false
    };
  }

  // 🎯 MÉTHODES UTILITAIRES
  static getAllModules(): SecurityFoundationStep[] {
    return [
      this.getModule1_1_ScopingMission(),
      this.getModule1_2_AssetIdentification()
      // Les autres modules seront ajoutés
    ];
  }

  static getModuleById(moduleId: string): SecurityFoundationStep | undefined {
    return this.getAllModules().find(module => module.id === moduleId);
  }

  static getTotalDuration(): number {
    return this.getAllModules().reduce((total, module) => total + module.duration, 0);
  }
}
