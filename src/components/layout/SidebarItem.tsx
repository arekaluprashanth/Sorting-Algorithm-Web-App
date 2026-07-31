import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../shared/lib/utils';
import { Tooltip } from '../ui/Tooltip';

export interface SidebarItemProps {
  to: string;
  label: string;
  icon: React.ElementType;
  isCollapsed?: boolean;
  badge?: string;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  to,
  label,
  icon: Icon,
  isCollapsed = false,
  badge,
}) => {
  const content = (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group select-none',
          isActive
            ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold shadow-sm'
            : 'text-neutral-400 hover:text-white hover:bg-white/5',
          isCollapsed && 'justify-center px-0'
        )
      }
    >
      <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
      {!isCollapsed && <span className="truncate">{label}</span>}
      {!isCollapsed && badge && (
        <span className="ml-auto text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-neutral-400 border border-white/10">
          {badge}
        </span>
      )}
    </NavLink>
  );

  if (isCollapsed) {
    return <Tooltip content={label} position="right">{content}</Tooltip>;
  }

  return content;
};

export interface SidebarGroupProps {
  title?: string;
  children: React.ReactNode;
  isCollapsed?: boolean;
}

export const SidebarGroup: React.FC<SidebarGroupProps> = ({
  title,
  children,
  isCollapsed = false,
}) => {
  return (
    <div className="space-y-1 py-2">
      {title && !isCollapsed && (
        <div className="px-3 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider font-mono">
          {title}
        </div>
      )}
      {children}
    </div>
  );
};
