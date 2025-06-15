const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Données réelles workshop
const workshopData = {
  workshop1: {
    name: 'Atelier 1 - Étude du contexte',
    description: 'Identification des biens supports et des sources de risques',
    steps: ['business_values', 'supporting_assets', 'risk_sources', 'stakeholders']
  },
  workshop2: {
    name: 'Atelier 2 - Étude des événements redoutés',
    description: 'Identification et évaluation des événements redoutés',
    steps: ['feared_events', 'impact_assessment', 'gravity_evaluation']
  },
  workshop3: {
    name: 'Atelier 3 - Étude des scénarios stratégiques',
    description: 'Élaboration des scénarios stratégiques',
    steps: ['strategic_scenarios', 'ecosystem_mapping', 'attack_paths']
  },
  workshop4: {
    name: 'Atelier 4 - Étude des scénarios opérationnels',
    description: 'Détail des scénarios opérationnels',
    steps: ['operational_scenarios', 'technical_analysis', 'vulnerability_assessment']
  },
  workshop5: {
    name: 'Atelier 5 - Traitement du risque',
    description: 'Définition et mise en œuvre du traitement des risques',
    steps: ['risk_treatment', 'security_measures', 'action_plan', 'monitoring']
  }
};

// Get workshop template
router.get('/templates/:workshopId', (req, res) => {
  try {
    const { workshopId } = req.params;
    const template = workshopData[workshopId];
    
    if (!template) {
      return res.status(404).json({ error: 'Workshop template not found' });
    }

    res.json({
      success: true,
      template: {
        id: workshopId,
        ...template
      }
    });
  } catch (error) {
    console.error('Get workshop template error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all workshop templates
router.get('/templates', (req, res) => {
  try {
    const templates = Object.entries(workshopData).map(([id, template]) => ({
      id,
      ...template
    }));

    res.json({
      success: true,
      templates
    });
  } catch (error) {
    console.error('Get workshop templates error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get workshop data for a mission
router.get('/:missionId/:workshopId', (req, res) => {
  try {
    const { missionId, workshopId } = req.params;
    
    // In a real app, fetch from database
    // For now, return mock data
    const workshopData = {
      id: workshopId,
      missionId: parseInt(missionId),
      ...workshopData[workshopId],
      data: {},
      completed: false,
      progress: 0,
      lastModified: new Date().toISOString()
    };

    res.json({
      success: true,
      workshop: workshopData
    });
  } catch (error) {
    console.error('Get workshop data error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update workshop data
router.put('/:missionId/:workshopId', [
  body('data').optional().isObject(),
  body('completed').optional().isBoolean(),
  body('progress').optional().isNumeric({ min: 0, max: 100 })
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { missionId, workshopId } = req.params;
    const { data, completed, progress } = req.body;
    
    // In a real app, update database
    const updatedWorkshop = {
      id: workshopId,
      missionId: parseInt(missionId),
      ...workshopData[workshopId],
      data: data || {},
      completed: completed || false,
      progress: progress || 0,
      lastModified: new Date().toISOString()
    };

    res.json({
      success: true,
      workshop: updatedWorkshop,
      message: 'Workshop updated successfully'
    });
  } catch (error) {
    console.error('Update workshop error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Validate workshop data
router.post('/:missionId/:workshopId/validate', (req, res) => {
  try {
    const { missionId, workshopId } = req.params;
    const { data } = req.body;
    
    // Basic validation logic (extend as needed)
    const validationResults = {
      isValid: true,
      errors: [],
      warnings: [],
      completeness: 100
    };

    // Workshop-specific validation
    switch (workshopId) {
      case 'workshop1':
        if (!data.businessValues || data.businessValues.length === 0) {
          validationResults.errors.push('Au moins une valeur métier doit être définie');
          validationResults.isValid = false;
        }
        break;
      case 'workshop2':
        if (!data.fearedEvents || data.fearedEvents.length === 0) {
          validationResults.errors.push('Au moins un événement redouté doit être défini');
          validationResults.isValid = false;
        }
        break;
      // Add more validation rules for other workshops
    }

    res.json({
      success: true,
      validation: validationResults
    });
  } catch (error) {
    console.error('Validate workshop error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Generate workshop suggestions using AI
router.post('/:missionId/:workshopId/suggestions', (req, res) => {
  try {
    const { missionId, workshopId } = req.params;
    const { context, currentData } = req.body;
    
    // Mock AI suggestions (replace with real AI integration)
    const suggestions = {
      workshop1: [
        'Considérer les données personnelles comme valeur métier critique',
        'Inclure les systèmes de sauvegarde dans les biens supports',
        'Analyser les menaces internes et externes'
      ],
      workshop2: [
        'Évaluer l\'impact sur la continuité d\'activité',
        'Considérer les aspects réglementaires et de conformité',
        'Analyser les conséquences financières'
      ],
      workshop3: [
        'Mapper les relations entre acteurs de l\'écosystème',
        'Identifier les points de passage obligés',
        'Analyser les motivations des sources de risques'
      ],
      workshop4: [
        'Détailler les vecteurs d\'attaque techniques',
        'Analyser les vulnérabilités spécifiques',
        'Évaluer la vraisemblance des scénarios'
      ],
      workshop5: [
        'Prioriser les mesures selon le rapport coût/efficacité',
        'Planifier la mise en œuvre par phases',
        'Définir des indicateurs de suivi'
      ]
    };

    res.json({
      success: true,
      suggestions: suggestions[workshopId] || [],
      context: {
        workshopId,
        missionId: parseInt(missionId),
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Generate suggestions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;