# ⚙️ GUIDE DES PARAMÈTRES - EBIOS AI MANAGER

## 📋 APERÇU

L'interface de paramètres d'EBIOS AI Manager permet aux administrateurs de configurer tous les aspects de l'application de manière sécurisée et centralisée. Cette interface respecte les exigences de sécurité ANSSI et offre une gestion granulaire des permissions et des configurations.

## 🎯 ACCÈS AUX PARAMÈTRES

### Prérequis
- **Rôle requis** : Administrateur ou SuperAdministrateur
- **MFA** : Authentification multifacteur obligatoire
- **Permissions** : `settings:read` et `settings:write`

### Navigation
1. Connectez-vous avec un compte administrateur
2. Accédez au menu principal
3. Cliquez sur "Paramètres" dans la barre latérale
4. Vérifiez votre identité avec MFA si demandé

## 📑 ONGLETS DE CONFIGURATION

### 🌐 Général
Configuration des paramètres de base de l'application.

#### Paramètres Disponibles
- **Nom de l'Organisation** : Nom affiché dans l'interface
- **Langue** : Français (par défaut) ou Anglais
- **Fuseau Horaire** : Europe/Paris (par défaut), UTC, etc.
- **Thème** : Clair, Sombre, ou Automatique

#### Notifications
- ✅ **Email** : Notifications par email
- ✅ **Navigateur** : Notifications push du navigateur
- ⚪ **Slack** : Intégration Slack (optionnel)

### 🔒 Sécurité
Configuration avancée des paramètres de sécurité conformes ANSSI.

#### Authentification Multifacteur (MFA)
Configuration par rôle :
- ✅ **Admin** : MFA obligatoire (recommandé)
- ✅ **Auditor** : MFA obligatoire (recommandé)
- ✅ **Analyst** : MFA obligatoire (recommandé)
- ⚪ **User** : MFA optionnel

#### Politique de Mot de Passe
- **Longueur minimale** : 12 caractères (recommandé ANSSI)
- **Complexité** : Majuscules, minuscules, chiffres, caractères spéciaux
- **Tentatives** : 5 tentatives avant verrouillage
- **Verrouillage** : 15 minutes (configurable)
- **Âge maximum** : 90 jours

### 🤖 IA & Modèles
Configuration des modèles LLM et des clés API.

#### Sélection du Modèle
- **Provider** : OpenRouter (recommandé) ou Accès Direct
- **Modèle Actif** : Gemini Flash 2.5 (par défaut)

#### Modèles Disponibles
| Modèle | Provider | Description | Coût/1k tokens |
|--------|----------|-------------|----------------|
| **Gemini Flash 2.5** | Google | Rapide et efficace (défaut) | $0.075 |
| Mistral Large | Mistral AI | Modèle français avancé | $3.00 |
| Claude Sonnet 4 | Anthropic | Dernière génération pour analyse structurée | $3.00 |
| Claude Opus 4 | Anthropic | Le plus avancé d'Anthropic | $15.00 |
| Qwen 2.5 72B | Alibaba | Multilingue performant | $0.90 |
| DeepSeek Chat | DeepSeek | Raisonnement logique | $0.14 |

#### Configuration des Clés API
- **OpenRouter** : Clé principale pour accès unifié
- **Google Gemini** : Accès direct à Gemini
- **Anthropic** : Accès direct à Claude
- **Mistral AI** : Accès direct à Mistral
- **OpenAI** : Accès direct à GPT

#### Paramètres du Modèle
- **Température** : 0.0 (précis) à 2.0 (créatif) - défaut: 0.7
- **Tokens Maximum** : 100 à 8000 - défaut: 4000
- **Top P** : 0.0 à 1.0 - défaut: 0.9
- **Modèle de Secours** : Modèle utilisé en cas d'échec

### 🔧 Avancé
Paramètres techniques et de conformité.

#### Gestion des Sessions
- **Durée maximale** : 480 minutes (8 heures)
- **Timeout inactivité** : 60 minutes
- **Sessions concurrentes** : 3 par utilisateur
- **MFA pour actions sensibles** : Activé

#### Audit et Monitoring
- **Rétention des logs** : 2555 jours (7 ans - conformité ANSSI)
- **Rotation des clés** : 90 jours
- **Audit activé** : ✅ Obligatoire
- **Alertes temps réel** : ✅ Recommandé
- **Détection d'anomalies** : ✅ Activé
- **Chiffrement** : ✅ AES-256-GCM

#### Seuils d'Alerte
- **Connexions échouées** : 5 tentatives
- **Activité suspecte** : 10 événements
- **Exfiltration de données** : 3 tentatives

#### Rétention des Données
- **Missions** : 2555 jours (7 ans)
- **Rapports** : 2555 jours (7 ans)
- **Logs** : 2555 jours (7 ans)

## 🧪 TEST DE CONFIGURATION

### Test des Clés API
1. Saisissez votre clé API dans le champ approprié
2. Cliquez sur le bouton "Test" (🧪)
3. Vérifiez le résultat :
   - ✅ **Succès** : Clé valide et fonctionnelle
   - ❌ **Échec** : Clé invalide ou problème de connexion

### Test des Modèles LLM
1. Accédez à l'onglet "IA & Modèles"
2. Configurez votre clé API OpenRouter
3. Sélectionnez un modèle
4. Utilisez le panneau de test intégré
5. Envoyez un message de test
6. Vérifiez la réponse et les métriques

## 🔐 SÉCURITÉ DES PARAMÈTRES

### Chiffrement
- **Clés API** : Chiffrées avec AES-256-GCM
- **Données sensibles** : Chiffrement automatique
- **Transmission** : TLS 1.3 obligatoire

### Audit
- **Modifications** : Toutes les modifications sont auditées
- **Accès** : Logs d'accès complets
- **Intégrité** : Signature cryptographique des logs

### Permissions
- **Lecture** : Rôles Admin, Auditor
- **Écriture** : Rôles Admin uniquement
- **MFA** : Obligatoire pour modifications sensibles

## 📊 MONITORING ET MÉTRIQUES

### Métriques Disponibles
- **Appels LLM** : Nombre total, succès, échecs
- **Temps de réponse** : Moyenne et tendances
- **Tokens utilisés** : Consommation et coûts
- **Taux d'erreur** : Pourcentage d'échecs

### Alertes Automatiques
- **Clé API expirée** : Notification 7 jours avant
- **Quota dépassé** : Alerte en temps réel
- **Erreurs répétées** : Seuil configurable
- **Anomalies détectées** : Notification immédiate

## 🔄 SYNCHRONISATION

### Synchronisation Automatique
- **Fréquence** : Toutes les 5 minutes
- **Événements** : Temps réel pour modifications
- **Validation** : Vérification d'intégrité continue

### Synchronisation Manuelle
1. Cliquez sur "Actualiser" dans l'interface
2. Vérifiez les messages de confirmation
3. Contrôlez la cohérence des paramètres

## 🚨 DÉPANNAGE

### Problèmes Courants

#### Clé API Non Reconnue
- Vérifiez la validité de la clé
- Contrôlez les permissions du compte
- Testez avec le bouton de test intégré

#### Modèle Non Disponible
- Vérifiez votre abonnement au provider
- Contrôlez les quotas disponibles
- Utilisez le modèle de secours

#### Erreurs de Synchronisation
- Actualisez la page
- Vérifiez la connexion réseau
- Consultez les logs d'audit

### Support
- **Documentation** : `/docs/SETTINGS_GUIDE.md`
- **Logs** : Interface de monitoring intégrée
- **Contact** : support@ebios-ai-manager.fr

## 📋 CHECKLIST DE CONFIGURATION

### Configuration Initiale
- [ ] Configurer le nom de l'organisation
- [ ] Définir la langue et le fuseau horaire
- [ ] Activer MFA pour tous les rôles privilégiés
- [ ] Configurer la politique de mot de passe
- [ ] Saisir les clés API nécessaires
- [ ] Sélectionner le modèle LLM principal
- [ ] Tester la configuration LLM
- [ ] Vérifier les paramètres d'audit
- [ ] Configurer les seuils d'alerte
- [ ] Valider la rétention des données

### Maintenance Régulière
- [ ] Rotation des clés API (trimestrielle)
- [ ] Vérification des quotas LLM
- [ ] Contrôle des métriques de performance
- [ ] Révision des seuils d'alerte
- [ ] Audit des paramètres de sécurité
- [ ] Test de la configuration de secours

## 🎯 BONNES PRATIQUES

### Sécurité
1. **Rotation régulière** des clés API
2. **MFA obligatoire** pour tous les administrateurs
3. **Audit continu** des modifications
4. **Sauvegarde** des configurations critiques
5. **Test régulier** des configurations de secours

### Performance
1. **Monitoring** des métriques LLM
2. **Optimisation** des paramètres de modèle
3. **Gestion** des quotas et coûts
4. **Utilisation** des modèles de secours
5. **Surveillance** des temps de réponse

### Conformité
1. **Respect** des exigences ANSSI
2. **Documentation** des modifications
3. **Validation** des configurations
4. **Archivage** des logs d'audit
5. **Révision** périodique des paramètres

---

**Version** : 1.0  
**Dernière mise à jour** : 2024-12-14  
**Classification** : Usage Interne
