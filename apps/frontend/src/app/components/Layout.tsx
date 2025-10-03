import React from 'react';
import styled from 'styled-components';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
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

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <Sidebar activeItem="alumnos" />
      <MainContent>
        {children}
      </MainContent>
    </LayoutContainer>
  );
};