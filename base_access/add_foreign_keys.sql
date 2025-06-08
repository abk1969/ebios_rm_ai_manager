-- Script SQL pour ajouter les clés étrangères à la base convertie (exemple pour SQLite)
-- À adapter pour MySQL/PostgreSQL si besoin

PRAGMA foreign_keys = OFF;

ALTER TABLE ERM_BienSupportAssocie
  ADD CONSTRAINT fk_bien_valeur_metier FOREIGN KEY ("Valeur Metier") REFERENCES ERM_ValeurMetier("Valeur Metier");
ALTER TABLE ERM_BienSupportAssocie
  ADD CONSTRAINT fk_bien_responsable FOREIGN KEY ("Entite Personne Responsable") REFERENCES ERM_EntitePersonneResponsable("Entite Personne Responsable");
ALTER TABLE ERM_EvenementRedoute
  ADD CONSTRAINT fk_evred_valeur_metier FOREIGN KEY ("Valeur Metier") REFERENCES ERM_ValeurMetier("Valeur Metier");
ALTER TABLE ERM_CheminAttaque
  ADD CONSTRAINT fk_chemin_source FOREIGN KEY ("Source de Risque") REFERENCES ERM_SourceRisque("Source de Risque");
ALTER TABLE ERM_CheminAttaque
  ADD CONSTRAINT fk_chemin_obj_vise FOREIGN KEY ("Objectif Vise") REFERENCES ERM_ObjectifVise("Objectif Vise");
ALTER TABLE ERM_CheminAttaque
  ADD CONSTRAINT fk_chemin_partie FOREIGN KEY ("Partie Prenante") REFERENCES ERM_PartiePrenante("Partie Prenante");

PRAGMA foreign_keys = ON;
