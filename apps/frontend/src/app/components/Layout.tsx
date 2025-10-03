import React from 'react';
import styled from 'styled-components';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  onNavigateHome?: () => void;
}

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f7;
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 240px;
  min-height: 100vh;
`;

export const Layout: React.FC<LayoutProps> = ({ children, onNavigateHome }) => {
  return (
    <LayoutContainer>
      <Sidebar activeItem="alumnos" onMenuClick={onNavigateHome} />
      <MainContent>
        {children}
      </MainContent>
    </LayoutContainer>
  );
};