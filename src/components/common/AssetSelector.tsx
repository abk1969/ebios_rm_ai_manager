import React, { useState, useMemo } from 'react';
import { Search, Filter, Check, X, Package, Building, Database, Shield } from 'lucide-react';
import type { SupportingAsset, BusinessValue } from '@/types/ebios';

interface AssetSelectorProps<T extends SupportingAsset | BusinessValue> {
  assets: T[];
  selectedIds: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  placeholder?: string;
  maxHeight?: string;
  allowMultiple?: boolean;
  showCategories?: boolean;
  title?: string;
  emptyMessage?: string;
  className?: string;
}

function AssetSelector<T extends SupportingAsset | BusinessValue>({
  assets,
  selectedIds,
  onSelectionChange,
  placeholder = "Rechercher des actifs...",
  maxHeight = "max-h-64",
  allowMultiple = true,
  showCategories = true,
  title = "Sélection d'Actifs",
  emptyMessage = "Aucun actif disponible",
  className = ""
}: AssetSelectorProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isExpanded, setIsExpanded] = useState(false);

  // Extraire les catégories uniques
  const categories = useMemo(() => {
    const cats = new Set<string>();
    assets.forEach(asset => {
      if ('type' in asset) {
        cats.add(asset.type);
      } else if ('category' in asset) {
        cats.add(asset.category || 'autre');
      }
    });
    return Array.from(cats).sort();
  }, [assets]);

  // Filtrer les actifs
  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      // Filtre de recherche
      const matchesSearch = 
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtre de catégorie
      let matchesCategory = true;
      if (categoryFilter !== 'all') {
        if ('type' in asset) {
          matchesCategory = asset.type === categoryFilter;
        } else if ('category' in asset) {
          matchesCategory = (asset.category || 'autre') === categoryFilter;
        }
      }

      return matchesSearch && matchesCategory;
    });
  }, [assets, searchTerm, categoryFilter]);

  const handleAssetToggle = (assetId: string) => {
    if (allowMultiple) {
      const isSelected = selectedIds.includes(assetId);
      if (isSelected) {
        onSelectionChange(selectedIds.filter(id => id !== assetId));
      } else {
        onSelectionChange([...selectedIds, assetId]);
      }
    } else {
      // Mode sélection unique
      if (selectedIds.includes(assetId)) {
        onSelectionChange([]);
      } else {
        onSelectionChange([assetId]);
      }
    }
  };

  const clearSelection = () => {
    onSelectionChange([]);
  };

  const selectAll = () => {
    if (allowMultiple) {
      onSelectionChange(filteredAssets.map(asset => asset.id));
    }
  };

  const getAssetIcon = (asset: T) => {
    if ('type' in asset) {
      // SupportingAsset
      switch (asset.type) {
        case 'data': return <Database className="h-4 w-4 text-blue-500" />;
        case 'software': return <Package className="h-4 w-4 text-green-500" />;
        case 'hardware': return <Shield className="h-4 w-4 text-gray-500" />;
        case 'network': return <Building className="h-4 w-4 text-orange-500" />;
        case 'personnel': return <Building className="h-4 w-4 text-indigo-500" />;
        case 'site': return <Building className="h-4 w-4 text-red-500" />;
        case 'organization': return <Building className="h-4 w-4 text-purple-500" />;
        default: return <Package className="h-4 w-4 text-gray-400" />;
      }
    } else {
      // BusinessValue
      return <Building className="h-4 w-4 text-purple-500" />;
    }
  };

  return (
    <div className={`border border-gray-200 rounded-lg ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
          <div className="flex items-center space-x-2">
            {selectedIds.length > 0 && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {selectedIds.length} sélectionné{selectedIds.length > 1 ? 's' : ''}
              </span>
            )}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-500 hover:text-gray-700"
            >
              {isExpanded ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="mt-3 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filtres étendus */}
        {isExpanded && (
          <div className="mt-3 space-y-3">
            {/* Filtre par catégorie */}
            {showCategories && categories.length > 0 && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Toutes les catégories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Actions rapides */}
            <div className="flex items-center space-x-2">
              {allowMultiple && (
                <button
                  type="button"
                  onClick={selectAll}
                  className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200"
                >
                  Tout sélectionner
                </button>
              )}
              {selectedIds.length > 0 && (
                <button
                  type="button"
                  onClick={clearSelection}
                  className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200"
                >
                  Effacer la sélection
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Liste des actifs */}
      <div className={`${maxHeight} overflow-y-auto`}>
        {filteredAssets.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">{searchTerm ? 'Aucun résultat trouvé' : emptyMessage}</p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-xs text-blue-600 hover:text-blue-800 mt-2"
              >
                Effacer la recherche
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredAssets.map((asset) => {
              const isSelected = selectedIds.includes(asset.id);
              return (
                <label
                  key={asset.id}
                  className={`flex items-start p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <input
                    type={allowMultiple ? "checkbox" : "radio"}
                    checked={isSelected}
                    onChange={() => handleAssetToggle(asset.id)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mt-1"
                  />
                  
                  <div className="ml-3 flex-1">
                    <div className="flex items-center space-x-2">
                      {getAssetIcon(asset)}
                      <div className="text-sm font-medium text-gray-900">
                        {asset.name}
                      </div>
                      {isSelected && (
                        <Check className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    
                    {/* Métadonnées */}
                    <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                      {'type' in asset && (
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          {asset.type}
                        </span>
                      )}
                      {'category' in asset && asset.category && (
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          {asset.category}
                        </span>
                      )}
                      {'criticality' in asset && asset.criticality && (
                        <span className={`px-2 py-1 rounded ${
                          asset.criticality === 'critical' ? 'bg-red-100 text-red-700' :
                          asset.criticality === 'high' ? 'bg-orange-100 text-orange-700' :
                          asset.criticality === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {String(asset.criticality)}
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-1 text-sm text-gray-600">
                      {asset.description}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer avec résumé */}
      {selectedIds.length > 0 && (
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            <strong>{selectedIds.length}</strong> actif{selectedIds.length > 1 ? 's' : ''} sélectionné{selectedIds.length > 1 ? 's' : ''}
            {filteredAssets.length !== assets.length && (
              <span className="ml-2 text-xs text-gray-500">
                (sur {filteredAssets.length} affiché{filteredAssets.length > 1 ? 's' : ''})
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AssetSelector; 