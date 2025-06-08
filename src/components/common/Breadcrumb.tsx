import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  const location = useLocation();

  // Génération automatique du breadcrumb basé sur l'URL si aucun item n'est fourni
  const generateBreadcrumbFromPath = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbItems: BreadcrumbItem[] = [
      { label: 'Accueil', href: '/missions' }
    ];

    // Mapping des segments d'URL vers des labels lisibles
    const pathLabels: Record<string, string> = {
      'missions': 'Missions',
      'ebios-dashboard': 'Tableau de bord IA',
      'workshop-1': 'Atelier 1 - Cadrage',
      'workshop-2': 'Atelier 2 - Sources de risque',
      'workshop-3': 'Atelier 3 - Scénarios stratégiques',
      'workshop-4': 'Atelier 4 - Scénarios opérationnels',
      'workshop-5': 'Atelier 5 - Traitement du risque',
      'workshops': 'Ateliers',
      'reports': 'Rapports',
      'ebios-report': 'Rapport EBIOS',
      'settings': 'Paramètres',
      'app': 'Missions'
    };

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Ignorer les IDs de mission (segments qui ressemblent à des UUIDs)
      if (segment.length > 20 && segment.includes('-')) {
        return;
      }

      const label = pathLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      const isLast = index === pathSegments.length - 1;
      
      breadcrumbItems.push({
        label,
        href: isLast ? undefined : currentPath,
        current: isLast
      });
    });

    return breadcrumbItems;
  };

  const breadcrumbItems = items || generateBreadcrumbFromPath();

  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
            )}
            
            {item.href && !item.current ? (
              <Link
                to={item.href}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                {index === 0 && <Home className="h-4 w-4 mr-1 inline" />}
                {item.label}
              </Link>
            ) : (
              <span className={`text-sm font-medium ${
                item.current 
                  ? 'text-gray-900' 
                  : 'text-gray-500'
              }`}>
                {index === 0 && <Home className="h-4 w-4 mr-1 inline" />}
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
