import React from 'react';
import { MainContent } from './MainContent';

export interface AppLayoutProps {
  children?: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = () => {
  return <MainContent />;
};

export const DashboardLayout: React.FC<AppLayoutProps> = AppLayout;
