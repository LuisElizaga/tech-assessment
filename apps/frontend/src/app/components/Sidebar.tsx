import React from 'react';
import styled from 'styled-components';
import logoUcademy from '../../assets/logoUcademy.png';

interface SidebarProps {
  activeItem?: string;
}

const SidebarContainer = styled.div`
  width: 240px;
  height: 100vh;
  background-color: #ffffff;
  border-right: 1px solid #e5e5e7;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
`;

const LogoSection = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #e5e5e7;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LogoIcon = styled.img`
  width: 32px;
  height: 32px;
  object-fit: contain;
`;

const LogoText = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
`;

const MenuSection = styled.div`
  flex: 1;
  padding: 24px 0;
`;

const MenuItem = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  margin: 4px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${props => props.active ? '#f0fdf4' : 'transparent'};
  color: ${props => props.active ? '#10b981' : '#6b7280'};
  font-weight: ${props => props.active ? '600' : '400'};

  &:hover {
    background-color: ${props => props.active ? '#f0fdf4' : '#f8f9fa'};
    color: ${props => props.active ? '#10b981' : '#1a1a1a'};
  }
`;

const MenuIcon = styled.div<{ active?: boolean }>`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.active ? '#10b981' : '#6b7280'};
`;

const MenuText = styled.span`
  font-size: 14px;
`;

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);


export const Sidebar: React.FC<SidebarProps> = ({ activeItem = 'alumnos' }) => {
  return (
    <SidebarContainer>
      <LogoSection>
        <LogoIcon src={logoUcademy} alt="Ucademy Logo" />
        <LogoText>Ucademy</LogoText>
      </LogoSection>

      <MenuSection>
        <MenuItem active={activeItem === 'alumnos'}>
          <MenuIcon active={activeItem === 'alumnos'}>
            <UserIcon />
          </MenuIcon>
          <MenuText>Alumnos</MenuText>
        </MenuItem>
      </MenuSection>
    </SidebarContainer>
  );
};