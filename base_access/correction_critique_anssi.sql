-- 🚨 CORRECTION CRITIQUE ANSSI - CONFORMITÉ OBLIGATOIRE
-- Script de correction immédiate des violations identifiées

-- PROBLÈME CRITIQUE 1 : Partie prenante "Prestataire informatique" manquante
-- VIOLATION : Article 3.2 ANSSI - Cartographie écosystème incomplète
-- IMPACT : DISQUALIFIANT

-- 1. Vérifier l'existence de la partie prenante manquante
SELECT 'VÉRIFICATION - Parties prenantes référencées mais manquantes:' as Diagnostic;

SELECT DISTINCT [Partie Prenante] as PartiePrenante_Manquante
FROM ERM_CheminAttaque 
WHERE [Partie Prenante] NOT IN (
    SELECT [Partie Prenante] FROM ERM_PartiePrenante
);

-- 2. CORRECTION IMMÉDIATE : Ajouter la partie prenante manquante
-- Basé sur les valeurs cohérentes avec le cas BioTechVac et guide ANSSI

INSERT INTO ERM_PartiePrenante (
    [Catégorie],
    [Partie Prenante], 
    [Dépendance],
    [Pénétration],
    [Exposition],
    [Maturité],
    [Confiance],
    [Menace]
) VALUES (
    'Prestataires',                   -- Catégorie cohérente
    'Prestataire informatique',       -- Nom exact référencé
    3,                               -- Dépendance élevée (services IT critiques)
    4,                               -- Pénétration maximale (accès privilégié SI)
    12,                              -- Exposition = Dépendance × Pénétration
    2,                               -- Maturité faible (observée dans évaluation)
    2,                               -- Confiance modérée
    4                                -- Menace élevée résultante
);

-- 3. Vérifier la correction
SELECT 'VÉRIFICATION POST-CORRECTION:' as Statut;

SELECT COUNT(*) as Parties_Prenantes_Orphelines
FROM (
    SELECT DISTINCT [Partie Prenante]
    FROM ERM_CheminAttaque 
    WHERE [Partie Prenante] NOT IN (
        SELECT [Partie Prenante] FROM ERM_PartiePrenante
    )
) as orphelines;

-- 4. Afficher la cartographie complète des parties prenantes
SELECT 'CARTOGRAPHIE ÉCOSYSTÈME COMPLÈTE (conforme ANSSI):' as Resultat;

SELECT 
    pp.[Catégorie],
    pp.[Partie Prenante],
    pp.[Exposition],
    pp.[Menace],
    CASE 
        WHEN pp.[Menace] >= 3 THEN 'CRITIQUE (Atelier 3 ANSSI)'
        WHEN pp.[Menace] >= 2 THEN 'SURVEILLANCE'
        ELSE 'ACCEPTABLE'
    END as Statut_ANSSI,
    CASE
        WHEN EXISTS (
            SELECT 1 FROM ERM_CheminAttaque ca 
            WHERE ca.[Partie Prenante] = pp.[Partie Prenante]
        ) THEN 'IMPLIQUÉE DANS CHEMINS D''ATTAQUE'
        ELSE 'NON IMPLIQUÉE'
    END as Utilisation_Scenarios
FROM ERM_PartiePrenante pp
ORDER BY pp.[Menace] DESC, pp.[Catégorie], pp.[Partie Prenante];

-- 5. Valider la cohérence des scénarios stratégiques (Atelier 3)
SELECT 'VALIDATION SCÉNARIOS STRATÉGIQUES (ANSSI Art. 3.3):' as Validation;

SELECT 
    sr.[Source de Risque],
    sr.[Objectif visé] as Objectif_Vise,
    ca.[Chemin d''attaque] as Chemin_Attaque,
    ca.[Partie Prenante],
    pp.[Menace] as Niveau_Menace_Partie_Prenante,
    CASE 
        WHEN pp.[Menace] IS NULL THEN '❌ PARTIE PRENANTE MANQUANTE'
        WHEN pp.[Menace] >= 3 THEN '✅ PARTIE PRENANTE CRITIQUE VALIDÉE'
        ELSE '⚠️ PARTIE PRENANTE NON CRITIQUE'
    END as Statut_Conformite_ANSSI
FROM ERM_SourceRisque sr
JOIN ERM_CheminAttaque ca ON sr.[Source de Risque] = ca.[Source de Risque] 
                           AND sr.[Objectif visé] = ca.[Objectif visé]
LEFT JOIN ERM_PartiePrenante pp ON ca.[Partie Prenante] = pp.[Partie Prenante]
ORDER BY sr.[Source de Risque], ca.[Chemin d''attaque];

-- 6. Rapport de conformité ANSSI
SELECT 'RAPPORT CONFORMITÉ ANSSI - ATELIER 3:' as Rapport;

SELECT 
    COUNT(*) as Total_Chemins_Attaque,
    COUNT(pp.[Partie Prenante]) as Chemins_Avec_Parties_Prenantes_Valides,
    COUNT(*) - COUNT(pp.[Partie Prenante]) as Violations_Integrite,
    CASE 
        WHEN COUNT(*) = COUNT(pp.[Partie Prenante]) THEN '✅ CONFORME ANSSI'
        ELSE '❌ NON-CONFORME - VIOLATIONS DÉTECTÉES'
    END as Statut_Final_Audit
FROM ERM_CheminAttaque ca
LEFT JOIN ERM_PartiePrenante pp ON ca.[Partie Prenante] = pp.[Partie Prenante];

-- 7. CORRECTION ADDITIONNELLE : Vérifier les liens Atelier 3 ↔ Atelier 4
-- ANSSI p.55 : "chaque chemin d'attaque stratégique correspond à un scénario opérationnel"

SELECT 'VALIDATION LIENS ATELIER 3 ↔ ATELIER 4 (ANSSI):' as Validation_Inter_Ateliers;

SELECT 
    'Chemins d''attaque stratégiques' as Element,
    COUNT(DISTINCT CONCAT(ca.[Source de Risque], ' - ', ca.[Objectif visé], ' - ', ca.[Chemin d''attaque])) as Total_Atelier3
FROM ERM_CheminAttaque ca

UNION ALL

SELECT 
    'Scénarios opérationnels',
    COUNT(DISTINCT CONCAT(so.[Source de Risque], ' - ', so.[Objectif visé], ' - ', so.[Scénario opérationnel])) as Total_Atelier4
FROM ERM_ScenarioOperationnel so;

-- Message final
SELECT '🎯 CORRECTION CRITIQUE TERMINÉE - VÉRIFIER CONFORMITÉ ANSSI' as Message_Final; 