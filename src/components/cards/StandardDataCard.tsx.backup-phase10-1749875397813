import React from 'react';
import { MoreVertical, Edit, Trash2, Eye, ExternalLink } from 'lucide-react';
import Button from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface StandardDataCardProps {
  title: string;
  description?: string;
  status?: 'draft' | 'active' | 'completed' | 'archived';
  priority?: 1 | 2 | 3 | 4;
  metadata?: Array<{
    label: string;
    value: string | number;
    type?: 'text' | 'badge' | 'progress' | 'score';
    color?: 'gray' | 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'orange';
  }>;
  actions?: Array<{
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
  }>;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isSelected?: boolean;
  showMenu?: boolean;
}

/**
 * 🎨 COMPOSANT DE CARTE DE DONNÉES STANDARDISÉ
 * Harmonise l'affichage des entités EBIOS RM (valeurs métier, sources de risque, etc.)
 */
const StandardDataCard: React.FC<StandardDataCardProps> = ({
  title,
  description,
  status,
  priority,
  metadata = [],
  actions = [],
  children,
  className = '',
  onClick,
  isSelected = false,
  showMenu = true
}) => {

  // 🎨 Couleurs de statut
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // 🎨 Couleurs de priorité
  const getPriorityColor = (priority?: number) => {
    switch (priority) {
      case 4: return 'bg-red-100 text-red-800 border-red-200';
      case 3: return 'bg-orange-100 text-orange-800 border-orange-200';
      case 2: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 1: return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // 🎨 Couleurs de métadonnées
  const getMetadataColor = (color?: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-100 text-blue-800';
      case 'green': return 'bg-green-100 text-green-800';
      case 'yellow': return 'bg-yellow-100 text-yellow-800';
      case 'red': return 'bg-red-100 text-red-800';
      case 'purple': return 'bg-purple-100 text-purple-800';
      case 'orange': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderMetadataItem = (item: any, index: number) => {
    switch (item.type) {
      case 'badge':
        return (
          <span 
            key={index}
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getMetadataColor(item.color)}`}
          >
            {item.value}
          </span>
        );
      case 'progress':
        return (
          <div key={index} className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">{item.label}:</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${item.value}%` }}
              />
            </div>
            <span className="text-sm font-medium">{item.value}%</span>
          </div>
        );
      case 'score':
        return (
          <div key={index} className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">{item.label}:</span>
            <span className={`text-sm font-medium ${
              Number(item.value) >= 3 ? 'text-green-600' : 
              Number(item.value) >= 2 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {item.value}/4
            </span>
          </div>
        );
      default:
        return (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{item.label}:</span>
            <span className="text-sm font-medium text-gray-900">{item.value}</span>
          </div>
        );
    }
  };

  return (
    <div 
      className={cn(
        'bg-white border rounded-lg p-6 transition-all duration-200',
        'hover:shadow-md hover:border-gray-300',
        {
          'border-blue-300 shadow-md': isSelected,
          'cursor-pointer': !!onClick,
          'border-gray-200': !isSelected
        },
        className
      )}
      onClick={onClick}
    >
      {/* 📋 EN-TÊTE DE LA CARTE */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900 truncate">
            {title}
          </h3>
          {description && (
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
              {description}
            </p>
          )}
        </div>

        {/* 🏷️ BADGES DE STATUT ET PRIORITÉ */}
        <div className="flex items-center space-x-2 ml-4">
          {status && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
              {status}
            </span>
          )}
          {priority && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(priority)}`}>
              P{priority}
            </span>
          )}
          
          {/* 🔧 MENU D'ACTIONS */}
          {showMenu && actions.length > 0 && (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  // Logique de menu à implémenter
                }}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 📊 MÉTADONNÉES */}
      {metadata.length > 0 && (
        <div className="space-y-2 mb-4">
          {metadata.map((item, index) => renderMetadataItem(item, index))}
        </div>
      )}

      {/* 📝 CONTENU PERSONNALISÉ */}
      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}

      {/* 🎯 ACTIONS RAPIDES */}
      {actions.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant={action.variant || 'outline'}
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick();
                }}
                disabled={action.disabled}
                className="flex items-center space-x-1"
              >
                {Icon && <Icon className="h-3 w-3" />}
                <span>{action.label}</span>
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StandardDataCard;
