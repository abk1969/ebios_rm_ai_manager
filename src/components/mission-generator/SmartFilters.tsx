/**
 * 🔍 FILTRES INTELLIGENTS POUR LE GÉNÉRATEUR
 * Composant de filtres avancés avec suggestions contextuelles
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Filter, 
  Search, 
  X, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Building2,
  Shield,
  Cpu,
  Globe
} from 'lucide-react';

interface SmartFiltersProps {
  onFilterChange: (filters: any) => void;
  selectedSector?: string;
  selectedSize?: string;
}

const SmartFilters: React.FC<SmartFiltersProps> = ({ 
  onFilterChange, 
  selectedSector, 
  selectedSize 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    category: '',
    size: '',
    technology: '',
    compliance: '',
    region: ''
  });

  const filterCategories = [
    {
      id: 'sector',
      name: 'Secteur',
      icon: Building2,
      options: [
        { value: 'public', label: 'Secteur Public', count: 15 },
        { value: 'santé', label: 'Santé', count: 12 },
        { value: 'finance', label: 'Finance', count: 18 },
        { value: 'industrie', label: 'Industrie', count: 22 },
        { value: 'tech', label: 'Technologies', count: 14 }
      ]
    },
    {
      id: 'size',
      name: 'Taille',
      icon: Globe,
      options: [
        { value: 'tpe', label: 'TPE/PME', count: 8 },
        { value: 'eti', label: 'ETI', count: 5 },
        { value: 'ge', label: 'Grande Entreprise', count: 12 },
        { value: 'public', label: 'Secteur Public', count: 10 }
      ]
    },
    {
      id: 'technology',
      name: 'Technologies',
      icon: Cpu,
      options: [
        { value: 'cloud', label: 'Cloud', count: 25 },
        { value: 'erp', label: 'ERP', count: 18 },
        { value: 'security', label: 'Sécurité', count: 22 },
        { value: 'data', label: 'Data/IA', count: 15 }
      ]
    },
    {
      id: 'compliance',
      name: 'Conformité',
      icon: Shield,
      options: [
        { value: 'rgpd', label: 'RGPD', count: 45 },
        { value: 'iso27001', label: 'ISO 27001', count: 30 },
        { value: 'secteur', label: 'Sectorielle', count: 28 },
        { value: 'anssi', label: 'ANSSI', count: 15 }
      ]
    }
  ];

  const quickFilters = [
    { label: 'Hôpitaux', filters: { sector: 'santé', size: 'ge', compliance: 'hds' } },
    { label: 'Banques', filters: { sector: 'finance', compliance: 'dora' } },
    { label: 'Startups Tech', filters: { sector: 'tech', size: 'tpe' } },
    { label: 'Administration', filters: { sector: 'public', compliance: 'anssi' } },
    { label: 'Industrie 4.0', filters: { sector: 'industrie', technology: 'iot' } }
  ];

  const applyQuickFilter = (quickFilter: any) => {
    setActiveFilters(quickFilter.filters);
    onFilterChange(quickFilter.filters);
  };

  const clearFilters = () => {
    setActiveFilters({
      category: '',
      size: '',
      technology: '',
      compliance: '',
      region: ''
    });
    onFilterChange({});
  };

  const activeFilterCount = Object.values(activeFilters).filter(v => v).length;

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-blue-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-600" />
            Filtres Intelligents
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {activeFilterCount}
              </Badge>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Filtres rapides */}
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            Filtres rapides
          </div>
          <div className="flex flex-wrap gap-2">
            {quickFilters.map((filter, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => applyQuickFilter(filter)}
                className="text-xs hover:bg-blue-50 hover:border-blue-300"
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Filtres actifs */}
        {activeFilterCount > 0 && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-blue-900">Filtres actifs</div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-blue-700 hover:text-blue-900"
              >
                <X className="h-3 w-3 mr-1" />
                Effacer
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(activeFilters)
                .filter(([_, value]) => value)
                .map(([key, value]) => (
                <Badge 
                  key={key} 
                  variant="secondary" 
                  className="bg-blue-100 text-blue-800"
                >
                  {key}: {value}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Filtres détaillés */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Recherche globale..."
                className="pl-10 border-gray-200"
              />
            </div>

            {filterCategories.map(category => (
              <div key={category.id}>
                <div className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <category.icon className="h-4 w-4" />
                  {category.name}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {category.options.map(option => (
                    <Button
                      key={option.value}
                      variant="outline"
                      size="sm"
                      className={`justify-between text-xs ${
                        activeFilters[category.id as keyof typeof activeFilters] === option.value
                          ? 'bg-blue-50 border-blue-300 text-blue-700'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        const newFilters = {
                          ...activeFilters,
                          [category.id]: activeFilters[category.id as keyof typeof activeFilters] === option.value ? '' : option.value
                        };
                        setActiveFilters(newFilters);
                        onFilterChange(newFilters);
                      }}
                    >
                      <span>{option.label}</span>
                      <Badge variant="secondary" className="text-xs">
                        {option.count}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Suggestions contextuelles */}
        {(selectedSector || selectedSize) && (
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-sm font-medium text-green-900 mb-2 flex items-center gap-1">
              <Sparkles className="h-4 w-4 text-green-600" />
              Suggestions pour votre contexte
            </div>
            <div className="text-xs text-green-700">
              {selectedSector === 'Santé - Établissements hospitaliers privés' && (
                <div>Recommandé : HDS, RGPD, Systèmes hospitaliers, Sécurité renforcée</div>
              )}
              {selectedSector?.includes('Banques') && (
                <div>Recommandé : DORA, PCI-DSS, Core Banking, Sécurité financière</div>
              )}
              {selectedSector?.includes('Administration') && (
                <div>Recommandé : RGS, PGSSI-S, Systèmes publics, Accessibilité</div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartFilters;
