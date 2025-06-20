/**
 * 🧭 COMPOSANT BREADCRUMBS POUR NOTIFICATIONS
 * Navigation contextuelle avec fil d'Ariane
 */

import React from 'react';
import { ChevronRight, Home, ArrowLeft, ExternalLink } from 'lucide-react';
import type { NotificationContext } from '../../types/notifications';
import { notificationNavigation } from '../../services/NotificationNavigation';

// 🎯 PROPS DU COMPOSANT
interface NotificationBreadcrumbsProps {
  context: NotificationContext;
  className?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  maxItems?: number;
  onNavigate?: (url: string) => void;
}

// 🎯 INTERFACE POUR UN ÉLÉMENT DE BREADCRUMB
interface BreadcrumbItem {
  label: string;
  url?: string;
  active: boolean;
  icon?: React.ReactNode;
  external?: boolean;
}

/**
 * 🧭 COMPOSANT PRINCIPAL
 */
export const NotificationBreadcrumbs: React.FC<NotificationBreadcrumbsProps> = ({
  context,
  className = '',
  showBackButton = true,
  showHomeButton = true,
  maxItems = 5,
  onNavigate
}) => {

  // 🧭 GÉNÉRER LES BREADCRUMBS
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [];

    // Accueil
    if (showHomeButton) {
      breadcrumbs.push({
        label: 'Accueil',
        url: '/',
        active: false,
        icon: <Home className="w-4 h-4" />
      });
    }

    // Mission
    if (context.missionId) {
      breadcrumbs.push({
        label: `Mission ${context.missionId}`,
        url: `/missions/${context.missionId}`,
        active: false
      });

      // Atelier
      if (context.workshopId) {
        breadcrumbs.push({
          label: `Atelier ${context.workshopId}`,
          url: `/missions/${context.missionId}/workshops/${context.workshopId}`,
          active: !context.stepId
        });

        // Étape
        if (context.stepId) {
          breadcrumbs.push({
            label: getStepLabel(context.stepId),
            url: `/missions/${context.missionId}/workshops/${context.workshopId}?step=${context.stepId}`,
            active: true
          });
        }
      }
    }

    // Rapport
    if (context.reportId) {
      breadcrumbs.push({
        label: 'Rapports',
        url: '/reports',
        active: false
      });
      breadcrumbs.push({
        label: `Rapport ${context.reportId}`,
        url: `/reports/${context.reportId}`,
        active: true
      });
    }

    // Module de formation
    if (context.moduleId) {
      breadcrumbs.push({
        label: 'Formation',
        url: '/training',
        active: false
      });
      breadcrumbs.push({
        label: getModuleLabel(context.moduleId),
        url: `/training/${context.moduleId}`,
        active: true
      });
    }

    // Limiter le nombre d'éléments
    if (breadcrumbs.length > maxItems) {
      const start = breadcrumbs.slice(0, 1);
      const end = breadcrumbs.slice(-(maxItems - 2));
      return [
        ...start,
        { label: '...', url: undefined, active: false },
        ...end
      ];
    }

    return breadcrumbs;
  };

  // 🏷️ OBTENIR LE LABEL D'UNE ÉTAPE
  const getStepLabel = (stepId: string): string => {
    const stepLabels: Record<string, string> = {
      'socle-securite': 'Socle de sécurité',
      'biens-essentiels': 'Biens essentiels',
      'sources-menaces': 'Sources de menaces',
      'evenements-redoutes': 'Événements redoutés',
      'scenarios-strategiques': 'Scénarios stratégiques',
      'scenarios-operationnels': 'Scénarios opérationnels',
      'mesures-securite': 'Mesures de sécurité'
    };
    return stepLabels[stepId] || stepId;
  };

  // 📚 OBTENIR LE LABEL D'UN MODULE
  const getModuleLabel = (moduleId: string): string => {
    const moduleLabels: Record<string, string> = {
      'ebios-basics': 'EBIOS RM - Bases',
      'ebios-advanced': 'EBIOS RM - Avancé',
      'risk-analysis': 'Analyse de risques',
      'security-measures': 'Mesures de sécurité',
      'compliance': 'Conformité ANSSI'
    };
    return moduleLabels[moduleId] || moduleId;
  };

  // 🖱️ GÉRER LA NAVIGATION
  const handleNavigate = (url: string) => {
    if (onNavigate) {
      onNavigate(url);
    } else {
      window.location.href = url;
    }
  };

  // ⬅️ GÉRER LE BOUTON RETOUR
  const handleBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      {/* Bouton retour */}
      {showBackButton && (
        <button
          onClick={handleBack}
          className="flex items-center space-x-1 px-2 py-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
          title="Retour"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Retour</span>
        </button>
      )}

      {/* Séparateur */}
      {showBackButton && breadcrumbs.length > 0 && (
        <ChevronRight className="w-4 h-4 text-gray-400" />
      )}

      {/* Breadcrumbs */}
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((item, index) => (
          <li key={index} className="flex items-center">
            {/* Séparateur */}
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
            )}

            {/* Élément */}
            {item.url && !item.active ? (
              <button
                onClick={() => handleNavigate(item.url!)}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                {item.icon}
                <span>{item.label}</span>
                {item.external && <ExternalLink className="w-3 h-3" />}
              </button>
            ) : (
              <span className={`flex items-center space-x-1 ${
                item.active 
                  ? 'text-gray-900 font-medium' 
                  : 'text-gray-500'
              }`}>
                {item.icon}
                <span>{item.label}</span>
              </span>
            )}
          </li>
        ))}
      </ol>

      {/* Indicateur de source notification */}
      {context.metadata?.source === 'notification' && (
        <div className="flex items-center space-x-1 ml-4 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          <span>Via notification</span>
        </div>
      )}
    </nav>
  );
};

// 🎯 COMPOSANT BREADCRUMBS COMPACT
export const CompactBreadcrumbs: React.FC<{
  context: NotificationContext;
  className?: string;
}> = ({ context, className = '' }) => {
  const getCurrentLocation = (): string => {
    if (context.stepId && context.workshopId) {
      return `Atelier ${context.workshopId} - ${getStepLabel(context.stepId)}`;
    }
    if (context.workshopId) {
      return `Atelier ${context.workshopId}`;
    }
    if (context.missionId) {
      return `Mission ${context.missionId}`;
    }
    if (context.reportId) {
      return `Rapport ${context.reportId}`;
    }
    if (context.moduleId) {
      return getModuleLabel(context.moduleId);
    }
    return 'Page actuelle';
  };

  const getStepLabel = (stepId: string): string => {
    const stepLabels: Record<string, string> = {
      'socle-securite': 'Socle de sécurité',
      'biens-essentiels': 'Biens essentiels',
      'sources-menaces': 'Sources de menaces',
      'evenements-redoutes': 'Événements redoutés',
      'scenarios-strategiques': 'Scénarios stratégiques',
      'scenarios-operationnels': 'Scénarios opérationnels',
      'mesures-securite': 'Mesures de sécurité'
    };
    return stepLabels[stepId] || stepId;
  };

  const getModuleLabel = (moduleId: string): string => {
    const moduleLabels: Record<string, string> = {
      'ebios-basics': 'EBIOS RM - Bases',
      'ebios-advanced': 'EBIOS RM - Avancé',
      'risk-analysis': 'Analyse de risques',
      'security-measures': 'Mesures de sécurité',
      'compliance': 'Conformité ANSSI'
    };
    return moduleLabels[moduleId] || moduleId;
  };

  return (
    <div className={`flex items-center space-x-2 text-sm text-gray-600 ${className}`}>
      <Home className="w-4 h-4" />
      <ChevronRight className="w-3 h-3" />
      <span className="font-medium text-gray-900">{getCurrentLocation()}</span>
      
      {context.metadata?.source === 'notification' && (
        <span className="w-2 h-2 bg-blue-500 rounded-full" title="Navigation depuis notification"></span>
      )}
    </div>
  );
};

// 🎯 HOOK POUR UTILISER LES BREADCRUMBS
export const useBreadcrumbs = (context: NotificationContext) => {
  const breadcrumbs = React.useMemo(() => {
    return notificationNavigation.generateBreadcrumbs(context);
  }, [context]);

  const currentPage = React.useMemo(() => {
    const activeBreadcrumb = breadcrumbs.find(b => b.active);
    return activeBreadcrumb?.label || 'Page actuelle';
  }, [breadcrumbs]);

  const parentPage = React.useMemo(() => {
    const activeIndex = breadcrumbs.findIndex(b => b.active);
    if (activeIndex > 0) {
      return breadcrumbs[activeIndex - 1];
    }
    return null;
  }, [breadcrumbs]);

  return {
    breadcrumbs,
    currentPage,
    parentPage,
    canGoBack: parentPage !== null
  };
};

export default NotificationBreadcrumbs;
