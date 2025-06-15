/**
 * 🕸️ GRAPHIQUE DE DÉPENDANCES EBIOS RM
 * Visualisation interactive des relations entre entités avec suggestions IA
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Network, 
  Zap, 
  Eye, 
  EyeOff, 
  Filter, 
  Download,
  RefreshCw,
  Info,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '../ui/button';

interface EbiosEntity {
  id: string;
  name: string;
  type: 'businessValue' | 'dreadedEvent' | 'supportingAsset' | 'riskSource' | 'strategicScenario' | 'operationalScenario' | 'securityMeasure';
  workshop: number;
  criticality?: 'low' | 'medium' | 'high' | 'critical';
  aiSuggestions?: number;
  validationStatus?: 'valid' | 'warning' | 'error';
}

interface Relationship {
  id: string;
  source: string;
  target: string;
  type: 'impacts' | 'protects' | 'threatens' | 'mitigates' | 'generates';
  strength: number; // 0-1
  aiGenerated?: boolean;
  confidence?: number;
}

interface GraphSuggestion {
  id: string;
  type: 'missing_link' | 'weak_link' | 'redundant_link' | 'new_entity';
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  entities: string[];
}

interface DependencyGraphProps {
  missionId: string;
  entities: EbiosEntity[];
  relationships: Relationship[];
  suggestions?: GraphSuggestion[];
  onEntityClick?: (entity: EbiosEntity) => void;
  onRelationshipClick?: (relationship: Relationship) => void;
  onSuggestionApply?: (suggestion: GraphSuggestion) => void;
  className?: string;
}

const DependencyGraph: React.FC<DependencyGraphProps> = ({
  missionId,
  entities,
  relationships,
  suggestions = [],
  onEntityClick,
  onRelationshipClick,
  onSuggestionApply,
  className
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [selectedRelationship, setSelectedRelationship] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [filterWorkshop, setFilterWorkshop] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'full' | 'simplified'>('full');

  // Calcul des positions des entités (layout en cercle par workshop)
  const calculateLayout = () => {
    const layout: { [key: string]: { x: number; y: number } } = {};
    const centerX = 400;
    const centerY = 300;
    const workshopRadius = 150;
    
    // Grouper par workshop
    const workshopGroups: { [key: number]: EbiosEntity[] } = {};
    entities.forEach(entity => {
      if (!workshopGroups[entity.workshop]) {
        workshopGroups[entity.workshop] = [];
      }
      workshopGroups[entity.workshop].push(entity);
    });

    // Positionner chaque workshop en cercle
    Object.entries(workshopGroups).forEach(([workshop, workshopEntities], workshopIndex) => {
      const workshopAngle = (workshopIndex * 2 * Math.PI) / Object.keys(workshopGroups).length;
      const workshopCenterX = centerX + Math.cos(workshopAngle) * workshopRadius;
      const workshopCenterY = centerY + Math.sin(workshopAngle) * workshopRadius;
      
      // Positionner les entités du workshop en cercle
      workshopEntities.forEach((entity, entityIndex) => {
        const entityAngle = (entityIndex * 2 * Math.PI) / workshopEntities.length;
        const entityRadius = 60;
        
        layout[entity.id] = {
          x: workshopCenterX + Math.cos(entityAngle) * entityRadius,
          y: workshopCenterY + Math.sin(entityAngle) * entityRadius
        };
      });
    });

    return layout;
  };

  const layout = calculateLayout();

  const getEntityColor = (entity: EbiosEntity) => {
    const colors = {
      businessValue: '#3B82F6', // blue
      dreadedEvent: '#EF4444', // red
      supportingAsset: '#10B981', // green
      riskSource: '#F59E0B', // amber
      strategicScenario: '#8B5CF6', // violet
      operationalScenario: '#EC4899', // pink
      securityMeasure: '#06B6D4' // cyan
    };
    return colors[entity.type] || '#6B7280';
  };

  const getValidationColor = (status?: string) => {
    switch (status) {
      case 'valid': return '#10B981';
      case 'warning': return '#F59E0B';
      case 'error': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getRelationshipColor = (relationship: Relationship) => {
    if (relationship.aiGenerated) return '#8B5CF6';
    return '#6B7280';
  };

  const filteredEntities = entities.filter(entity => {
    if (filterWorkshop && entity.workshop !== filterWorkshop) return false;
    if (filterType && entity.type !== filterType) return false;
    return true;
  });

  const filteredRelationships = relationships.filter(rel => {
    const sourceEntity = entities.find(e => e.id === rel.source);
    const targetEntity = entities.find(e => e.id === rel.target);
    return filteredEntities.includes(sourceEntity!) && filteredEntities.includes(targetEntity!);
  });

  return (
    <div className={cn('bg-white rounded-lg shadow-sm border', className)}>
      {/* En-tête avec contrôles */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Network className="h-5 w-5 mr-2" />
              Graphique de Dépendances EBIOS RM
            </h3>
            <p className="text-sm text-gray-600">
              {filteredEntities.length} entités • {filteredRelationships.length} relations
              {suggestions.length > 0 && ` • ${suggestions.length} suggestions IA`}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Filtres */}
            <select
              value={filterWorkshop || ''}
              onChange={(e) => setFilterWorkshop(e.target.value ? parseInt(e.target.value) : null)}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="">Tous les ateliers</option>
              <option value="1">Atelier 1</option>
              <option value="2">Atelier 2</option>
              <option value="3">Atelier 3</option>
              <option value="4">Atelier 4</option>
              <option value="5">Atelier 5</option>
            </select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSuggestions(!showSuggestions)}
              className={showSuggestions ? 'bg-purple-50 text-purple-700' : ''}
            >
              {showSuggestions ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              Suggestions IA
            </Button>
            
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Zone de graphique */}
      <div className="relative">
        <svg
          ref={svgRef}
          width="800"
          height="600"
          className="w-full h-auto"
          viewBox="0 0 800 600"
        >
          {/* Définitions pour les marqueurs de flèches */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#6B7280"
              />
            </marker>
            <marker
              id="arrowhead-ai"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#8B5CF6"
              />
            </marker>
          </defs>

          {/* Relations */}
          {filteredRelationships.map((relationship) => {
            const sourcePos = layout[relationship.source];
            const targetPos = layout[relationship.target];
            
            if (!sourcePos || !targetPos) return null;
            
            return (
              <g key={relationship.id}>
                <line
                  x1={sourcePos.x}
                  y1={sourcePos.y}
                  x2={targetPos.x}
                  y2={targetPos.y}
                  stroke={getRelationshipColor(relationship)}
                  strokeWidth={relationship.strength * 3 + 1}
                  strokeOpacity={0.7}
                  markerEnd={relationship.aiGenerated ? "url(#arrowhead-ai)" : "url(#arrowhead)"}
                  className="cursor-pointer hover:stroke-opacity-100"
                  onClick={() => {
                    setSelectedRelationship(relationship.id);
                    onRelationshipClick?.(relationship);
                  }}
                />
                {relationship.aiGenerated && (
                  <circle
                    cx={(sourcePos.x + targetPos.x) / 2}
                    cy={(sourcePos.y + targetPos.y) / 2}
                    r="3"
                    fill="#8B5CF6"
                    className="animate-pulse"
                  />
                )}
              </g>
            );
          })}

          {/* Entités */}
          {filteredEntities.map((entity) => {
            const pos = layout[entity.id];
            if (!pos) return null;
            
            const isSelected = selectedEntity === entity.id;
            const radius = isSelected ? 25 : 20;
            
            return (
              <g key={entity.id}>
                {/* Cercle principal */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={radius}
                  fill={getEntityColor(entity)}
                  stroke={isSelected ? '#1F2937' : 'white'}
                  strokeWidth={isSelected ? 3 : 2}
                  className="cursor-pointer hover:opacity-80 transition-all"
                  onClick={() => {
                    setSelectedEntity(entity.id);
                    onEntityClick?.(entity);
                  }}
                />
                
                {/* Indicateur de validation */}
                {entity.validationStatus && (
                  <circle
                    cx={pos.x + 15}
                    cy={pos.y - 15}
                    r="6"
                    fill={getValidationColor(entity.validationStatus)}
                    stroke="white"
                    strokeWidth="2"
                  />
                )}
                
                {/* Indicateur de suggestions IA */}
                {entity.aiSuggestions && entity.aiSuggestions > 0 && (
                  <circle
                    cx={pos.x - 15}
                    cy={pos.y - 15}
                    r="8"
                    fill="#8B5CF6"
                    stroke="white"
                    strokeWidth="2"
                    className="animate-pulse"
                  />
                )}
                
                {/* Texte */}
                <text
                  x={pos.x}
                  y={pos.y + 35}
                  textAnchor="middle"
                  className="text-xs font-medium fill-gray-700"
                  style={{ fontSize: '10px' }}
                >
                  {entity.name.length > 15 ? entity.name.substring(0, 15) + '...' : entity.name}
                </text>
                
                {/* Workshop badge */}
                <text
                  x={pos.x}
                  y={pos.y + 3}
                  textAnchor="middle"
                  className="text-xs font-bold fill-white"
                  style={{ fontSize: '8px' }}
                >
                  W{entity.workshop}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Overlay pour les suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg border p-4 max-w-sm">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <Zap className="h-4 w-4 mr-2 text-purple-600" />
              Suggestions IA ({suggestions.length})
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="p-2 bg-purple-50 rounded border">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-gray-700">{suggestion.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-purple-600">
                          Confiance: {Math.round(suggestion.confidence * 100)}%
                        </span>
                        <span className={cn(
                          'text-xs px-1 rounded',
                          suggestion.impact === 'high' ? 'bg-red-100 text-red-700' :
                          suggestion.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        )}>
                          {suggestion.impact}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onSuggestionApply?.(suggestion)}
                      className="ml-2 text-xs"
                    >
                      Appliquer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Légende */}
      <div className="p-4 border-t bg-gray-50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Types d'entités</h5>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>Valeurs métier</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Événements redoutés</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Actifs supports</span>
              </div>
            </div>
          </div>
          
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Validation</h5>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>Validé</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-3 h-3 text-yellow-500" />
                <span>Attention</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-3 h-3 text-red-500" />
                <span>Erreur</span>
              </div>
            </div>
          </div>
          
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Relations</h5>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-gray-500"></div>
                <span>Relation standard</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-purple-500"></div>
                <span>Suggérée par IA</span>
              </div>
            </div>
          </div>
          
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Indicateurs</h5>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse"></div>
                <span>Suggestions IA</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DependencyGraph;
