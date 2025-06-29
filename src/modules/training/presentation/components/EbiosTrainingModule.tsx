/**
 * 🎓 MODULE DE FORMATION EBIOS RM PROFESSIONNEL
 * Formation structurée en 5 ateliers distincts avec progression réelle
 * Conforme aux exigences ANSSI pour certification
 */

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Target, 
  Users, 
  Route, 
  ShieldCheck, 
  CheckCircle, 
  Clock, 
  Award,
  ArrowRight,
  Play,
  Lock,
  Unlock,
  Star,
  TrendingUp
} from 'lucide-react';

// 🎯 STRUCTURE COMPLÈTE DES 5 ATELIERS EBIOS RM
interface EbiosWorkshop {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<any>;
  duration: number; // en minutes
  objectives: string[];
  deliverables: string[];
  steps: WorkshopStep[];
  exercises?: Exercise[];
  prerequisites: string[];
  anssiCompliance: string[];
  realWorldExamples: string[];
  status: 'locked' | 'available' | 'in_progress' | 'completed' | 'validated';
  completionRate: number; // 0-100
  score: number; // 0-100
}

interface WorkshopStep {
  id: string;
  title: string;
  description: string;
  type: 'theory' | 'exercise' | 'validation' | 'case_study';
  duration: number;
  content: string;
  exercises?: Exercise[];
  practicalExercises?: Exercise[];
  validation?: ValidationCriteria;
  completed: boolean;
}

interface Exercise {
  id: string;
  question: string;
  type: 'multiple_choice' | 'multiple_select' | 'open_text' | 'drag_drop' | 'scenario';
  options?: string[];
  correctAnswer?: string | number | number[];
  explanation: string;
  points: number;
}

interface ValidationCriteria {
  minScore: number;
  requiredSteps: string[];
  expertValidation: boolean;
}

interface TrainingProgress {
  currentWorkshop: number;
  currentStep: string;
  overallCompletion: number;
  workshopCompletions: Record<number, number>;
  totalScore: number;
  badges: string[];
  timeSpent: number;
  lastActivity: Date;
}

// 🎯 PROPS DU COMPOSANT
interface EbiosTrainingModuleProps {
  userId: string;
  sessionId: string;
  trainingMode?: string;
  onProgressUpdate?: (progress: TrainingProgress) => void;
  onWorkshopComplete?: (workshopId: number, score: number) => void;
  onModuleComplete?: (finalScore: number, badges: string[]) => void;
}

export const EbiosTrainingModule: React.FC<EbiosTrainingModuleProps> = ({
  userId,
  sessionId,
  trainingMode = 'complete',
  onProgressUpdate,
  onWorkshopComplete,
  onModuleComplete
}) => {
  // 🎯 ÉTAT DE LA FORMATION
  const [currentView, setCurrentView] = useState<'overview' | 'workshop' | 'assessment'>('overview');
  const [selectedWorkshop, setSelectedWorkshop] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [progress, setProgress] = useState<TrainingProgress>({
    currentWorkshop: 1,
    currentStep: '',
    overallCompletion: 0,
    workshopCompletions: {},
    totalScore: 0,
    badges: [],
    timeSpent: 0,
    lastActivity: new Date()
  });

  // 🏗️ DÉFINITION COMPLÈTE DES 5 ATELIERS EBIOS RM
  const workshops: EbiosWorkshop[] = [
    {
      id: 1,
      title: "Atelier 1 - Socle de sécurité",
      subtitle: "Cadrage et identification des biens supports",
      description: "Identifiez les biens essentiels et supports du CHU, définissez le périmètre d'étude et établissez le socle de sécurité.",
      icon: BookOpen,
      duration: 120,
      objectives: [
        "Identifier les biens essentiels du CHU Métropolitain",
        "Cartographier les biens supports critiques (SIH, PACS, etc.)",
        "Définir les événements redoutés spécifiques à la santé",
        "Évaluer l'impact sur la continuité des soins",
        "Établir le socle de sécurité existant"
      ],
      deliverables: [
        "Cartographie des biens essentiels",
        "Inventaire des biens supports",
        "Matrice des événements redoutés",
        "Évaluation du socle de sécurité",
        "Rapport de cadrage"
      ],
      steps: [
        {
          id: "w1-context",
          title: "1. Contexte et périmètre du CHU",
          description: "Découvrez l'organisation, ses missions critiques et définissez le périmètre d'étude",
          type: "theory",
          duration: 20,
          content: `🏥 **CHU MÉTROPOLITAIN - CONTEXTE ORGANISATIONNEL**

**📊 DONNÉES CLÉS :**
• **3 sites interconnectés** : Hôpital principal (800 lits), Clinique annexe (300 lits), Centre de soins (100 lits)
• **3500 professionnels** : 800 médecins, 1200 infirmiers, 500 techniciens, 1000 administratifs
• **50 000 patients/an** en hospitalisation, 200 000 consultations externes
• **Budget annuel** : 450M€ dont 25M€ IT et 8M€ cybersécurité

**🎯 MISSIONS CRITIQUES :**
1. **Soins aux patients** (mission première - 24h/24)
2. **Urgences et réanimation** (vital - tolérance zéro)
3. **Recherche clinique** (innovation - données sensibles)
4. **Formation médicale** (continuité des compétences)

**🔗 LIENS AVEC LES AUTRES ATELIERS :**
→ **Atelier 2** : Ce contexte déterminera quelles sources de risques sont pertinentes (cybercriminels vs espions industriels)
→ **Atelier 3** : Les missions critiques définiront les scénarios stratégiques prioritaires
→ **Atelier 4** : L'organisation multi-sites influencera les modes opératoires d'attaque
→ **Atelier 5** : Le budget et la structure orienteront les mesures de traitement possibles

**📋 PÉRIMÈTRE D'ÉTUDE DÉFINI :**
• **Géographique** : 3 sites + interconnexions
• **Fonctionnel** : Soins, urgences, recherche (hors formation)
• **Technique** : SIH, PACS, réseaux, IoMT
• **Temporel** : Analyse sur 3 ans (2024-2027)`,
          completed: false
        },
        {
          id: "w1-business-values",
          title: "2. Biens essentiels (Valeurs métier)",
          description: "Identifiez et hiérarchisez les missions et processus critiques du CHU",
          type: "exercise",
          duration: 35,
          content: `🎯 **IDENTIFICATION DES BIENS ESSENTIELS**

**📚 MÉTHODOLOGIE EBIOS RM :**
Les biens essentiels représentent les **missions, processus et informations** dont l'organisation a besoin pour fonctionner et atteindre ses objectifs.

**🏥 BIENS ESSENTIELS DU CHU MÉTROPOLITAIN :**

**1. 🚑 PROCESSUS DE SOINS CRITIQUES**
• **Urgences vitales** : Prise en charge <15min, pronostic vital
• **Réanimation** : Surveillance continue, ventilation assistée
• **Bloc opératoire** : Interventions programmées et urgentes
• **Imagerie diagnostique** : Scanner, IRM, radiologie

**2. 📊 DONNÉES PATIENTS SENSIBLES**
• **Dossiers médicaux** : Antécédents, traitements, allergies
• **Données de recherche** : Essais cliniques, biobanque
• **Données administratives** : Identité, facturation, droits

**3. 🔬 PROCESSUS DE RECHERCHE**
• **Essais cliniques** : Protocoles, randomisation, suivi
• **Biobanque** : Échantillons, traçabilité, conservation
• **Publications** : Propriété intellectuelle, brevets

**🔗 DÉPENDANCES INTER-ATELIERS :**
→ **Vers Atelier 2** : Ces biens essentiels déterminent quelles sources de risques les cibleront
→ **Vers Atelier 3** : Chaque bien essentiel génèrera des scénarios stratégiques spécifiques
→ **Vers Atelier 4** : L'impact sur ces biens définira la gravité des scénarios opérationnels
→ **Vers Atelier 5** : La criticité orientera la priorisation des mesures de protection`,
          exercises: [
            {
              id: "bv1",
              question: "Parmi ces processus du CHU, lequel est le PLUS critique en termes de pronostic vital ?",
              type: "multiple_choice",
              options: [
                "Gestion administrative des admissions",
                "Urgences vitales et réanimation",
                "Recherche clinique et publications",
                "Formation des internes et externes"
              ],
              correctAnswer: 1,
              explanation: "Les urgences vitales et la réanimation sont critiques car leur défaillance peut directement causer des décès. C'est le bien essentiel de plus haute priorité.",
              points: 15
            },
            {
              id: "bv2",
              question: "Classez ces biens essentiels par ordre de criticité (1=plus critique) pour la continuité des soins :",
              type: "open_text",
              explanation: "Ordre attendu : 1-Urgences/Réanimation, 2-Bloc opératoire, 3-Imagerie, 4-Dossiers patients, 5-Recherche. La criticité se base sur l'impact immédiat sur la vie des patients.",
              points: 20
            }
          ],
          completed: false
        },
        {
          id: "w1-supporting-assets",
          title: "3. Biens supports (Actifs techniques)",
          description: "Cartographiez les systèmes informatiques et infrastructures qui supportent les biens essentiels",
          type: "exercise",
          duration: 50,
          content: `🖥️ **CARTOGRAPHIE DES BIENS SUPPORTS**

**📚 MÉTHODOLOGIE EBIOS RM :**
Les biens supports sont les **éléments techniques, humains et organisationnels** qui permettent aux biens essentiels de fonctionner.

**🏥 BIENS SUPPORTS CRITIQUES DU CHU :**

**1. 🖥️ SYSTÈMES INFORMATIQUES CRITIQUES**

**SIH (Système d'Information Hospitalier)**
• **Fonction** : Dossier patient, prescriptions, planning
• **Criticité** : VITALE (24h/24)
• **Dépendances** : Tous les processus de soins
• **→ Impact Atelier 2** : Cible privilégiée des ransomwares
• **→ Impact Atelier 3** : Scénario "Compromission SIH → Arrêt soins"
• **→ Impact Atelier 4** : Mode opératoire détaillé d'attaque
• **→ Impact Atelier 5** : Mesures de sauvegarde et continuité

**PACS (Picture Archiving Communication System)**
• **Fonction** : Stockage et diffusion imagerie médicale
• **Criticité** : VITALE (urgences, bloc)
• **Dépendances** : Scanner, IRM, radiologie
• **→ Liens inter-ateliers** : Cible d'espionnage (A2), Scénarios sabotage (A3-A4), Mesures chiffrement (A5)

**Systèmes de monitoring patients**
• **Fonction** : Surveillance temps réel, alertes vitales
• **Criticité** : VITALE (réanimation)
• **Dépendances** : IoMT, capteurs, réseaux
• **→ Liens inter-ateliers** : Vulnérabilités IoT (A2), Scénarios sabotage (A3-A4), Segmentation réseau (A5)

**2. 🌐 INFRASTRUCTURES TECHNIQUES**

**Réseau informatique**
• **Architecture** : Backbone fibré, WiFi médical, VLAN
• **Criticité** : VITALE (interconnexion)
• **→ Liens inter-ateliers** : Vecteur d'attaque (A2-A3-A4), Mesures segmentation (A5)

**Serveurs et stockage**
• **Infrastructure** : Datacenter principal + DR
• **Criticité** : VITALE (hébergement)
• **→ Liens inter-ateliers** : Cible ransomware (A2-A3-A4), Mesures sauvegarde (A5)

**3. 🏢 INFRASTRUCTURES PHYSIQUES**

**Alimentation électrique**
• **Système** : EDF + groupes secours + onduleurs
• **Criticité** : VITALE (continuité)
• **→ Liens inter-ateliers** : Sabotage physique (A2-A3-A4), Mesures redondance (A5)

**🔗 MATRICE DE DÉPENDANCES BIENS ESSENTIELS ↔ BIENS SUPPORTS :**

| Bien Essentiel | Biens Supports Critiques | Impact si compromis |
|----------------|---------------------------|---------------------|
| Urgences vitales | SIH + Monitoring + Réseau | Décès patients |
| Bloc opératoire | SIH + PACS + Alimentation | Annulation interventions |
| Réanimation | Monitoring + SIH + Réseau | Surveillance impossible |
| Imagerie | PACS + Serveurs + Réseau | Diagnostics retardés |

**🔗 FLUX VERS LES ATELIERS SUIVANTS :**
→ **Atelier 2** : Ces biens supports déterminent les **vecteurs d'attaque** possibles
→ **Atelier 3** : Chaque bien support génère des **chemins d'attaque** spécifiques
→ **Atelier 4** : Les vulnérabilités techniques définissent les **modes opératoires**
→ **Atelier 5** : L'architecture oriente les **mesures de protection** à déployer`,
          exercises: [
            {
              id: "bs1",
              question: "Quel bien support, s'il est compromis, aurait l'impact le PLUS critique sur les urgences vitales ?",
              type: "multiple_choice",
              options: [
                "Système de facturation",
                "SIH (Système d'Information Hospitalier)",
                "Système de gestion des stocks",
                "Messagerie électronique"
              ],
              correctAnswer: 1,
              explanation: "Le SIH contient tous les dossiers patients et gère les prescriptions. Sa compromission empêche l'accès aux antécédents médicaux critiques pour les urgences.",
              points: 15
            },
            {
              id: "bs2",
              question: "Établissez la chaîne de dépendances : Si le réseau informatique tombe, quels biens essentiels sont impactés et comment ?",
              type: "open_text",
              explanation: "Réponse attendue : Réseau → SIH inaccessible → Dossiers patients indisponibles → Urgences ralenties → Risque vital. Également PACS → Imagerie → Diagnostics → Soins retardés.",
              points: 25
            },
            {
              id: "bs3",
              question: "Parmi ces biens supports, lesquels seront des cibles prioritaires pour les attaquants dans l'Atelier 2 ?",
              type: "multiple_choice",
              options: [
                "SIH, PACS, Monitoring (systèmes critiques)",
                "Imprimantes, téléphones, climatisation",
                "Système de badges, parking, cafétéria",
                "Site web public, réseaux sociaux"
              ],
              correctAnswer: 0,
              explanation: "Les systèmes critiques (SIH, PACS, Monitoring) seront les cibles prioritaires car leur compromission a l'impact maximal sur les soins.",
              points: 20
            }
          ],
          completed: false
        },
        {
          id: "w1-feared-events",
          title: "4. Événements redoutés et impacts",
          description: "Définissez les conséquences de la compromission des biens essentiels sur la continuité des soins",
          type: "case_study",
          duration: 35,
          content: `⚠️ **ÉVÉNEMENTS REDOUTÉS - ANALYSE D'IMPACT**

**📚 MÉTHODOLOGIE EBIOS RM :**
Un événement redouté est la **compromission d'un bien essentiel** qui nuit aux missions de l'organisation. Il se caractérise par ses **impacts** et leur **gravité**.

**🏥 ÉVÉNEMENTS REDOUTÉS DU CHU MÉTROPOLITAIN :**

**1. 🚑 ER1 - ARRÊT DES URGENCES VITALES**
• **Bien essentiel compromis** : Processus urgences vitales
• **Impacts directs** :
  - Impossibilité de traiter les urgences vitales
  - Décès de patients faute de prise en charge
  - Transfert d'urgence vers autres hôpitaux
• **Impacts indirects** :
  - Surcharge des hôpitaux voisins
  - Perte de confiance du public
  - Responsabilité pénale des dirigeants
• **→ Lien Atelier 2** : Quelles sources de risques peuvent causer cet ER ?
• **→ Lien Atelier 3** : Quels scénarios stratégiques mènent à cet ER ?
• **→ Lien Atelier 4** : Comment techniquement réaliser cet ER ?
• **→ Lien Atelier 5** : Quelles mesures pour prévenir/limiter cet ER ?

**2. 📊 ER2 - FUITE MASSIVE DE DONNÉES PATIENTS**
• **Bien essentiel compromis** : Données patients sensibles
• **Impacts directs** :
  - Violation RGPD (amendes jusqu'à 20M€)
  - Atteinte à la vie privée des patients
  - Chantage/extorsion sur données
• **Impacts indirects** :
  - Perte de confiance patients
  - Procédures judiciaires
  - Impact réputationnel durable
• **→ Flux inter-ateliers** : Sources cybercriminelles (A2) → Scénarios exfiltration (A3) → Modes opératoires techniques (A4) → Mesures chiffrement/DLP (A5)

**3. 🔬 ER3 - SABOTAGE DE LA RECHERCHE CLINIQUE**
• **Bien essentiel compromis** : Processus de recherche
• **Impacts directs** :
  - Corruption des données d'essais cliniques
  - Perte de propriété intellectuelle
  - Arrêt des protocoles de recherche
• **Impacts indirects** :
  - Perte de financement recherche
  - Retard dans l'innovation médicale
  - Impact sur la réputation scientifique
• **→ Flux inter-ateliers** : Espionnage industriel (A2) → Scénarios infiltration (A3) → APT sophistiquées (A4) → Mesures détection avancée (A5)

**4. ⚙️ ER4 - PARALYSIE DU SYSTÈME D'INFORMATION**
• **Bien essentiel compromis** : Tous les processus informatisés
• **Impacts directs** :
  - Arrêt complet du SIH, PACS, monitoring
  - Retour au papier impossible (volumes)
  - Paralysie administrative et médicale
• **Impacts indirects** :
  - Coûts de remise en état (millions €)
  - Perte d'activité prolongée
  - Démission de personnel clé
• **→ Flux inter-ateliers** : Ransomware (A2) → Scénarios propagation (A3) → Techniques chiffrement (A4) → Mesures sauvegarde/continuité (A5)

**📊 MATRICE GRAVITÉ DES ÉVÉNEMENTS REDOUTÉS :**

| Événement Redouté | Impact Humain | Impact Financier | Impact Réputationnel | Gravité Globale |
|-------------------|---------------|------------------|---------------------|-----------------|
| ER1 - Arrêt urgences | CRITIQUE (décès) | MAJEUR (>10M€) | CRITIQUE | **CRITIQUE** |
| ER2 - Fuite données | MAJEUR (vie privée) | CRITIQUE (amendes) | MAJEUR | **CRITIQUE** |
| ER3 - Sabotage recherche | MINEUR | MAJEUR (brevets) | MAJEUR | **MAJEUR** |
| ER4 - Paralysie SI | CRITIQUE (soins) | CRITIQUE (>20M€) | CRITIQUE | **CRITIQUE** |

**🔗 LIENS MÉTHODOLOGIQUES AVEC LES ATELIERS SUIVANTS :**

**→ ATELIER 2 - Sources de risques :**
Ces événements redoutés déterminent quelles sources de risques sont **pertinentes** :
- ER1/ER4 → Cybercriminels (ransomware)
- ER2 → Cybercriminels + Initiés malveillants
- ER3 → Espions industriels + États

**→ ATELIER 3 - Scénarios stratégiques :**
Chaque événement redouté génère des **scénarios stratégiques** :
- ER1 : "Cybercriminel → SIH → Arrêt urgences"
- ER2 : "Initié malveillant → Base données → Fuite massive"
- ER3 : "Espion industriel → Serveurs recherche → Sabotage"

**→ ATELIER 4 - Scénarios opérationnels :**
Les événements redoutés définissent les **objectifs techniques** :
- Comment techniquement paralyser le SIH ?
- Comment exfiltrer massivement les données ?
- Comment corrompre les données de recherche ?

**→ ATELIER 5 - Traitement du risque :**
La gravité des événements redoutés oriente la **priorisation** :
- ER1/ER2/ER4 (CRITIQUE) → Mesures prioritaires
- ER3 (MAJEUR) → Mesures secondaires`,
          exercises: [
            {
              id: "er1",
              question: "Quel est l'impact le PLUS grave de l'événement redouté 'Arrêt des urgences vitales' ?",
              type: "multiple_choice",
              options: [
                "Perte financière due à l'arrêt d'activité",
                "Décès de patients faute de prise en charge",
                "Atteinte à la réputation de l'hôpital",
                "Surcharge des hôpitaux concurrents"
              ],
              correctAnswer: 1,
              explanation: "Le décès de patients est l'impact le plus grave car irréversible et engage la responsabilité pénale. C'est pourquoi cet événement redouté est classé CRITIQUE.",
              points: 15
            },
            {
              id: "er2",
              question: "Expliquez comment l'événement redouté 'Fuite massive de données patients' va influencer l'Atelier 2 (Sources de risques) :",
              type: "open_text",
              explanation: "Réponse attendue : Cet ER oriente vers des sources comme cybercriminels (revente données), initiés malveillants (accès privilégié), hacktivistes (exposition publique). Il exclut les sources non intéressées par les données patients.",
              points: 25
            },
            {
              id: "er3",
              question: "Cas pratique : Le CHU subit une cyberattaque qui chiffre tous les serveurs. Identifiez les événements redoutés déclenchés et leurs impacts en cascade :",
              type: "open_text",
              explanation: "Réponse attendue : ER4 (Paralysie SI) → ER1 (Arrêt urgences car pas d'accès SIH) → Décès patients + Coûts énormes + Impact réputationnel. Cascade d'événements redoutés.",
              points: 30
            }
          ],
          completed: false
        },
        {
          id: "w1-security-baseline",
          title: "5. Socle de sécurité existant",
          description: "Évaluez les mesures de sécurité actuelles et identifiez les écarts",
          type: "validation",
          duration: 20,
          content: `🛡️ **ÉVALUATION DU SOCLE DE SÉCURITÉ EXISTANT**

**📚 MÉTHODOLOGIE EBIOS RM :**
Le socle de sécurité représente l'ensemble des **mesures de sécurité déjà en place** pour protéger les biens supports et prévenir les événements redoutés.

**🏥 SOCLE DE SÉCURITÉ ACTUEL DU CHU :**

**1. 🔐 MESURES TECHNIQUES EXISTANTES**

**Sécurité réseau :**
• Firewall périmétrique (Fortinet FortiGate)
• Segmentation VLAN (médical/administratif/invités)
• VPN SSL pour accès distant
• **→ Évaluation** : PARTIEL - Manque microsegmentation IoMT

**Sécurité des systèmes :**
• Antivirus centralisé (Symantec Endpoint)
• Mises à jour automatiques Windows
• Sauvegarde quotidienne (Veeam)
• **→ Évaluation** : INSUFFISANT - Pas d'EDR, sauvegardes non testées

**Contrôle d'accès :**
• Active Directory centralisé
• Authentification par badge + PIN
• Comptes nominatifs
• **→ Évaluation** : FAIBLE - Pas de MFA, comptes partagés

**2. 🏛️ MESURES ORGANISATIONNELLES**

**Politique de sécurité :**
• Charte informatique signée
• Procédures de gestion des incidents
• Sensibilisation annuelle
• **→ Évaluation** : BASIQUE - Pas de formation phishing

**Gestion des accès :**
• Processus d'habilitation
• Révision annuelle des droits
• Départ/mutation tracés
• **→ Évaluation** : CORRECT - Mais délais trop longs

**3. 🏢 MESURES PHYSIQUES**

**Sécurité des locaux :**
• Contrôle d'accès par badge
• Vidéosurveillance 24h/24
• Gardiennage de nuit
• **→ Évaluation** : CORRECT - Datacenter bien protégé

**📊 MATRICE D'ÉVALUATION DU SOCLE :**

| Domaine | Mesures existantes | Niveau | Écarts identifiés |
|---------|-------------------|--------|-------------------|
| Réseau | Firewall, VLAN | 🟡 PARTIEL | Microsegmentation IoMT |
| Systèmes | Antivirus, Backup | 🔴 INSUFFISANT | EDR, Tests de restauration |
| Accès | AD, Badges | 🔴 FAIBLE | MFA, Comptes privilégiés |
| Organisation | Charte, Procédures | 🟡 BASIQUE | Formation continue |
| Physique | Badges, Vidéo | 🟢 CORRECT | RAS |

**🔗 LIENS AVEC LES ATELIERS SUIVANTS :**

**→ ATELIER 2 - Sources de risques :**
Les **écarts du socle** déterminent quelles sources de risques peuvent exploiter ces faiblesses :
- Pas de MFA → Attaques par force brute
- Pas d'EDR → Malwares avancés non détectés
- Microsegmentation faible → Propagation latérale

**→ ATELIER 3 - Scénarios stratégiques :**
Les **vulnérabilités identifiées** orientent les scénarios :
- "Cybercriminel exploite absence MFA → Compromission comptes"
- "Malware contourne antivirus → Propagation réseau"

**→ ATELIER 4 - Scénarios opérationnels :**
Les **failles techniques** définissent les modes opératoires :
- Techniques de contournement antivirus
- Exploitation des comptes partagés
- Propagation via VLAN mal segmentés

**→ ATELIER 5 - Traitement du risque :**
Les **écarts identifiés** deviennent les **mesures prioritaires** :
- Déploiement MFA (priorité 1)
- Mise en place EDR (priorité 1)
- Microsegmentation IoMT (priorité 2)
- Formation phishing (priorité 2)

**🎯 SYNTHÈSE ATELIER 1 - LIVRABLES POUR LES ATELIERS SUIVANTS :**

1. **Contexte et périmètre** → Oriente la pertinence des sources (A2)
2. **Biens essentiels** → Définit les cibles des scénarios (A3-A4)
3. **Biens supports** → Détermine les vecteurs d'attaque (A2-A3-A4)
4. **Événements redoutés** → Fixe les objectifs des attaquants (A2-A3-A4)
5. **Socle de sécurité** → Identifie les vulnérabilités exploitables (A2-A3-A4) et les mesures à renforcer (A5)

**Cette base solide de l'Atelier 1 est INDISPENSABLE pour la cohérence méthodologique des 4 ateliers suivants !**`,
          exercises: [
            {
              id: "ss1",
              question: "Quel écart du socle de sécurité représente le risque le PLUS élevé pour le CHU ?",
              type: "multiple_choice",
              options: [
                "Absence de vidéosurveillance dans les couloirs",
                "Absence de MFA sur les comptes administrateurs",
                "Charte informatique non mise à jour",
                "Sauvegarde sur un seul site"
              ],
              correctAnswer: 1,
              explanation: "L'absence de MFA sur les comptes administrateurs permet une compromission facile par force brute ou phishing, donnant un accès privilégié à tous les systèmes critiques.",
              points: 20
            },
            {
              id: "ss2",
              question: "Expliquez comment l'écart 'Pas d'EDR' va influencer l'Atelier 4 (Scénarios opérationnels) :",
              type: "open_text",
              explanation: "Réponse attendue : Sans EDR, les malwares avancés ne sont pas détectés. L'Atelier 4 devra modéliser des scénarios où l'attaquant utilise des techniques d'évasion antivirus et reste indétectable longtemps.",
              points: 25
            }
          ],
          completed: false
        }
      ],
      prerequisites: [],
      anssiCompliance: ["Guide ANSSI Santé", "Référentiel HDS", "Méthodologie EBIOS RM v1.5"],
      realWorldExamples: [
        "Cyberattaque CHU Rouen 2019",
        "Ransomware hôpitaux français 2021",
        "Incident PACS CHU Toulouse"
      ],
      status: 'available',
      completionRate: 0,
      score: 0
    },
    {
      id: 2,
      title: "Atelier 2 - Sources de risques",
      subtitle: "Identification et analyse des menaces",
      description: "Analysez l'écosystème de menaces spécifique au secteur hospitalier et identifiez les sources de risques pertinentes.",
      icon: Target,
      duration: 90,
      objectives: [
        "Identifier les sources de risques du secteur santé",
        "Analyser les motivations des attaquants",
        "Évaluer les capacités des sources de risques",
        "Cartographier l'écosystème de menaces",
        "Prioriser les risques selon le contexte CHU"
      ],
      deliverables: [
        "Cartographie des sources de risques",
        "Analyse des motivations",
        "Évaluation des capacités",
        "Matrice de pertinence",
        "Rapport d'analyse des menaces"
      ],
      steps: [
        {
          id: "w2-threat-landscape",
          title: "1. Paysage des menaces secteur santé",
          description: "Découvrez l'écosystème de menaces spécifique au secteur hospitalier et ses particularités",
          type: "theory",
          duration: 25,
          content: `🌐 **ÉCOSYSTÈME DE MENACES SECTEUR SANTÉ**

**📚 MÉTHODOLOGIE EBIOS RM :**
L'Atelier 2 identifie les **sources de risques** susceptibles de s'intéresser aux biens essentiels identifiés dans l'Atelier 1. Une source de risque combine **qui** (acteur), **pourquoi** (motivation) et **comment** (capacités).

**🔗 UTILISATION DES LIVRABLES ATELIER 1 :**

**📥 DONNÉES RÉCUPÉRÉES DE L'ATELIER 1 :**
• **Contexte CHU** : Secteur santé, 3 sites, 3500 employés, budget 450M€
• **Biens essentiels** : Urgences vitales, données patients, recherche clinique
• **Biens supports** : SIH, PACS, monitoring, réseau, serveurs
• **Événements redoutés** : Arrêt urgences, fuite données, sabotage recherche
• **Vulnérabilités** : Pas de MFA, EDR, microsegmentation, formation limitée

**🎯 COMMENT CES DONNÉES ORIENTENT L'ANALYSE :**

**1. Le contexte "CHU secteur santé" détermine la pertinence des sources :**
→ Cybercriminels spécialisés santé = TRÈS PERTINENTS
→ Espions pharmaceutiques = PERTINENTS (recherche active)
→ États hostiles = PEU PERTINENTS (pas stratégique national)

**2. Les biens essentiels "urgences vitales + données patients" attirent :**
→ Cybercriminels : Criticité vitale = pression maximale pour rançons
→ Espions : Données recherche = propriété intellectuelle précieuse
→ Initiés : Accès privilégié à tous les biens essentiels

**3. Les vulnérabilités "pas de MFA + EDR" créent des opportunités :**
→ Cybercriminels : Exploitation facile pour ransomware
→ Espions : Persistance longue durée indétectable
→ Initiés : Contournement des contrôles de sécurité

**Cette analyse croisée permet d'identifier précisément quelles sources représentent une menace réelle pour LE CHU SPÉCIFIQUEMENT.**

**🏥 SPÉCIFICITÉS DU SECTEUR SANTÉ :**

**1. 🎯 ATTRACTIVITÉ PARTICULIÈRE DES HÔPITAUX**

**Données ultra-sensibles :**
• **Dossiers médicaux complets** : Antécédents, pathologies, traitements
• **Données biométriques** : ADN, empreintes, imagerie médicale
• **Données de recherche** : Essais cliniques, brevets, innovations
• **Données administratives** : Identité, sécurité sociale, facturation

**Criticité vitale :**
• **Tolérance zéro** aux interruptions de service
• **Impact immédiat** sur la vie humaine
• **Pression temporelle** énorme en cas d'incident
• **Vulnérabilité au chantage** (vies en jeu)

**Écosystème complexe :**
• **Interconnexions multiples** : Laboratoires, pharmacies, assurances
• **Dispositifs IoMT** : Équipements médicaux connectés
• **Personnel mobile** : Médecins, infirmiers, internes
• **Accès 24h/24** : Urgences, réanimation, surveillance

**2. 📊 STATISTIQUES ALARMANTES SECTEUR SANTÉ**

**Cyberattaques en hausse :**
• **+125% d'attaques** sur le secteur santé (2020-2023)
• **1 hôpital attaqué/semaine** en France (2023)
• **Coût moyen** : 4,5M€ par incident majeur
• **Temps de récupération** : 6-12 mois en moyenne

**Vulnérabilités spécifiques :**
• **Systèmes legacy** : Équipements médicaux non patchables
• **Budgets IT limités** : 2-3% vs 8-12% autres secteurs
• **Formation insuffisante** : Personnel médical non sensibilisé
• **Pression opérationnelle** : Sécurité vs continuité des soins

**3. 🌍 CONTEXTE GÉOPOLITIQUE ET RÉGLEMENTAIRE**

**Enjeux géopolitiques :**
• **Souveraineté sanitaire** : Données de santé publique
• **Recherche stratégique** : Vaccins, traitements innovants
• **Intelligence économique** : Brevets pharmaceutiques
• **Déstabilisation sociale** : Impact sur la confiance publique

**Cadre réglementaire strict :**
• **RGPD renforcé** : Données de santé = catégorie spéciale
• **Référentiel HDS** : Hébergement données de santé
• **Doctrine ANSSI** : Sécurité des systèmes d'information santé
• **Responsabilité pénale** : Dirigeants engagés en cas d'incident

**🔍 TYPOLOGIE DES MENACES SANTÉ :**

**Menaces externes :**
• **Cybercriminels spécialisés** : Ransomware-as-a-Service santé
• **Espions industriels** : Vol de propriété intellectuelle
• **Hacktivistes** : Protestation contre politiques de santé
• **États hostiles** : Déstabilisation, espionnage, sabotage

**Menaces internes :**
• **Initiés malveillants** : Personnel mécontent, corrompu
• **Erreurs humaines** : Mauvaises manipulations, négligences
• **Prestataires compromis** : Supply chain, maintenance
• **Anciens employés** : Accès non révoqués, vengeance

**Menaces hybrides :**
• **Ingénierie sociale** : Exploitation de la bienveillance médicale
• **Attaques physiques** : Intrusion, sabotage d'équipements
• **Compromission supply chain** : Équipements médicaux infectés
• **Attaques coordonnées** : Multi-vecteurs, multi-sites

**📈 ÉVOLUTION DES MENACES :**

**Tendances 2024-2025 :**
• **IA malveillante** : Deepfakes, automatisation d'attaques
• **Ransomware double extorsion** : Chiffrement + fuite de données
• **Attaques IoMT** : Ciblage des dispositifs médicaux connectés
• **Supply chain sophistiquée** : Compromission en amont

**Nouvelles techniques :**
• **Living off the land** : Utilisation d'outils légitimes
• **Attaques sans malware** : Exploitation de vulnérabilités
• **Persistance avancée** : APT longue durée indétectables
• **Évasion comportementale** : Contournement des IA de détection

**🎯 FOCUS CHU MÉTROPOLITAIN :**

**Attractivité spécifique :**
• **50 000 patients/an** : Base de données massive
• **Recherche clinique** : Propriété intellectuelle précieuse
• **3 sites interconnectés** : Surface d'attaque étendue
• **Budget 450M€** : Capacité de paiement de rançons

**Vulnérabilités identifiées (Atelier 1) :**
• **Pas de MFA** : Facilite les attaques par force brute
• **Pas d'EDR** : Malwares avancés indétectables
• **Segmentation faible** : Propagation latérale aisée
• **Formation limitée** : Personnel vulnérable au phishing

Cette analyse du paysage des menaces nous permet maintenant d'identifier précisément quelles sources de risques sont **pertinentes** pour le CHU Métropolitain.`,
          completed: false
        },
        {
          id: "w2-risk-sources-identification",
          title: "2. Identification des sources de risques",
          description: "Identifiez et classifiez les sources de risques pertinentes pour le CHU",
          type: "exercise",
          duration: 35,
          content: `🎯 **IDENTIFICATION DES SOURCES DE RISQUES PERTINENTES**

**📚 MÉTHODOLOGIE EBIOS RM :**
Une source de risque est caractérisée par :
• **QUI** : Type d'acteur (cybercriminel, espion, etc.)
• **POURQUOI** : Motivations (financière, politique, etc.)
• **COMMENT** : Capacités techniques et ressources
• **PERTINENCE** : Intérêt réel pour les biens du CHU

**🏥 SOURCES DE RISQUES PERTINENTES POUR LE CHU :**

**1. 💰 CYBERCRIMINELS SPÉCIALISÉS SANTÉ**

**Profil :**
• **Qui** : Groupes criminels organisés (Conti, LockBit, BlackCat)
• **Spécialisation** : Ransomware ciblant spécifiquement les hôpitaux
• **Organisation** : RaaS (Ransomware-as-a-Service) professionnalisé
• **Géographie** : Principalement Europe de l'Est, Russie

**Motivations :**
• **Financière principale** : Rançons 500K€ à 5M€
• **Facilité de paiement** : Hôpitaux paient souvent rapidement
• **Pression temporelle** : Vies en jeu = levier de négociation
• **Revente de données** : Marché noir des données médicales

**Capacités techniques :**
• **Très élevées** : Exploits 0-day, techniques d'évasion
• **Ressources importantes** : Équipes spécialisées, infrastructure
• **Veille technologique** : Adaptation rapide aux défenses
• **Support 24h/24** : "Service client" pour négociations

**Pertinence pour le CHU :** ⭐⭐⭐⭐⭐ **TRÈS ÉLEVÉE**

**🔗 ANALYSE BASÉE SUR LES LIVRABLES ATELIER 1 :**

**Contexte attractif (Atelier 1) :**
• **Secteur santé** → Cybercriminels spécialisés dans ce domaine
• **Budget 450M€** → Capacité de paiement de rançons élevées
• **3 sites interconnectés** → Surface d'attaque étendue
• **50 000 patients/an** → Base de données massive et précieuse

**Biens essentiels ciblés (Atelier 1) :**
• **Urgences vitales** → Pression temporelle maximale (vies en jeu)
• **Données patients** → Valeur marché noir (250€/dossier × 50k = 12,5M€)
• **SIH critique** → Paralysie complète = rançon maximale

**Vulnérabilités exploitables (Atelier 1) :**
• **Pas de MFA** → Attaques par force brute facilitées
• **Pas d'EDR** → Ransomware indétectable plus longtemps
• **Formation limitée** → Phishing efficace sur le personnel
• **Segmentation faible** → Propagation latérale rapide

**Événements redoutés alignés (Atelier 1) :**
• **ER1 - Arrêt urgences** → Objectif parfait pour extorsion
• **ER4 - Paralysie SI** → Impact maximal = rançon maximale

**2. 🕵️ ESPIONS INDUSTRIELS PHARMACEUTIQUES**

**Profil :**
• **Qui** : Concurrents pharmaceutiques, laboratoires étrangers
• **Cibles** : Propriété intellectuelle, données de recherche
• **Méthodes** : Espionnage économique, vol de brevets
• **Discrétion** : Attaques furtives, longue durée

**Motivations :**
• **Économique** : Brevets valant des milliards
• **Concurrentielle** : Avantage sur la recherche
• **Géopolitique** : Souveraineté pharmaceutique
• **Temporelle** : Raccourcir les cycles de R&D

**Capacités techniques :**
• **Élevées** : APT sophistiquées, persistance
• **Ressources moyennes** : Budgets R&D détournés
• **Patience** : Campagnes de plusieurs années
• **Discrétion** : Techniques d'évasion avancées

**Pertinence pour le CHU :** ⭐⭐⭐⭐ **ÉLEVÉE**

**🔗 ANALYSE BASÉE SUR LES LIVRABLES ATELIER 1 :**

**Biens essentiels attractifs (Atelier 1) :**
• **Processus de recherche** → Propriété intellectuelle précieuse
• **Données de recherche** → Essais cliniques, biobanque génétique
• **Partenariats industriels** → Accès indirect aux géants pharma

**Biens supports ciblés (Atelier 1) :**
• **Serveurs de recherche** → Stockage des données d'essais
• **Messagerie chercheurs** → Communications confidentielles
• **Systèmes de biobanque** → Données génétiques uniques

**Vulnérabilités exploitables (Atelier 1) :**
• **Segmentation recherche limitée** → Accès facilité aux données
• **Pas d'EDR** → Persistance longue durée indétectable
• **Accès chercheurs non contrôlé** → Vecteur d'attaque privilégié

**Événements redoutés alignés (Atelier 1) :**
• **ER3 - Sabotage recherche** → Objectif direct des espions
• **ER2 - Fuite données** → Exfiltration discrète de propriété intellectuelle

**3. 🏴‍☠️ HACKTIVISTES SANTÉ**

**Profil :**
• **Qui** : Groupes militants (Anonymous, etc.)
• **Idéologie** : Justice sociale, accès aux soins
• **Cibles** : Systèmes publics, politiques de santé
• **Visibilité** : Actions médiatisées, revendications

**Motivations :**
• **Idéologique** : Protestation contre inégalités
• **Politique** : Opposition aux réformes hospitalières
• **Sociale** : Défense de l'hôpital public
• **Médiatique** : Sensibilisation de l'opinion

**Capacités techniques :**
• **Moyennes** : Scripts kiddies à experts confirmés
• **Ressources limitées** : Bénévolat, crowdfunding
• **Créativité** : Détournement d'outils, innovation
• **Réseau** : Collaboration internationale

**Pertinence pour le CHU :** ⭐⭐⭐ **MOYENNE**
• Hôpital public = cible idéologique
• Visibilité médiatique = impact recherché
• Vulnérabilités connues = opportunités
• Mais pas de gain financier direct

**4. 🌍 ÉTATS HOSTILES (APT)**

**Profil :**
• **Qui** : Services de renseignement étrangers
• **Objectifs** : Espionnage, déstabilisation, sabotage
• **Ressources** : Budgets étatiques, équipes dédiées
• **Persistance** : Campagnes multi-années

**Motivations :**
• **Géopolitique** : Affaiblissement du système de santé
• **Espionnage** : Données de santé publique
• **Économique** : Vol de propriété intellectuelle
• **Déstabilisation** : Impact sur la confiance publique

**Capacités techniques :**
• **Très élevées** : 0-day, techniques militaires
• **Ressources illimitées** : Budgets étatiques
• **Patience** : Campagnes de plusieurs années
• **Sophistication** : Techniques de niveau militaire

**Pertinence pour le CHU :** ⭐⭐ **FAIBLE À MOYENNE**
• CHU non stratégique au niveau national
• Mais recherche peut intéresser
• Données de santé publique limitées
• Effort/bénéfice défavorable

**5. 😈 INITIÉS MALVEILLANTS**

**Profil :**
• **Qui** : Personnel interne mécontent
• **Accès** : Privilégié, légitime, difficile à détecter
• **Motivations** : Vengeance, corruption, idéologie
• **Dangerosité** : Connaissance intime des systèmes

**Motivations :**
• **Vengeance** : Licenciement, conflit hiérarchique
• **Financière** : Corruption, revente de données
• **Idéologique** : Désaccord avec politiques
• **Psychologique** : Reconnaissance, pouvoir

**Capacités techniques :**
• **Variables** : De basiques à très élevées
• **Accès privilégié** : Contournement des contrôles
• **Connaissance interne** : Vulnérabilités cachées
• **Confiance** : Difficile à suspecter

**Pertinence pour le CHU :** ⭐⭐⭐⭐ **ÉLEVÉE**

**🔗 ANALYSE BASÉE SUR LES LIVRABLES ATELIER 1 :**

**Contexte favorable (Atelier 1) :**
• **3500 employés** → Surface d'attaque interne très importante
• **3 sites** → Difficultés de surveillance centralisée
• **Personnel 24h/24** → Horaires décalés, surveillance réduite

**Accès privilégié aux biens essentiels (Atelier 1) :**
• **Urgences vitales** → Personnel médical accès direct
• **Données patients** → Médecins, infirmiers accès légitime
• **Systèmes critiques** → Administrateurs IT accès privilégié
• **Recherche clinique** → Chercheurs accès aux données sensibles

**Vulnérabilités exploitables (Atelier 1) :**
• **Contrôles internes limités** → Surveillance insuffisante
• **Comptes partagés** → Traçabilité réduite
• **Révision droits annuelle** → Délais trop longs
• **Pas de surveillance comportementale** → Anomalies non détectées

**Facteurs de risque identifiés (Atelier 1) :**
• **Stress professionnel** → Surcharge, conditions difficiles
• **Précarité** → Intérimaires, CDD, sous-traitants
• **Accès physique** → Badges, locaux techniques
• **Connaissance intime** → Architecture, procédures, vulnérabilités

**📊 MATRICE DE PERTINENCE DES SOURCES :**

| Source de risque | Motivation | Capacités | Opportunités | Pertinence |
|------------------|------------|-----------|--------------|------------|
| **Cybercriminels santé** | Très forte | Très élevées | Très élevées | ⭐⭐⭐⭐⭐ |
| **Espions industriels** | Forte | Élevées | Élevées | ⭐⭐⭐⭐ |
| **Initiés malveillants** | Variable | Variables | Très élevées | ⭐⭐⭐⭐ |
| **Hacktivistes** | Moyenne | Moyennes | Moyennes | ⭐⭐⭐ |
| **États hostiles** | Faible | Très élevées | Faibles | ⭐⭐ |

**🎯 SOURCES PRIORITAIRES POUR LA SUITE :**

**Priorité 1 - Cybercriminels spécialisés santé**
**Priorité 2 - Espions industriels pharmaceutiques**
**Priorité 3 - Initiés malveillants**

Ces 3 sources seront approfondies dans les étapes suivantes et alimenteront les Ateliers 3-4-5.`,
          exercises: [
            {
              id: "rs1",
              question: "Quelle source de risque représente la menace la PLUS critique pour le CHU Métropolitain ?",
              type: "multiple_choice",
              options: [
                "États hostiles (APT étatiques)",
                "Cybercriminels spécialisés santé",
                "Hacktivistes militants",
                "Concurrents commerciaux"
              ],
              correctAnswer: 1,
              explanation: "Les cybercriminels spécialisés santé combinent motivation très forte (financière), capacités très élevées et opportunités maximales (vulnérabilités du CHU). Ils représentent la menace la plus probable et impactante.",
              points: 20
            },
            {
              id: "rs2",
              question: "Pourquoi les initiés malveillants sont-ils particulièrement dangereux pour un CHU ?",
              type: "open_text",
              explanation: "Réponse attendue : Accès privilégié légitime, connaissance intime des systèmes, difficiles à détecter, contournement des contrôles de sécurité, 3500 employés = surface d'attaque importante.",
              points: 25
            }
          ],
          completed: false
        },
        {
          id: "w2-motivations-analysis",
          title: "3. Analyse des motivations et objectifs",
          description: "Analysez en détail les motivations de chaque source et leurs objectifs spécifiques",
          type: "case_study",
          duration: 30,
          content: `🧠 **ANALYSE APPROFONDIE DES MOTIVATIONS**

**📚 MÉTHODOLOGIE EBIOS RM :**
Comprendre les **motivations** des sources de risques permet de :
• Prédire leurs **cibles prioritaires**
• Anticiper leurs **modes opératoires**
• Adapter les **mesures de protection**
• Évaluer la **vraisemblance** des scénarios

**🏥 MOTIVATIONS DÉTAILLÉES PAR SOURCE :**

**1. 💰 CYBERCRIMINELS SPÉCIALISÉS SANTÉ**

**Motivation principale : FINANCIÈRE**

**Objectifs spécifiques :**
• **Rançons élevées** : 500K€ à 5M€ selon la taille
• **Paiement rapide** : Pression vitale = négociation courte
• **Revente de données** : 250€/dossier médical complet
• **Cryptomonnaies** : Blanchiment via Bitcoin, Monero

**Cibles prioritaires dans le CHU :**
• **SIH principal** : Paralysie complète = rançon maximale
• **Serveurs de sauvegarde** : Empêcher la restauration
• **PACS imagerie** : Données volumineuses précieuses
• **Base données patients** : 50 000 dossiers = 12,5M€ potentiel

**Facteurs d'attractivité :**
• **Budget CHU 450M€** : Capacité de paiement prouvée
• **Criticité vitale** : Pression psychologique énorme
• **Médiatisation** : Publicité pour le groupe criminel
• **Vulnérabilités connues** : Facilité d'exécution

**Saisonnalité :**
• **Pics hivernaux** : Surcharge hospitalière = pression max
• **Évitement été** : Moins de personnel, détection difficile
• **Ciblage week-ends** : Équipes IT réduites

**2. 🕵️ ESPIONS INDUSTRIELS PHARMACEUTIQUES**

**Motivation principale : ÉCONOMIQUE/CONCURRENTIELLE**

**Objectifs spécifiques :**
• **Vol de brevets** : Économie de 10-15 ans de R&D
• **Données d'essais cliniques** : Résultats avant publication
• **Formulations** : Compositions chimiques exclusives
• **Stratégies commerciales** : Avantage concurrentiel

**Cibles prioritaires dans le CHU :**
• **Serveurs de recherche** : Données d'essais cliniques
• **Biobanque numérique** : Données génétiques uniques
• **Messagerie chercheurs** : Communications confidentielles
• **Partenariats industriels** : Contrats, négociations

**Facteurs d'attractivité :**
• **Réputation scientifique** : CHU reconnu en recherche
• **Partenariats Big Pharma** : Accès indirect aux géants
• **Données longitudinales** : Suivi patients sur années
• **Propriété intellectuelle** : Brevets en cours

**Temporalité :**
• **Campagnes longues** : 2-3 ans de persistance
• **Phases critiques** : Avant publications, dépôts brevets
• **Discrétion absolue** : Éviter la détection

**3. 😈 INITIÉS MALVEILLANTS**

**Motivations multiples : VENGEANCE/FINANCIÈRE/IDÉOLOGIQUE**

**Profils et motivations :**

**Employé mécontent (Vengeance) :**
• **Déclencheurs** : Licenciement, mutation forcée, conflit
• **Objectifs** : Nuire à l'institution, se venger
• **Cibles** : Systèmes critiques, données patients
• **Timing** : Période de préavis, après départ

**Personnel corrompu (Financière) :**
• **Déclencheurs** : Difficultés financières, corruption
• **Objectifs** : Revente de données, accès privilégié
• **Cibles** : Bases de données, informations VIP
• **Discrétion** : Éviter la détection, petites quantités

**Militant interne (Idéologique) :**
• **Déclencheurs** : Désaccord avec politiques, éthique
• **Objectifs** : Révéler des dysfonctionnements
• **Cibles** : Documents sensibles, communications
• **Méthodes** : Fuites contrôlées, whistleblowing

**Facteurs de risque CHU :**
• **Stress professionnel** : Surcharge, conditions difficiles
• **Précarité** : Intérimaires, CDD, sous-traitants
• **Accès privilégié** : Administrateurs, techniciens
• **Contrôles faibles** : Surveillance interne limitée

**📊 MATRICE MOTIVATIONS × CIBLES :**

| Source | Motivation | Cible prioritaire | Objectif final | Timing |
|--------|------------|-------------------|----------------|---------|
| **Cybercriminels** | Financière | SIH + Sauvegardes | Rançon 2-5M€ | Rapide (heures) |
| **Espions industriels** | Concurrentielle | Recherche + Biobanque | Brevets + Données | Long (années) |
| **Initiés vengeance** | Émotionnelle | Systèmes critiques | Nuire maximum | Immédiat |
| **Initiés corruption** | Financière | Données VIP | Revente discrète | Récurrent |

**🎯 IMPLICATIONS POUR LES ATELIERS SUIVANTS :**

**→ Atelier 3 (Scénarios stratégiques) :**
• Cybercriminels → Scénarios de chiffrement/extorsion
• Espions → Scénarios d'exfiltration discrète
• Initiés → Scénarios d'abus de privilèges

**→ Atelier 4 (Scénarios opérationnels) :**
• Motivations financières → Techniques rapides, bruyantes
• Motivations concurrentielles → Techniques furtives, persistantes
• Motivations vengeance → Techniques destructrices, visibles

**→ Atelier 5 (Traitement du risque) :**
• Contre cybercriminels → Mesures préventives + continuité
• Contre espions → Mesures de détection + classification
• Contre initiés → Mesures de contrôle + surveillance

Cette analyse des motivations nous permet maintenant d'évaluer précisément les **capacités** de chaque source.`,
          exercises: [
            {
              id: "mot1",
              question: "Quelle motivation rend les cybercriminels particulièrement dangereux pour les hôpitaux ?",
              type: "multiple_choice",
              options: [
                "Idéologique - ils veulent détruire le système de santé",
                "Financière - la criticité vitale facilite l'extorsion",
                "Politique - ils veulent déstabiliser le gouvernement",
                "Technique - ils veulent tester leurs compétences"
              ],
              correctAnswer: 1,
              explanation: "La motivation financière combinée à la criticité vitale des hôpitaux crée une situation d'extorsion parfaite : les vies en jeu forcent un paiement rapide de rançons élevées.",
              points: 20
            },
            {
              id: "mot2",
              question: "Cas pratique : Un chercheur du CHU vient d'être licencié après 15 ans de service. Analysez le risque d'initié malveillant et les cibles potentielles :",
              type: "open_text",
              explanation: "Réponse attendue : Risque élevé de vengeance, accès encore actif pendant préavis, connaissance intime des systèmes de recherche, cibles = serveurs recherche, données d'essais, communications. Mesures = révocation immédiate des accès, surveillance renforcée.",
              points: 30
            }
          ],
          completed: false
        },
        {
          id: "w2-capabilities-assessment",
          title: "4. Évaluation des capacités techniques",
          description: "Évaluez les capacités techniques et ressources de chaque source de risque",
          type: "exercise",
          duration: 25,
          content: `⚡ **ÉVALUATION DES CAPACITÉS TECHNIQUES**

**📚 MÉTHODOLOGIE EBIOS RM :**
Les **capacités** d'une source de risque déterminent :
• **Quelles attaques** elle peut réaliser
• **Quelles défenses** elle peut contourner
• **Quelle persistance** elle peut maintenir
• **Quel niveau de sophistication** elle atteint

**🏥 CAPACITÉS PAR SOURCE DE RISQUE :**

**1. 💰 CYBERCRIMINELS SPÉCIALISÉS SANTÉ**

**Niveau : TRÈS ÉLEVÉ (9/10)**

**Capacités techniques :**
• **Exploits 0-day** : Vulnérabilités inconnues, non patchées
• **Ransomware avancé** : Chiffrement militaire, anti-forensique
• **Techniques d'évasion** : Contournement EDR, sandboxes
• **Living off the land** : Utilisation d'outils légitimes

**Ressources organisationnelles :**
• **Équipes spécialisées** : Développeurs, testeurs, négociateurs
• **Infrastructure dédiée** : Serveurs C&C, bulletproof hosting
• **Veille technologique** : Adaptation rapide aux défenses
• **Support 24h/24** : Négociation, support technique

**Outils et techniques :**
• **Frameworks d'attaque** : Cobalt Strike, Metasploit Pro
• **Malwares sur mesure** : Adaptés aux environnements santé
• **Cryptomonnaies** : Bitcoin, Monero, mixers
• **Réseaux anonymes** : Tor, VPN en cascade

**Exemples concrets :**
• **Conti** : Chiffrement en 32 minutes, 400+ victimes
• **LockBit** : Exfiltration 100GB en 2h, double extorsion
• **BlackCat** : Rust-based, multi-plateforme, API REST

**Limitations :**
• **Bruit opérationnel** : Attaques détectables
• **Motivation financière** : Évitent destruction totale
• **Pression temporelle** : Veulent paiement rapide

**2. 🕵️ ESPIONS INDUSTRIELS PHARMACEUTIQUES**

**Niveau : ÉLEVÉ (7/10)**

**Capacités techniques :**
• **APT sophistiquées** : Persistance longue durée
• **Techniques furtives** : Évitement de détection
• **Exfiltration discrète** : Petits volumes, chiffrés
• **Ingénierie sociale** : Manipulation psychologique

**Ressources organisationnelles :**
• **Budgets R&D détournés** : Millions d'euros disponibles
• **Équipes mixtes** : Techniques + humaines
• **Patience stratégique** : Campagnes multi-années
• **Couverture légale** : Sociétés écrans, consultants

**Outils et techniques :**
• **Malwares discrets** : RAT, keyloggers, backdoors
• **Phishing ciblé** : Spear-phishing chercheurs
• **Compromission supply chain** : Logiciels métier
• **OSINT avancé** : Reconnaissance passive

**Exemples concrets :**
• **APT1 (Comment Crew)** : Vol PI pharmaceutique
• **Lazarus** : Ciblage laboratoires COVID-19
• **Carbanak** : Techniques bancaires adaptées santé

**Limitations :**
• **Discrétion obligatoire** : Évitent la détection
• **Cibles spécifiques** : Seulement données R&D
• **Ressources limitées** : Moins que cybercriminels

**3. 😈 INITIÉS MALVEILLANTS**

**Niveau : VARIABLE (3-8/10)**

**Capacités selon profil :**

**Administrateur IT mécontent (8/10) :**
• **Accès privilégié** : Droits administrateur
• **Connaissance intime** : Architecture, vulnérabilités
• **Outils légitimes** : PowerShell, WMI, scripts
• **Contournement contrôles** : Désactivation logs, alertes

**Médecin corrompu (4/10) :**
• **Accès données** : Dossiers patients, recherche
• **Légitimité** : Actions normales difficiles à détecter
• **Limitations techniques** : Compétences IT basiques
• **Volumes limités** : Exfiltration manuelle

**Technicien maintenance (6/10) :**
• **Accès physique** : Serveurs, équipements réseau
• **Outils techniques** : Logiciels de diagnostic
• **Horaires décalés** : Nuits, week-ends
• **Traçabilité réduite** : Interventions légitimes

**Ressources disponibles :**
• **Accès légitime** : Pas de contournement nécessaire
• **Confiance établie** : Suspicion réduite
• **Connaissance procédures** : Évitement des contrôles
• **Timing optimal** : Moments de faible surveillance

**Limitations :**
• **Traçabilité** : Actions liées à l'identité
• **Compétences variables** : Selon le profil
• **Accès limité** : Selon les habilitations
• **Détection comportementale** : Changements suspects

**📊 MATRICE COMPARATIVE DES CAPACITÉS :**

| Capacité | Cybercriminels | Espions industriels | Initiés malveillants |
|----------|----------------|---------------------|---------------------|
| **Techniques** | 9/10 | 7/10 | 3-8/10 |
| **Ressources** | 9/10 | 6/10 | 2-7/10 |
| **Persistance** | 6/10 | 9/10 | 8/10 |
| **Discrétion** | 4/10 | 9/10 | 7/10 |
| **Rapidité** | 9/10 | 3/10 | 6/10 |
| **Adaptation** | 8/10 | 7/10 | 4/10 |

**🎯 IMPLICATIONS POUR LA DÉFENSE :**

**Contre cybercriminels :**
• **Détection rapide** : EDR, SIEM temps réel
• **Sauvegarde isolée** : Air-gapped, immutable
• **Formation intensive** : Anti-phishing, social engineering
• **Plan de continuité** : Procédures dégradées

**Contre espions industriels :**
• **Classification données** : Niveaux de sensibilité
• **DLP avancé** : Détection exfiltration
• **Surveillance comportementale** : Anomalies d'accès
• **Chiffrement bout-en-bout** : Protection en transit/repos

**Contre initiés malveillants :**
• **Principe moindre privilège** : Accès minimal nécessaire
• **Surveillance privilégiée** : Monitoring comptes admin
• **Séparation des tâches** : Validation croisée
• **Révocation automatique** : Départs, mutations

Cette évaluation des capacités nous permet maintenant de déterminer la **pertinence** finale de chaque source.`,
          exercises: [
            {
              id: "cap1",
              question: "Quelle capacité rend les espions industriels particulièrement difficiles à détecter ?",
              type: "multiple_choice",
              options: [
                "Leurs techniques d'attaque très sophistiquées",
                "Leurs ressources financières importantes",
                "Leur capacité de persistance et discrétion",
                "Leur rapidité d'exécution"
              ],
              correctAnswer: 2,
              explanation: "Les espions industriels privilégient la persistance (campagnes multi-années) et la discrétion absolue pour éviter la détection, contrairement aux cybercriminels qui sont plus bruyants.",
              points: 20
            },
            {
              id: "cap2",
              question: "Analysez pourquoi un administrateur IT mécontent représente un risque de capacité élevée pour le CHU :",
              type: "open_text",
              explanation: "Réponse attendue : Accès privilégié légitime, connaissance intime de l'architecture, capacité à désactiver les contrôles de sécurité, utilisation d'outils légitimes difficiles à détecter, timing optimal (horaires décalés).",
              points: 25
            }
          ],
          completed: false
        },
        {
          id: "w2-pertinence-matrix",
          title: "5. Matrice de pertinence et priorisation",
          description: "Établissez la matrice de pertinence finale et priorisez les sources pour les ateliers suivants",
          type: "validation",
          duration: 20,
          content: `📊 **MATRICE DE PERTINENCE FINALE**

**📚 MÉTHODOLOGIE EBIOS RM :**
La **pertinence** d'une source de risque se calcule en croisant :
• **Motivations** : Intérêt pour les biens du CHU
• **Capacités** : Aptitude à réaliser les attaques
• **Opportunités** : Vulnérabilités exploitables
• **Vraisemblance** : Probabilité de passage à l'acte

**🏥 MATRICE DE PERTINENCE CHU MÉTROPOLITAIN :**

**📋 GRILLE D'ÉVALUATION :**

**Critères de notation (1-5) :**
• **Motivation** : 1=Aucune, 5=Très forte
• **Capacités** : 1=Faibles, 5=Très élevées
• **Opportunités** : 1=Limitées, 5=Nombreuses
• **Vraisemblance** : 1=Improbable, 5=Très probable

**📊 ÉVALUATION DÉTAILLÉE :**

**1. 💰 CYBERCRIMINELS SPÉCIALISÉS SANTÉ**
• **Motivation** : 5/5 (Financière très forte)
  - Budget CHU 450M€ = capacité paiement
  - Criticité vitale = pression maximale
  - Données sensibles = valeur marché noir
• **Capacités** : 5/5 (Très élevées)
  - Techniques 0-day, ransomware avancé
  - Équipes spécialisées, infrastructure dédiée
  - Adaptation rapide aux défenses
• **Opportunités** : 5/5 (Nombreuses)
  - Pas de MFA = attaques force brute
  - Pas d'EDR = malwares indétectables
  - Formation limitée = phishing efficace
• **Vraisemblance** : 5/5 (Très probable)
  - Secteur santé ciblé massivement
  - Vulnérabilités connues publiquement
  - ROI élevé pour les attaquants

**SCORE TOTAL : 20/20 - PERTINENCE MAXIMALE ⭐⭐⭐⭐⭐**

**2. 🕵️ ESPIONS INDUSTRIELS PHARMACEUTIQUES**
• **Motivation** : 4/5 (Forte)
  - Recherche clinique active
  - Biobanque précieuse
  - Partenariats industriels
• **Capacités** : 4/5 (Élevées)
  - APT sophistiquées
  - Techniques furtives
  - Ressources importantes
• **Opportunités** : 3/5 (Moyennes)
  - Segmentation recherche limitée
  - Accès chercheurs non contrôlé
  - Mais données moins accessibles
• **Vraisemblance** : 3/5 (Moyenne)
  - CHU non leader mondial
  - Effort/bénéfice modéré
  - Cibles plus attractives ailleurs

**SCORE TOTAL : 14/20 - PERTINENCE ÉLEVÉE ⭐⭐⭐⭐**

**3. 😈 INITIÉS MALVEILLANTS**
• **Motivation** : 3/5 (Variable)
  - Stress professionnel élevé
  - Conditions de travail difficiles
  - Mais pas systématique
• **Capacités** : 4/5 (Variables mais accès privilégié)
  - Accès légitime aux systèmes
  - Contournement des contrôles
  - Connaissance intime
• **Opportunités** : 5/5 (Maximales)
  - 3500 employés = surface importante
  - Contrôles internes limités
  - Surveillance réduite
• **Vraisemblance** : 4/5 (Probable)
  - Statistiques secteur santé
  - Facteurs de stress présents
  - Contrôles insuffisants

**SCORE TOTAL : 16/20 - PERTINENCE ÉLEVÉE ⭐⭐⭐⭐**

**4. 🏴‍☠️ HACKTIVISTES SANTÉ**
• **Motivation** : 2/5 (Faible à moyenne)
  - Hôpital public = cible idéologique
  - Mais pas de controverse majeure
  - Impact médiatique limité
• **Capacités** : 2/5 (Moyennes)
  - Compétences variables
  - Ressources limitées
  - Outils basiques
• **Opportunités** : 4/5 (Élevées)
  - Vulnérabilités connues
  - Défenses limitées
  - Visibilité publique
• **Vraisemblance** : 2/5 (Faible)
  - Pas de controverse actuelle
  - Cibles plus attractives
  - Effort/impact défavorable

**SCORE TOTAL : 10/20 - PERTINENCE MOYENNE ⭐⭐⭐**

**5. 🌍 ÉTATS HOSTILES (APT)**
• **Motivation** : 2/5 (Faible)
  - CHU non stratégique national
  - Données limitées d'intérêt
  - Effort/bénéfice défavorable
• **Capacités** : 5/5 (Très élevées)
  - Techniques militaires
  - Ressources illimitées
  - Sophistication maximale
• **Opportunités** : 3/5 (Moyennes)
  - Vulnérabilités exploitables
  - Mais défenses étatiques possibles
  - Risque géopolitique
• **Vraisemblance** : 1/5 (Très faible)
  - Pas d'intérêt stratégique
  - Cibles prioritaires ailleurs
  - Risque diplomatique

**SCORE TOTAL : 11/20 - PERTINENCE MOYENNE ⭐⭐⭐**

**🎯 PRIORISATION FINALE POUR LES ATELIERS SUIVANTS :**

**PRIORITÉ 1 - CYBERCRIMINELS SPÉCIALISÉS SANTÉ (20/20)**
• **Justification** : Menace la plus probable et impactante
• **Focus Atelier 3** : Scénarios de ransomware et extorsion
• **Focus Atelier 4** : Modes opératoires de chiffrement rapide
• **Focus Atelier 5** : Mesures anti-ransomware prioritaires

**PRIORITÉ 2 - INITIÉS MALVEILLANTS (16/20)**
• **Justification** : Accès privilégié, difficiles à détecter
• **Focus Atelier 3** : Scénarios d'abus de privilèges
• **Focus Atelier 4** : Techniques d'exfiltration interne
• **Focus Atelier 5** : Contrôles internes et surveillance

**PRIORITÉ 3 - ESPIONS INDUSTRIELS (14/20)**
• **Justification** : Menace sophistiquée sur la recherche
• **Focus Atelier 3** : Scénarios d'espionnage discret
• **Focus Atelier 4** : Techniques APT et persistance
• **Focus Atelier 5** : Protection propriété intellectuelle

**Sources secondaires (surveillance) :**
• Hacktivistes (10/20) - Surveillance événements
• États hostiles (11/20) - Veille géopolitique

**📋 LIVRABLES POUR L'ATELIER 3 :**

1. **Top 3 sources prioritaires** avec scores détaillés
2. **Motivations spécifiques** par source
3. **Capacités techniques** évaluées
4. **Opportunités identifiées** dans le CHU
5. **Matrice de pertinence** complète

Ces éléments alimenteront directement la construction des **scénarios stratégiques** dans l'Atelier 3.

**🔗 LIENS MÉTHODOLOGIQUES DÉTAILLÉS :**

**→ VERS ATELIER 3 - SCÉNARIOS STRATÉGIQUES :**

**🥇 Cybercriminels spécialisés santé (Priorité 1) :**
• **Scénarios générés** : "Ransomware SIH", "Double extorsion données patients"
• **Combinaisons** : Cybercriminel × Urgences vitales = Pression maximale
• **Chemins d'attaque** : Phishing → Escalade → Propagation → Chiffrement
• **Vraisemblance** : 80% (score 20/20 × facteur secteur)

**🥈 Initiés malveillants (Priorité 2) :**
• **Scénarios générés** : "Abus privilèges admin", "Exfiltration données VIP"
• **Combinaisons** : Initié × Données patients = Accès privilégié légitime
• **Chemins d'attaque** : Accès légitime → Contournement logs → Exfiltration
• **Vraisemblance** : 60% (score 16/20 × facteur interne)

**🥉 Espions industriels (Priorité 3) :**
• **Scénarios générés** : "Exfiltration recherche", "Espionnage biobanque"
• **Combinaisons** : Espion × Recherche clinique = Propriété intellectuelle
• **Chemins d'attaque** : Spear-phishing → Backdoor → Persistance → Exfiltration
• **Vraisemblance** : 50% (score 14/20 × facteur sophistication)

**→ VERS ATELIER 4 - SCÉNARIOS OPÉRATIONNELS :**

**🥇 Cybercriminels → Modes opératoires détaillés :**
• **Techniques attendues** : Exploits 0-day, ransomware avancé, techniques d'évasion
• **Vecteurs prioritaires** : Email phishing, exploitation VPN, propagation latérale
• **Sophistication** : 7/10 (très élevée, outils professionnels)
• **Détail technique** : Chiffrement AES-256, C&C chiffrés, anti-forensique

**🥈 Initiés → Modes opératoires spécifiques :**
• **Techniques attendues** : Abus privilèges, contournement logs, outils légitimes
• **Vecteurs prioritaires** : Comptes administrateurs, accès physique, horaires décalés
• **Sophistication** : 5/10 (variable selon profil, mais accès privilégié)
• **Détail technique** : PowerShell, WMI, désactivation alertes

**🥉 Espions → Modes opératoires furtifs :**
• **Techniques attendues** : APT persistantes, exfiltration discrète, living off the land
• **Vecteurs prioritaires** : Spear-phishing chercheurs, compromission supply chain
• **Sophistication** : 9/10 (très élevée, techniques militaires)
• **Détail technique** : Backdoors custom, chiffrement bout-en-bout, anti-détection

**→ VERS ATELIER 5 - TRAITEMENT DU RISQUE :**

**🥇 Contre Cybercriminels (Priorité 1) :**
• **Mesures préventives** : MFA obligatoire, EDR avancé, formation anti-phishing
• **Mesures détection** : SIEM temps réel, honeypots, analyse comportementale
• **Mesures réponse** : Plan de continuité, sauvegardes isolées, cellule de crise
• **Budget prioritaire** : 60% des investissements sécurité

**🥈 Contre Initiés (Priorité 2) :**
• **Mesures préventives** : Principe moindre privilège, séparation tâches, contrôles croisés
• **Mesures détection** : Surveillance privilégiée, analyse anomalies, DLP
• **Mesures réponse** : Révocation automatique, investigation forensique
• **Budget prioritaire** : 25% des investissements sécurité

**🥉 Contre Espions (Priorité 3) :**
• **Mesures préventives** : Classification données, chiffrement bout-en-bout, VPN renforcé
• **Mesures détection** : Détection APT, analyse trafic, threat hunting
• **Mesures réponse** : Isolation systèmes, contre-espionnage, juridique
• **Budget prioritaire** : 15% des investissements sécurité

**✅ ATELIER 2 TERMINÉ - LIENS EXPLICITES ÉTABLIS POUR LA SUITE !**

**🎯 LIVRABLES TRANSMIS AUX ATELIERS SUIVANTS :**
1. **Top 3 sources prioritaires** avec scores et justifications
2. **Scénarios stratégiques prévisionnels** par source
3. **Modes opératoires attendus** selon les capacités
4. **Mesures de traitement priorisées** selon la pertinence
5. **Matrice de vraisemblance** pour l'Atelier 3
6. **Niveaux de sophistication** pour l'Atelier 4
7. **Budget sécurité réparti** pour l'Atelier 5`,
          exercises: [
            {
              id: "pert1",
              question: "Pourquoi les cybercriminels spécialisés santé obtiennent-ils le score de pertinence maximal (20/20) ?",
              type: "multiple_choice",
              options: [
                "Uniquement à cause de leurs capacités techniques très élevées",
                "Parce qu'ils combinent motivation maximale, capacités élevées et opportunités nombreuses",
                "Seulement parce que le CHU a beaucoup de vulnérabilités",
                "Car ils sont les seuls à cibler spécifiquement les hôpitaux"
              ],
              correctAnswer: 1,
              explanation: "Les cybercriminels obtiennent 5/5 sur tous les critères : motivation financière maximale (CHU riche + criticité vitale), capacités très élevées (techniques avancées), opportunités nombreuses (vulnérabilités CHU) et vraisemblance très forte (secteur ciblé massivement).",
              points: 25
            },
            {
              id: "pert2",
              question: "Établissez la priorisation des mesures de sécurité selon la matrice de pertinence des sources :",
              type: "open_text",
              explanation: "Réponse attendue : 1-Mesures anti-ransomware (cybercriminels), 2-Contrôles internes (initiés), 3-Protection R&D (espions), 4-Surveillance événements (hacktivistes), 5-Veille géopolitique (États).",
              points: 30
            }
          ],
          practicalExercises: [
            {
              id: "hte_001_threat_landscape",
              title: "🌐 Analyse du paysage des menaces secteur santé",
              description: "Exercice pratique spécialisé sur l'écosystème de menaces hospitalier",
              difficulty: "intermediate",
              duration: 15,
              category: "threat_landscape"
            },
            {
              id: "hte_002_healthcare_sources",
              title: "🎯 Sources de risques spécialisées secteur santé",
              description: "Identification des groupes cybercriminels et APT ciblant la santé",
              difficulty: "advanced",
              duration: 20,
              category: "source_identification"
            },
            {
              id: "hte_003_healthcare_motivations",
              title: "🧠 Motivations spécifiques au secteur santé",
              description: "Analyse approfondie des motivations secteur hospitalier",
              difficulty: "expert",
              duration: 25,
              category: "motivation_analysis"
            },
            {
              id: "hte_004_chu_case_study",
              title: "🏥 Cas pratique : Cyberattaque du CHU Métropolitain",
              description: "Analyse complète d'un scénario d'attaque réaliste",
              difficulty: "expert",
              duration: 30,
              category: "case_study"
            },
            {
              id: "hte_005_capability_assessment",
              title: "⚡ Évaluation des capacités - Sources spécialisées santé",
              description: "Évaluation comparative des capacités techniques secteur santé",
              difficulty: "expert",
              duration: 20,
              category: "capability_assessment"
            }
          ],
          completed: false
        }
      ],
      prerequisites: ["Atelier 1 complété avec score ≥ 70%"],
      anssiCompliance: ["Guide menaces ANSSI", "Panorama de la cybermenace", "Bulletin d'alerte CERT-FR"],
      realWorldExamples: [
        "Groupe APT29 vs secteur santé",
        "Ransomware Ryuk hôpitaux US",
        "Espionnage données recherche COVID"
      ],
      status: 'locked',
      completionRate: 0,
      score: 0
    },
    {
      id: 3,
      title: "Atelier 3 - Scénarios stratégiques",
      subtitle: "Élaboration des chemins d'attaque",
      description: "Construisez les scénarios stratégiques en combinant sources de risques et biens supports pour identifier les chemins d'attaque.",
      icon: Users,
      duration: 100,
      objectives: [
        "Combiner sources de risques et biens supports",
        "Élaborer des scénarios stratégiques réalistes",
        "Évaluer la vraisemblance des scénarios",
        "Identifier les chemins d'attaque critiques",
        "Prioriser les scénarios selon l'impact"
      ],
      deliverables: [
        "Matrice scénarios stratégiques",
        "Évaluation de vraisemblance",
        "Cartographie des chemins d'attaque",
        "Analyse d'impact",
        "Priorisation des scénarios"
      ],
      steps: [
        {
          id: "w3-methodology",
          title: "1. Méthodologie scénarios stratégiques",
          description: "Maîtrisez la méthodologie EBIOS RM pour construire des scénarios stratégiques cohérents",
          type: "theory",
          duration: 20,
          content: `🎯 **MÉTHODOLOGIE SCÉNARIOS STRATÉGIQUES EBIOS RM**

**📚 DÉFINITION OFFICIELLE ANSSI :**
Un scénario stratégique décrit **comment** une source de risque peut atteindre un bien essentiel pour provoquer un événement redouté. Il combine trois éléments fondamentaux :
• **QUI** : Source de risque (acteur malveillant)
• **QUOI** : Bien essentiel (cible de l'attaque)
• **POURQUOI** : Événement redouté (conséquence finale)

**🔗 COMPOSANTS ESSENTIELS D'UN SCÉNARIO STRATÉGIQUE :**

**1. 🎭 SOURCE DE RISQUE (Acteur)**
\`\`\`
Définition : Entité malveillante capable et motivée
Exemples CHU :
• Cybercriminel spécialisé santé (Conti, LockBit)
• Espion industriel pharmaceutique
• Administrateur IT mécontent
• Médecin corrompu

Caractéristiques à considérer :
• Motivations (financière, concurrentielle, vengeance)
• Capacités techniques (exploits, malwares, persistance)
• Ressources (budget, équipes, infrastructure)
• Contraintes (éthique, géopolitique, légales)
\`\`\`

**2. 🎯 BIEN ESSENTIEL (Cible)**
\`\`\`
Définition : Élément critique pour les missions du CHU
Exemples CHU Métropolitain :
• Urgences vitales (service critique 24h/24)
• Données patients (50 000 dossiers sensibles)
• Recherche clinique (propriété intellectuelle)
• Bloc opératoire (interventions vitales)

Critères de sélection :
• Criticité pour les missions (CRITIQUE/MAJEUR/MINEUR)
• Attractivité pour la source (valeur, accessibilité)
• Impact potentiel (vies, finances, réputation)
• Vulnérabilité (exposition, protection)
\`\`\`

**3. ⚠️ ÉVÉNEMENT REDOUTÉ (Conséquence)**
\`\`\`
Définition : Impact négatif sur le bien essentiel
Exemples CHU :
• Arrêt des urgences vitales (vies en danger)
• Fuite massive de données patients (RGPD)
• Sabotage de la recherche clinique (PI)
• Paralysie du système d'information (continuité)

Caractérisation :
• Nature (confidentialité, intégrité, disponibilité)
• Gravité (CRITIQUE/MAJEUR/MINEUR selon ANSSI)
• Durée (temporaire, prolongée, permanente)
• Périmètre (local, global, cascade)
\`\`\`

**🎨 DIFFÉRENCE STRATÉGIQUE vs OPÉRATIONNEL :**

**📊 NIVEAU STRATÉGIQUE (Atelier 3) :**
\`\`\`
Vision : MACRO - Vue d'ensemble
Focus : QUI attaque QUOI pour obtenir QUOI
Détail : Faible - Grandes lignes
Horizon : Long terme - Tendances
Public : Direction, COMEX, RSSI
Objectif : Priorisation des risques

Exemple : "Un cybercriminel spécialisé santé compromet
le SIH pour paralyser les urgences et extorquer une rançon"
\`\`\`

**⚙️ NIVEAU OPÉRATIONNEL (Atelier 4) :**
\`\`\`
Vision : MICRO - Détails techniques
Focus : COMMENT l'attaque se déroule concrètement
Détail : Élevé - Étapes précises
Horizon : Court terme - Actions immédiates
Public : Équipes techniques, SOC, CERT
Objectif : Mesures de protection concrètes

Exemple : "Phishing sur Dr.Martin → Backdoor → Escalade
via CVE-2023-XXXX → Propagation VLAN → Ransomware LockBit"
\`\`\`

Cette méthodologie nous permet maintenant de construire des scénarios stratégiques cohérents et réalistes pour le CHU Métropolitain.`,
          completed: false
        },
        {
          id: "w3-scenario-construction",
          title: "2. Construction des scénarios CHU",
          description: "Construisez systématiquement les scénarios stratégiques du CHU Métropolitain",
          type: "exercise",
          duration: 35,
          content: `🏗️ **CONSTRUCTION SYSTÉMATIQUE DES SCÉNARIOS CHU MÉTROPOLITAIN**

**📚 MÉTHODOLOGIE DE CONSTRUCTION :**
Nous allons construire les scénarios stratégiques en combinant systématiquement :
• Les **3 sources prioritaires** identifiées dans l'Atelier 2
• Les **4 biens essentiels** critiques du CHU (Atelier 1)
• Les **4 événements redoutés** définis (Atelier 1)

**🎯 MATRICE DE COMBINAISONS SOURCES × BIENS ESSENTIELS :**

| Source \\\\ Bien | Urgences vitales | Données patients | Recherche clinique | Bloc opératoire |
|----------------|------------------|------------------|-------------------|-----------------|
| **🥇 Cybercriminels** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **🥈 Initiés malveillants** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **🥉 Espions industriels** | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐ |

**Légende pertinence :** ⭐ = Faible | ⭐⭐⭐ = Moyenne | ⭐⭐⭐⭐⭐ = Très élevée

**🏥 SCÉNARIOS STRATÉGIQUES PRIORITAIRES CHU :**

**🥇 SCÉNARIO 1 - "RANSOMWARE SIH URGENCES" (PRIORITÉ MAXIMALE)**

**Composants :**
\`\`\`
🎭 Source : Cybercriminel spécialisé santé (Score 20/20)
• Profil : Groupe Conti Healthcare ou LockBit Medical
• Motivation : Financière (rançon 2-5M€)
• Capacités : Très élevées (exploits 0-day, ransomware avancé)
• Spécialisation : Secteur hospitalier, négociateurs formés

🎯 Bien essentiel : Urgences vitales + SIH principal
• Criticité : CRITIQUE (vies en jeu 24h/24)
• Attractivité : Maximale (pression temporelle énorme)
• Vulnérabilité : Élevée (pas de MFA, EDR absent)
• Impact cascade : Tous les services dépendants

⚠️ Événement redouté : Arrêt urgences + Paralysie SI
• Gravité : CRITIQUE (décès possibles)
• Durée : 3-15 jours (temps restauration)
• Coût : 5-15M€ (rançon + pertes + récupération)
• Impact humain : Transferts patients, retards vitaux
\`\`\`

Cette construction systématique nous permet d'identifier les scénarios les plus critiques pour le CHU.`,
          exercises: [
            {
              id: "sc3",
              question: "Dans le scénario 'Ransomware SIH Urgences', quels livrables de l'Atelier 1 sont utilisés pour justifier la vraisemblance très forte (5/5) ?",
              type: "multiple_select",
              options: [
                "Contexte CHU (budget 450M€) → Attractivité financière maximale",
                "Urgences vitales (CRITIQUE) → Pression temporelle énorme",
                "SIH central → Vecteur d'attaque unique pour paralysie",
                "Événement 'Arrêt urgences' → Objectif aligné avec extorsion",
                "Données patients → Cible secondaire pour double extorsion"
              ],
              correctAnswer: [0, 1, 2, 3],
              explanation: "Le scénario 'Ransomware SIH Urgences' utilise systématiquement 4 livrables de l'Atelier 1 : le contexte CHU (attractivité), les urgences vitales (pression), le SIH (vecteur) et l'événement redouté (objectif). Les données patients ne sont pas utilisées dans ce scénario spécifique.",
              points: 30
            },
            {
              id: "sc4",
              question: "Expliquez comment les livrables de l'Atelier 2 orientent la construction du scénario 'Exfiltration recherche clinique'",
              type: "open_text",
              explanation: "Réponse attendue : Les espions industriels (score 14/20, priorité 3) avec motivation concurrentielle orientent vers la recherche clinique (propriété intellectuelle). Leurs capacités sophistiquées (APT) justifient les techniques d'exfiltration discrète longue durée. La spécialisation PI détermine la vraisemblance moyenne (3/5) car cibles spécialisées.",
              points: 35
            }
          ],
          completed: false
        },
        {
          id: "w3-likelihood-impact",
          title: "3. Évaluation vraisemblance et impact",
          description: "Évaluez la probabilité de réalisation et l'impact des scénarios stratégiques",
          type: "exercise",
          duration: 30,
          content: `📊 **ÉVALUATION VRAISEMBLANCE ET IMPACT DES SCÉNARIOS**

**📚 MÉTHODOLOGIE ANSSI :**
L'évaluation des scénarios stratégiques repose sur deux dimensions :
• **VRAISEMBLANCE** : Probabilité de réalisation (1-5)
• **IMPACT** : Gravité des conséquences (1-4)

**🎯 GRILLE DE VRAISEMBLANCE ANSSI :**

**Échelle 1-5 :**
• **1 - Très faible** : Scénario théorique, jamais observé
• **2 - Faible** : Scénario possible mais peu probable
• **3 - Moyenne** : Scénario plausible, quelques précédents
• **4 - Forte** : Scénario probable, précédents nombreux
• **5 - Très forte** : Scénario quasi-certain, tendance confirmée

**Facteurs d'évaluation vraisemblance :**
\`\`\`
1. Motivation de la source (1-5)
   • Intérêt pour la cible
   • Alignement avec les objectifs
   • Bénéfices attendus

2. Capacités techniques requises (1-5)
   • Sophistication nécessaire
   • Ressources disponibles
   • Expertise technique

3. Opportunités disponibles (1-5)
   • Vulnérabilités exploitables
   • Facilité d'accès
   • Fenêtres temporelles

4. Contraintes opérationnelles (1-5)
   • Obstacles techniques
   • Risques pour l'attaquant
   • Facteurs limitants
\`\`\`

**🎯 GRILLE D'IMPACT ANSSI :**

**Échelle 1-4 :**
• **1 - Mineur** : Gêne limitée, récupération rapide
• **2 - Majeur** : Impact significatif, récupération possible
• **3 - Critique** : Impact grave, récupération difficile
• **4 - Catastrophique** : Impact irréversible, survie menacée

**Dimensions d'évaluation impact :**
\`\`\`
1. Impact humain
   • Vies en danger
   • Santé des patients
   • Sécurité du personnel

2. Impact financier
   • Coûts directs (rançon, réparation)
   • Coûts indirects (perte activité)
   • Coûts long terme (réputation)

3. Impact réputationnel
   • Confiance des patients
   • Image publique
   • Relations partenaires

4. Impact réglementaire
   • Amendes RGPD
   • Sanctions ANSSI
   • Responsabilité pénale
\`\`\`

Cette évaluation rigoureuse permet de prioriser les scénarios selon leur niveau de risque.`,
          completed: false
        },
        {
          id: "w3-risk-mapping",
          title: "4. Cartographie et visualisation",
          description: "Créez la cartographie des risques et visualisez les scénarios prioritaires",
          type: "validation",
          duration: 25,
          content: `🗺️ **CARTOGRAPHIE DES RISQUES ET VISUALISATION**

**📚 OBJECTIF :**
Représenter graphiquement les scénarios selon leur vraisemblance et impact pour faciliter la prise de décision et la communication avec la direction.

**📊 MATRICE VRAISEMBLANCE × IMPACT :**

\`\`\`
IMPACT
  4 |     |     |  🔴 |  🔴 | Catastrophique
    |     |     | ÉLEVÉ|CRITIQUE|
  3 |     |  🟡 |  🔴 |  🔴 | Critique
    |     |MODÉRÉ|ÉLEVÉ|CRITIQUE|
  2 |  🟢 |  🟡 |  🟡 |  🔴 | Majeur
    |FAIBLE|MODÉRÉ|MODÉRÉ|ÉLEVÉ|
  1 |  🟢 |  🟢 |  🟡 |  🟡 | Mineur
    |FAIBLE|FAIBLE|MODÉRÉ|MODÉRÉ|
    +-----+-----+-----+-----+
      1     2     3     4     5
                VRAISEMBLANCE
\`\`\`

**🎯 POSITIONNEMENT DES SCÉNARIOS CHU :**

**🔴 ZONE CRITIQUE (Action immédiate requise) :**
• **Scénario 1** : Ransomware SIH Urgences (V:5, I:4)
• **Scénario 3** : Abus privilèges administrateur (V:4, I:3)

**🟡 ZONE ÉLEVÉE (Action prioritaire) :**
• **Scénario 2** : Exfiltration recherche clinique (V:3, I:3)
• **Scénario 4** : Double extorsion données (V:4, I:2)

**🟢 ZONE MODÉRÉE (Surveillance) :**
• **Scénario 5** : Espionnage biobanque (V:2, I:2)
• **Scénario 6** : Sabotage bloc opératoire (V:2, I:3)

Cette cartographie guide la priorisation des investissements sécurité et la préparation de l'Atelier 4.`,
          exercises: [
            {
              id: "sc5",
              question: "Dans la cartographie des risques, pourquoi le scénario 'Ransomware SIH Urgences' est-il positionné en zone CRITIQUE ?",
              type: "multiple_choice",
              options: [
                "Uniquement à cause de sa vraisemblance très forte (5/5)",
                "Uniquement à cause de son impact catastrophique (4/4)",
                "À cause de la combinaison vraisemblance très forte (5/5) ET impact catastrophique (4/4)",
                "À cause du niveau de sophistication technique requis"
              ],
              correctAnswer: 2,
              explanation: "Le niveau de risque CRITIQUE résulte de la combinaison Vraisemblance (5/5) × Impact (4/4). La vraisemblance très forte s'explique par la spécialisation des cybercriminels et l'attractivité du CHU. L'impact catastrophique découle des vies en jeu et de la paralysie du SIH.",
              points: 25
            },
            {
              id: "sc6",
              question: "Expliquez comment la matrice Vraisemblance × Impact guide la priorisation pour les ateliers suivants",
              type: "open_text",
              explanation: "Réponse attendue : La matrice positionne les scénarios en zones (CRITIQUE/ÉLEVÉ/MODÉRÉ) qui déterminent la priorisation pour l'Atelier 4 (modes opératoires détaillés pour les scénarios critiques d'abord) et l'Atelier 5 (allocation budgétaire proportionnelle : 60% pour ransomware CRITIQUE, 25% pour abus privilèges ÉLEVÉ).",
              points: 30
            }
          ],
          completed: false
        },
        {
          id: "w3-validation-links",
          title: "5. Validation et liens vers Atelier 4",
          description: "Validez la cohérence des scénarios et préparez les livrables pour l'Atelier 4",
          type: "validation",
          duration: 10,
          content: `✅ **VALIDATION ET PRÉPARATION ATELIER 4**

**📋 VALIDATION DE COHÉRENCE :**

**Critères de validation :**
1. **Logique Source → Bien** : La source a-t-elle intérêt à cibler ce bien ?
2. **Logique Bien → Événement** : Le bien peut-il subir cet événement ?
3. **Logique Source → Événement** : L'événement sert-il les motivations ?
4. **Faisabilité technique** : La source a-t-elle les capacités requises ?
5. **Cohérence temporelle** : Le timing est-il réaliste ?

**📤 LIVRABLES TRANSMIS À L'ATELIER 4 :**

**Top 3 scénarios stratégiques sélectionnés :**
1. **🥇 Ransomware SIH Urgences** → Mode opératoire détaillé
2. **🥈 Abus privilèges administrateur** → Techniques d'abus
3. **🥉 Exfiltration recherche clinique** → Méthodes APT

**Données de contexte :**
• Motivations spécifiques par source
• Capacités techniques évaluées
• Vulnérabilités CHU exploitables
• Contraintes opérationnelles

**🔗 PRÉPARATION ATELIER 4 :**
Les scénarios stratégiques validés serviront de base pour construire les modes opératoires techniques détaillés dans l'Atelier 4.

**📤 LIENS EXPLICITES VERS ATELIERS SUIVANTS :**

**🔗 VERS ATELIER 4 - SCÉNARIOS OPÉRATIONNELS :**

**🥇 Scénario "Ransomware SIH Urgences" → Mode opératoire détaillé :**
\`\`\`
Transmission vers A4 :
• Mode opératoire : Phishing → Escalade → Propagation → Chiffrement
• Techniques : Exploits 0-day, ransomware avancé, évasion EDR
• Vecteurs : Email médecin, VPN, propagation latérale
• Timeline : 72h reconnaissance → 6h impact
• Sophistication : 9/10 | Détection : 8/10

Livrables transmis :
✅ Phases d'attaque détaillées (7 étapes)
✅ Techniques par phase (MITRE ATT&CK)
✅ Outils utilisés (Cobalt Strike, Mimikatz, etc.)
✅ Indicateurs de compromission (IOCs)
✅ Vulnérabilités exploitées (CVE spécifiques)
\`\`\`

**🥈 Scénario "Abus privilèges administrateur" → Techniques d'abus :**
\`\`\`
Transmission vers A4 :
• Mode opératoire : Accès légitime → Contournement → Abus
• Techniques : Outils admin natifs, contournement logs
• Vecteurs : Accès direct, horaires décalés
• Timeline : Action immédiate possible
• Sophistication : 4/10 | Détection : 7/10

Livrables transmis :
✅ Techniques de contournement sécurités
✅ Outils d'administration détournés
✅ Méthodes d'exfiltration discrètes
✅ Indicateurs comportementaux
✅ Fenêtres temporelles d'action
\`\`\`

**🔗 VERS ATELIER 5 - TRAITEMENT DU RISQUE :**

**🥇 Scénario "Ransomware SIH" → Mesures prioritaires (60% budget) :**
\`\`\`
Transmission vers A5 :
• Niveau risque : CRITIQUE (priorité 1)
• Budget alloué : 750k€ (60% budget sécurité total)
• Timeline : 12 mois implémentation
• ROI sécurité : Très élevé

Mesures transmises :
✅ Préventives : MFA généralisé (150k€) + Formation (50k€)
✅ Détection : EDR avancé IA (300k€) + SIEM renforcé (50k€)
✅ Réponse : Plan incident (100k€) + Équipe dédiée (50k€)
✅ Récupération : Sauvegardes air-gap (200k€)
\`\`\`

**🥈 Scénario "Abus privilèges" → Mesures ciblées (25% budget) :**
\`\`\`
Transmission vers A5 :
• Niveau risque : ÉLEVÉ (priorité 2)
• Budget alloué : 450k€ (25% budget sécurité total)
• Timeline : 8 mois implémentation
• ROI sécurité : Élevé

Mesures transmises :
✅ Préventives : PAM solution (200k€) + DLP (100k€)
✅ Détection : UEBA monitoring (150k€)
✅ Gouvernance : Ségrégation tâches + Contrôles 4 yeux
✅ Surveillance : Monitoring comportemental 24h/24
\`\`\`

**📊 SYNTHÈSE DES TRANSMISSIONS :**

**Vers Atelier 4 :**
• 3 scénarios stratégiques → 3 modes opératoires détaillés
• Sophistication moyenne : 6.3/10
• Techniques MITRE ATT&CK mappées
• Timeline d'attaque précisées

**Vers Atelier 5 :**
• Budget total : 1.2M€ répartis selon priorités
• 7 mesures de traitement majeures
• Timeline implémentation : 12 mois
• KPIs de suivi définis`,
          exercises: [
            {
              id: "sc7",
              question: "Pourquoi le scénario 'Ransomware SIH Urgences' reçoit-il 60% du budget sécurité dans l'Atelier 5 ?",
              type: "multiple_select",
              options: [
                "Niveau de risque CRITIQUE (vraisemblance 5/5 × impact 4/4)",
                "Priorité 1 dans la matrice de priorisation",
                "Impact vital (vies en jeu) nécessitant protection maximale",
                "Coût des mesures techniques (EDR, sauvegardes) élevé",
                "ROI sécurité très élevé pour ce type de menace"
              ],
              correctAnswer: [0, 1, 2, 4],
              explanation: "L'allocation de 60% du budget se justifie par : le niveau CRITIQUE (V×I maximal), la priorité 1, l'impact vital et le ROI sécurité très élevé. Le coût technique n'est pas le facteur déterminant - c'est la criticité du risque qui guide l'allocation budgétaire.",
              points: 30
            },
            {
              id: "sc8",
              question: "Décrivez comment les liens vers l'Atelier 4 transforment les scénarios stratégiques en modes opératoires",
              type: "open_text",
              explanation: "Réponse attendue : Les scénarios stratégiques (vision MACRO) sont décomposés en modes opératoires détaillés (vision MICRO) avec : phases d'attaque précises, techniques MITRE ATT&CK mappées, outils spécifiques, timeline détaillée, indicateurs de compromission, vulnérabilités exploitées. Le niveau de sophistication guide la complexité des techniques.",
              points: 35
            }
          ],
          completed: false
        }
      ],
      prerequisites: ["Atelier 2 complété avec score ≥ 70%"],
      anssiCompliance: ["Méthode EBIOS RM", "Guide scénarios ANSSI", "Référentiel analyse de risques"],
      realWorldExamples: [
        "Scénario phishing ciblé CHU",
        "Compromission fournisseur médical",
        "Attaque supply chain dispositifs IoMT"
      ],
      status: 'locked',
      completionRate: 0,
      score: 0
    },
    {
      id: 4,
      title: "Atelier 4 - Scénarios opérationnels",
      subtitle: "Modes opératoires techniques détaillés",
      description: "Transformez les scénarios stratégiques en modes opératoires techniques précis avec mapping MITRE ATT&CK et IOCs.",
      icon: Route,
      duration: 130,
      objectives: [
        "Maîtriser la décomposition technique des attaques",
        "Mapper les techniques selon MITRE ATT&CK",
        "Identifier les indicateurs de compromission (IOCs)",
        "Évaluer la gravité selon les critères ANSSI",
        "Concevoir les mesures de détection adaptées"
      ],
      deliverables: [
        "Modes opératoires techniques détaillés",
        "Mapping MITRE ATT&CK complet",
        "Indicateurs de compromission (IOCs)",
        "Évaluation de gravité ANSSI",
        "Mesures de détection recommandées"
      ],
      steps: [
        {
          id: "w4-methodology",
          title: "1. Méthodologie modes opératoires",
          description: "Maîtrisez la méthodologie EBIOS RM pour décomposer les scénarios en modes opératoires techniques",
          type: "theory",
          duration: 25,
          content: `⚙️ **MÉTHODOLOGIE MODES OPÉRATOIRES EBIOS RM**

**📚 DÉFINITION OFFICIELLE ANSSI :**
Un mode opératoire décrit **COMMENT** une source de risque met en œuvre concrètement un scénario stratégique. Il détaille les **techniques**, **outils** et **procédures** utilisés pour atteindre l'objectif malveillant.

**🔄 TRANSFORMATION STRATÉGIQUE → OPÉRATIONNEL :**

**📊 NIVEAU STRATÉGIQUE (Atelier 3) :**
\`\`\`
Vision : MACRO - Vue d'ensemble
Focus : QUI attaque QUOI pour obtenir QUOI
Détail : Faible - Grandes lignes
Public : Direction, COMEX, RSSI
Objectif : Priorisation des risques

Exemple : "Un cybercriminel spécialisé santé compromet
le SIH pour paralyser les urgences et extorquer une rançon"
\`\`\`

**⚙️ NIVEAU OPÉRATIONNEL (Atelier 4) :**
\`\`\`
Vision : MICRO - Détails techniques
Focus : COMMENT l'attaque se déroule concrètement
Détail : Élevé - Étapes précises
Public : Équipes techniques, SOC, CERT
Objectif : Mesures de protection concrètes

Exemple : "Phishing Dr.Martin → Backdoor Cobalt Strike
→ Escalade CVE-2023-XXXX → Propagation VLAN → LockBit"
\`\`\`

Cette méthodologie nous permet de décomposer précisément les scénarios stratégiques en modes opératoires techniques exploitables par les équipes de sécurité.`,
          completed: false
        },
        {
          id: "w4-ransomware-mode",
          title: "2. Mode opératoire Ransomware SIH",
          description: "Décomposez le scénario 'Ransomware SIH Urgences' en mode opératoire technique détaillé",
          type: "exercise",
          duration: 45,
          content: `🥇 **MODE OPÉRATOIRE "RANSOMWARE SIH URGENCES" - ANALYSE TECHNIQUE DÉTAILLÉE**

**📋 CONTEXTE DU MODE OPÉRATOIRE :**
Transformation du scénario stratégique "Cybercriminel spécialisé santé → Urgences vitales + SIH → Arrêt urgences + Paralysie SI" en mode opératoire technique précis.

**⚙️ CARACTÉRISTIQUES TECHNIQUES :**
- **Complexité** : 9/10 (Très élevée)
- **Sophistication** : APT-level avec spécialisation santé
- **Durée totale** : 3-6 semaines (reconnaissance → impact)
- **Techniques MITRE** : 15 techniques mappées
- **Détection** : 8/10 (Très difficile sans EDR avancé)

Cette décomposition technique détaillée permet aux équipes SOC/CERT de comprendre précisément comment l'attaque se déroule et quels indicateurs surveiller.`,
          completed: false
        },
        {
          id: "w4-insider-mode",
          title: "3. Mode opératoire Abus privilèges",
          description: "Analysez les techniques d'abus de privilèges par un administrateur interne",
          type: "exercise",
          duration: 30,
          content: `🥈 **MODE OPÉRATOIRE "ABUS PRIVILÈGES ADMINISTRATEUR" - ANALYSE TECHNIQUE**

**📋 CONTEXTE DU MODE OPÉRATOIRE :**
Transformation du scénario "Administrateur IT mécontent → Données patients + Systèmes → Fuite données + Paralysie partielle"

**⚙️ CARACTÉRISTIQUES TECHNIQUES :**
- **Complexité** : 4/10 (Modérée)
- **Sophistication** : Utilisation d'outils légitimes
- **Durée** : Action immédiate possible
- **Techniques MITRE** : 8 techniques mappées
- **Détection** : 7/10 (Difficile - accès légitime)

L'analyse révèle que la menace interne reste l'une des plus difficiles à détecter malgré sa simplicité technique.`,
          completed: false
        },
        {
          id: "w4-gravity-evaluation",
          title: "4. Évaluation gravité ANSSI",
          description: "Évaluez la gravité des modes opératoires selon la grille officielle ANSSI",
          type: "validation",
          duration: 20,
          content: `📊 **ÉVALUATION GRAVITÉ SELON GRILLE ANSSI**

**🎯 GRILLE DE GRAVITÉ ANSSI ADAPTÉE CHU :**

**CRITIQUE (4/4) - Impact vital immédiat :**
• Arrêt urgences vitales > 4h
• Décès patients liés à l'incident
• Paralysie SIH > 24h
• Fuite données > 100k patients

**MAJEUR (3/4) - Impact grave :**
• Perturbation urgences < 4h
• Retard soins non vitaux
• Paralysie services non critiques
• Fuite données < 100k patients

Cette grille adaptée au contexte hospitalier permet une évaluation précise de la gravité selon l'impact sur les soins.`,
          completed: false
        },
        {
          id: "w4-detection-measures",
          title: "5. Mesures de détection",
          description: "Identifiez les mesures de détection adaptées aux modes opératoires analysés",
          type: "validation",
          duration: 10,
          content: `🔍 **MESURES DE DÉTECTION ADAPTÉES**

**🎯 DÉTECTION RANSOMWARE SIH :**
• EDR avancé avec détection comportementale
• SIEM avec règles spécialisées santé
• Monitoring chiffrement anormal
• Alertes sur désactivation sauvegardes

**🎯 DÉTECTION ABUS PRIVILÈGES :**
• UEBA (User Entity Behavior Analytics)
• PAM (Privileged Access Management)
• Monitoring accès hors horaires
• DLP (Data Loss Prevention)

Ces mesures permettent une détection précoce adaptée aux spécificités de chaque mode opératoire.`,
          completed: false
        }
      ],
      exercises: [
        {
          id: 'ome_001_technical_decomposition',
          title: 'Décomposition technique mode opératoire Ransomware',
          description: 'Analysez et décomposez techniquement le mode opératoire Ransomware SIH étape par étape',
          type: 'interactive',
          difficulty: 'advanced',
          duration: 35,
          points: 100,
          category: 'technical_analysis'
        },
        {
          id: 'ome_002_mitre_mapping',
          title: 'Mapping MITRE ATT&CK complet mode opératoire',
          description: 'Mappez systématiquement toutes les techniques MITRE ATT&CK du mode opératoire Ransomware',
          type: 'interactive',
          difficulty: 'expert',
          duration: 40,
          points: 120,
          category: 'mitre_mapping'
        },
        {
          id: 'ome_003_ioc_identification',
          title: 'Identification et analyse des IOCs par phase',
          description: 'Identifiez et analysez les indicateurs de compromission pour chaque phase du mode opératoire',
          type: 'interactive',
          difficulty: 'advanced',
          duration: 30,
          points: 80,
          category: 'ioc_identification'
        },
        {
          id: 'ome_004_timeline_construction',
          title: 'Construction timeline d\'attaque détaillée',
          description: 'Construisez la timeline précise de l\'attaque avec fenêtres de détection',
          type: 'interactive',
          difficulty: 'expert',
          duration: 25,
          points: 90,
          category: 'timeline_construction'
        },
        {
          id: 'ome_005_incident_simulation',
          title: 'Simulation d\'analyse d\'incident en temps réel',
          description: 'Analysez un incident en cours avec preuves forensiques réelles',
          type: 'interactive',
          difficulty: 'expert',
          duration: 45,
          points: 150,
          category: 'incident_simulation'
        }
      ],
      prerequisites: ["Atelier 3 complété avec score ≥ 70%"],
      anssiCompliance: ["Grille de gravité ANSSI", "Guide EBIOS RM Atelier 4", "MITRE ATT&CK Framework"],
      realWorldExamples: [
        "Analyse technique CHU Rouen (Ryuk 2019)",
        "Mode opératoire WannaCry NHS (2017)",
        "Décomposition NotPetya hôpitaux (2017)"
      ],
      status: 'locked',
      completionRate: 0,
      score: 0
    },
    {
      id: 5,
      title: "Atelier 5 - Traitement du risque",
      subtitle: "Stratégie et mesures de sécurité",
      description: "Définissez la stratégie de traitement des risques et sélectionnez les mesures de sécurité adaptées au contexte hospitalier.",
      icon: ShieldCheck,
      duration: 95,
      objectives: [
        "Définir la stratégie de traitement des risques",
        "Sélectionner les mesures de sécurité appropriées",
        "Évaluer le coût-bénéfice des mesures",
        "Planifier la mise en œuvre",
        "Établir le plan de suivi des risques"
      ],
      deliverables: [
        "Stratégie de traitement",
        "Plan de mesures de sécurité",
        "Analyse coût-bénéfice",
        "Planning de mise en œuvre",
        "Plan de suivi des risques"
      ],
      steps: [
        {
          id: "w5-treatment-strategy",
          title: "Stratégie de traitement",
          description: "Définissez l'approche globale de traitement",
          type: "theory",
          duration: 25,
          content: "La stratégie de traitement définit l'approche...",
          completed: false
        },
        {
          id: "w5-security-measures",
          title: "Mesures de sécurité",
          description: "Sélectionnez les mesures adaptées au CHU",
          type: "exercise",
          duration: 45,
          content: "Choisissons les mesures pour le CHU...",
          completed: false
        },
        {
          id: "w5-implementation",
          title: "Plan de mise en œuvre",
          description: "Planifiez le déploiement des mesures",
          type: "validation",
          duration: 25,
          content: "Établissons le plan de déploiement...",
          completed: false
        }
      ],
      prerequisites: ["Atelier 4 complété avec score ≥ 70%"],
      anssiCompliance: ["Guide mesures ANSSI", "Référentiel sécurité santé", "Bonnes pratiques EBIOS RM"],
      realWorldExamples: [
        "Plan de sécurité CHU post-incident",
        "Mesures anti-ransomware hôpital",
        "Stratégie de résilience santé"
      ],
      status: 'locked',
      completionRate: 0,
      score: 0
    }
  ];

  // 🎯 RENDU DE LA VUE D'ENSEMBLE
  const renderOverview = () => (
    <div className="max-w-6xl mx-auto p-6">
      {/* En-tête du module */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">🎓 Formation EBIOS RM Professionnelle</h1>
            <p className="text-blue-100 text-lg">
              Maîtrisez la méthodologie ANSSI de gestion des risques cyber - CHU Métropolitain
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{progress.overallCompletion}%</div>
            <div className="text-blue-100">Progression globale</div>
          </div>
        </div>
        
        {/* Barre de progression globale */}
        <div className="mt-6">
          <div className="w-full bg-blue-500 rounded-full h-3">
            <div 
              className="bg-white h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress.overallCompletion}%` }}
            />
          </div>
        </div>
      </div>

      {/* Métriques de progression */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{Math.floor(progress.timeSpent / 60)}h</div>
              <div className="text-sm text-gray-600">Temps passé</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <Target className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{progress.totalScore}/500</div>
              <div className="text-sm text-gray-600">Score total</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <Award className="w-8 h-8 text-yellow-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{progress.badges.length}</div>
              <div className="text-sm text-gray-600">Badges obtenus</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{progress.currentWorkshop}/5</div>
              <div className="text-sm text-gray-600">Ateliers actifs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des ateliers */}
      <div className="space-y-6">
        {workshops.map((workshop) => (
          <div
            key={workshop.id}
            className={`
              bg-white rounded-xl shadow-sm border-2 transition-all duration-300 hover:shadow-md
              ${workshop.status === 'available' || workshop.status === 'in_progress' || workshop.status === 'completed'
                ? 'border-blue-200 hover:border-blue-300 cursor-pointer'
                : 'border-gray-200 opacity-75'
              }
            `}
            onClick={() => {
              if (workshop.status !== 'locked') {
                setSelectedWorkshop(workshop.id);
                setCurrentView('workshop');
              }
            }}
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {/* Icône et statut */}
                  <div className="relative">
                    <div className={`
                      w-16 h-16 rounded-full flex items-center justify-center
                      ${workshop.status === 'completed' ? 'bg-green-600' :
                        workshop.status === 'in_progress' ? 'bg-blue-600' :
                        workshop.status === 'available' ? 'bg-blue-100' : 'bg-gray-100'
                      }
                    `}>
                      {workshop.status === 'completed' ? (
                        <CheckCircle className="w-8 h-8 text-white" />
                      ) : workshop.status === 'locked' ? (
                        <Lock className="w-8 h-8 text-gray-400" />
                      ) : (
                        <workshop.icon className={`w-8 h-8 ${
                          workshop.status === 'available' ? 'text-blue-600' : 'text-white'
                        }`} />
                      )}
                    </div>
                    {workshop.status === 'available' && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Unlock className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Contenu */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{workshop.title}</h3>
                      <span className="text-sm text-gray-500">• {workshop.duration} min</span>
                      {workshop.status === 'completed' && (
                        <div className="flex items-center space-x-1 text-green-600">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-medium">{workshop.score}/100</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-blue-600 font-medium mb-2">{workshop.subtitle}</p>
                    <p className="text-gray-600 mb-4">{workshop.description}</p>
                    
                    {/* Objectifs */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">🎯 Objectifs d'apprentissage :</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {workshop.objectives.slice(0, 3).map((objective, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {objective}
                          </li>
                        ))}
                        {workshop.objectives.length > 3 && (
                          <li className="text-blue-600 text-xs">+ {workshop.objectives.length - 3} autres objectifs...</li>
                        )}
                      </ul>
                    </div>

                    {/* Prérequis */}
                    {workshop.prerequisites.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">📋 Prérequis :</h4>
                        <ul className="text-sm text-gray-600">
                          {workshop.prerequisites.map((prereq, index) => (
                            <li key={index} className="flex items-center">
                              <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                              {prereq}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Progression */}
                    {workshop.status !== 'locked' && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Progression</span>
                          <span className="text-sm text-gray-600">{workshop.completionRate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              workshop.status === 'completed' ? 'bg-green-600' : 'bg-blue-600'
                            }`}
                            style={{ width: `${workshop.completionRate}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action */}
                <div className="ml-6">
                  {workshop.status === 'locked' ? (
                    <div className="text-gray-400 text-sm text-center">
                      <Lock className="w-6 h-6 mx-auto mb-1" />
                      Verrouillé
                    </div>
                  ) : workshop.status === 'completed' ? (
                    <div className="text-green-600 text-sm text-center">
                      <CheckCircle className="w-6 h-6 mx-auto mb-1" />
                      Terminé
                    </div>
                  ) : (
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                      <Play className="w-4 h-4 mr-2" />
                      {workshop.status === 'in_progress' ? 'Continuer' : 'Commencer'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // 🎯 RENDU PRINCIPAL
  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'overview' && renderOverview()}
      {currentView === 'workshop' && selectedWorkshop && (
        <div>Workshop {selectedWorkshop} - À implémenter</div>
      )}
    </div>
  );
};

export default EbiosTrainingModule;
