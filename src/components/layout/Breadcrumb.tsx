import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { ROUTES } from '../../constants';

export const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
      <Link to={ROUTES.DASHBOARD} className="flex items-center gap-1 hover:text-white transition-colors">
        <Home className="w-3.5 h-3.5 text-neutral-500" />
        <span>SortBench</span>
      </Link>

      {pathSegments.map((segment, index) => {
        const url = `/${pathSegments.slice(0, index + 1).join('/')}`;
        const isLast = index === pathSegments.length - 1;

        return (
          <React.Fragment key={url}>
            <ChevronRight className="w-3 h-3 text-neutral-600 shrink-0" />
            {isLast ? (
              <span className="text-blue-400 font-semibold capitalize">{segment}</span>
            ) : (
              <Link to={url} className="hover:text-white transition-colors capitalize">
                {segment}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
