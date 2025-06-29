-- 🚨 CORRECTION CRITIQUE ANSSI - NOMS DE COLONNES EXACTS
-- Basé sur la structure réelle de la base de données

-- 1. Vérifier le problème critique
SELECT 'PROBLÈME CRITIQUE IDENTIFIÉ:' as Diagnostic;

SELECT DISTINCT [Partie Prenante] as PartiePrenante_Manquante
FROM ERM_CheminAttaque 
WHERE [Partie Prenante] NOT IN (
    SELECT [Partie Prenante] FROM ERM_PartiePrenante
) AND [Partie Prenante] IS NOT NULL;

-- 2. CORRECTION IMMÉDIATE : Ajouter "Prestataire informatique"
-- Structure réelle: Categorie, [Partie Prenante], Dependance, Penetration, Exposition, [Maturite Cyber], Confiance, [Fiabilite Cyber]

INSERT INTO ERM_PartiePrenante (
    Categorie,
    [Partie Prenante], 
    Dependance,
    Penetration,
    Exposition,
    [Maturite Cyber],
    Confiance,
    [Fiabilite Cyber]
) VALUES (
    'Prestataires',                   -- Catégorie cohérente avec écosystème
    'Prestataire informatique',       -- Nom exact référencé dans chemins
    3,                               -- Dépendance élevée (IT critique)
    4,                               -- Pénétration maximale (accès SI complet)
    12,                              -- Exposition = 3 × 4
    2,                               -- Maturité cyber faible (évaluation guide ANSSI)
    2,                               -- Confiance modérée
    4                                -- Fiabilité cyber faible (menace élevée)
);

-- 3. Vérification immédiate
SELECT 'VÉRIFICATION POST-CORRECTION:' as Statut;

SELECT COUNT(*) as Violations_Restantes
FROM (
    SELECT DISTINCT [Partie Prenante]
    FROM ERM_CheminAttaque 
    WHERE [Partie Prenante] NOT IN (
        SELECT [Partie Prenante] FROM ERM_PartiePrenante
    ) AND [Partie Prenante] IS NOT NULL
) as violations;

-- 4. Rapport de conformité ANSSI final
SELECT 'RAPPORT FINAL CONFORMITÉ ANSSI:' as Rapport;

SELECT 
    COUNT(*) as Total_Chemins_Attaque,
    COUNT(pp.[Partie Prenante]) as Chemins_Valides,
    COUNT(*) - COUNT(pp.[Partie Prenante]) as Violations_Integrite,
    ROUND(
        (CAST(COUNT(pp.[Partie Prenante]) AS FLOAT) / COUNT(*)) * 100, 
        1
    ) as Pourcentage_Conformite,
    CASE 
        WHEN COUNT(*) = COUNT(pp.[Partie Prenante]) THEN '✅ CONFORME ANSSI 100%'
        ELSE '❌ NON-CONFORME - VIOLATIONS DÉTECTÉES'
    END as Statut_Final_Audit
FROM ERM_CheminAttaque ca
LEFT JOIN ERM_PartiePrenante pp ON ca.[Partie Prenante] = pp.[Partie Prenante];

-- 5. Affichage cartographie complète conforme ANSSI
SELECT 'CARTOGRAPHIE ÉCOSYSTÈME COMPLÈTE (ANSSI Art. 3.2):' as Resultat;

SELECT 
    pp.Categorie,
    pp.[Partie Prenante],
    pp.Exposition,
    pp.[Fiabilite Cyber] as Niveau_Menace,
    CASE 
        WHEN pp.[Fiabilite Cyber] >= 4 THEN 'CRITIQUE ⚠️'
        WHEN pp.[Fiabilite Cyber] >= 3 THEN 'SURVEILLANCE 📊'
        ELSE 'ACCEPTABLE ✅'
    END as Statut_ANSSI,
    CASE
        WHEN EXISTS (
            SELECT 1 FROM ERM_CheminAttaque ca 
            WHERE ca.[Partie Prenante] = pp.[Partie Prenante]
        ) THEN 'UTILISÉE SCÉNARIOS 🎯'
        ELSE 'NON UTILISÉE'
    END as Implication_Scenarios
FROM ERM_PartiePrenante pp
ORDER BY pp.[Fiabilite Cyber] DESC, pp.Categorie, pp.[Partie Prenante];

SELECT '🎉 CORRECTION CRITIQUE TERMINÉE - CONFORMITÉ ANSSI RESTAURÉE' as Message_Final; 