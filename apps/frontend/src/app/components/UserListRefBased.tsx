import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { UserModal } from './UserModal';
import { ConfirmModal } from './ConfirmModal';

interface User {
  id: { $oid: string };
  name: string;
  lastName: string;
  username: string;
  email: string;
  phone: string | null;
  isActive: boolean;
}

interface UsersResponse {
  data: User[];
  metadata: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

const Container = styled.div`
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
`;

const TitleSection = styled.div``;

const Title = styled.h1`
  font-size: 32px;
  color: #1a1a1a;
  margin: 0;
`;

const Subtitle = styled.p`
  color: #6b7280;
  margin: 4px 0 0 0;
`;

const HeaderControls = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const SearchInput = styled.input`
  padding: 10px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  width: 300px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const SearchButton = styled.button`
  background-color: #6b7280;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #4b5563;
  }
`;

const AddButton = styled.button`
  background-color: #10b981;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #059669;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const Thead = styled.thead`
  background: #f8f9fa;
`;

const Th = styled.th<{ width?: string }>`
  text-align: left;
  padding: 16px;
  font-weight: 600;
  color: #495057;
  font-size: 14px;
  border-bottom: 2px solid #e9ecef;
  width: ${props => props.width || 'auto'};
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  border-bottom: 1px solid #e9ecef;
  transition: background-color 0.2s;
  cursor: pointer;

  &:hover {
    background-color: #f8f9fa;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const Td = styled.td`
  padding: 16px;
  color: #212529;
  font-size: 14px;
`;

const StatusBadge = styled.span<{ isActive: boolean }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${props => props.isActive ? '#d4edda' : '#f8d7da'};
  color: ${props => props.isActive ? '#155724' : '#721c24'};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button<{ variant: 'edit' | 'delete' }>`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  ${props => props.variant === 'edit' ? `
    background-color: #3b82f6;
    color: white;
    &:hover {
      background-color: #2563eb;
    }
  ` : `
    background-color: #ef4444;
    color: white;
    &:hover {
      background-color: #dc2626;
    }
  `}
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  gap: 8px;
`;

const PaginationInfo = styled.div`
  color: #6c757d;
  font-size: 14px;
  margin-right: 16px;
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const PageButton = styled.button<{ disabled?: boolean; active?: boolean }>`
  padding: 8px 12px;
  border: 1px solid #d0d0d0;
  background: ${props => props.active ? '#10b981' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border-radius: 6px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  font-size: 14px;
  transition: all 0.2s;
  min-width: 40px;

  &:hover:not(:disabled) {
    background: ${props => props.active ? '#10b981' : '#f8f9fa'};
    border-color: #10b981;
  }
`;

const PageEllipsis = styled.span`
  padding: 8px 4px;
  color: #6c757d;
  font-size: 14px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 18px;
  color: #6c757d;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: #10b981;
  }

  &:checked + span:before {
    transform: translateX(20px);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #d1d5db;
  transition: 0.2s;
  border-radius: 24px;

  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.2s;
    border-radius: 50%;
  }
`;

interface UserListRefBasedProps {
  onUserClick: (userId: string) => void;
  onShowToast: (message: string) => void;
}

export const UserListRefBased: React.FC<UserListRefBasedProps> = ({ onUserClick, onShowToast }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [metadata, setMetadata] = useState({
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDeactivate, setUserToDeactivate] = useState<User | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '50',
      });

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await axios.get<UsersResponse>(
        `http://localhost:3000/api/users?${params}`
      );

      setUsers(response.data.data);
      setMetadata(response.data.metadata);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handlePrevPage = useCallback(() => {
    if (metadata.hasPrevPage) {
      setPage(prev => prev - 1);
    }
  }, [metadata.hasPrevPage]);

  const handleNextPage = useCallback(() => {
    if (metadata.hasNextPage) {
      setPage(prev => prev + 1);
    }
  }, [metadata.hasNextPage]);

  const handlePageClick = useCallback((pageNumber: number) => {
    setPage(pageNumber);
  }, []);

  const renderPaginationButtons = () => {
    const { totalPages } = metadata;
    const currentPage = page;
    const buttons = [];

    // Siempre mostrar primera página
    buttons.push(
      <PageButton
        key={1}
        active={currentPage === 1}
        onClick={() => handlePageClick(1)}
      >
        1
      </PageButton>
    );

    // Mostrar puntos suspensivos si hay un salto
    if (currentPage > 4) {
      buttons.push(<PageEllipsis key="ellipsis1">...</PageEllipsis>);
    }

    // Mostrar páginas alrededor de la página actual
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      buttons.push(
        <PageButton
          key={i}
          active={currentPage === i}
          onClick={() => handlePageClick(i)}
        >
          {i}
        </PageButton>
      );
    }

    // Mostrar puntos suspensivos si hay un salto
    if (currentPage < totalPages - 3) {
      buttons.push(<PageEllipsis key="ellipsis2">...</PageEllipsis>);
    }

    // Siempre mostrar última página si hay más de 1 página
    if (totalPages > 1) {
      buttons.push(
        <PageButton
          key={totalPages}
          active={currentPage === totalPages}
          onClick={() => handlePageClick(totalPages)}
        >
          {totalPages}
        </PageButton>
      );
    }

    return buttons;
  };

  const openCreateModal = useCallback(() => {
    setSelectedUser(null);
    setIsUserModalOpen(true);
  }, []);

  const openEditModal = useCallback((user: User) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  }, []);

  const openDeactivateModal = useCallback((user: User) => {
    setUserToDeactivate(user);
    setIsConfirmModalOpen(true);
  }, []);

  const closeUserModal = useCallback(() => {
    setIsUserModalOpen(false);
    setSelectedUser(null);
  }, []);

  const closeConfirmModal = useCallback(() => {
    setIsConfirmModalOpen(false);
    setUserToDeactivate(null);
    // Limpiar datos pendientes si se cancela
    if ((window as any).pendingUserData) {
      delete (window as any).pendingUserData;
    }
  }, []);

  const handleCreateUser = useCallback(async (userData: Omit<User, 'id'>) => {
    try {
      await axios.post('http://localhost:3000/api/users', userData);
      closeUserModal();
      onShowToast('Registro guardado correctamente');
      fetchUsers();
    } catch (err) {
      console.error('Error creating user:', err);
    }
  }, [fetchUsers, closeUserModal, onShowToast]);

  const handleUpdateUser = useCallback(async (userData: Omit<User, 'id'>) => {
    if (!selectedUser?.id?.$oid) return;
    try {
      await axios.put(`http://localhost:3000/api/users/${selectedUser.id.$oid}`, userData);
      closeUserModal();
      onShowToast('Registro guardado correctamente');
      fetchUsers();
    } catch (err) {
      console.error('Error updating user:', err);
    }
  }, [selectedUser, fetchUsers, closeUserModal, onShowToast]);

  const handleDeactivateUser = useCallback(async () => {
    if (!userToDeactivate?.id?.$oid) return;
    try {
      // Usar los datos pendientes si están disponibles, si no solo desactivar
      const pendingData = (window as any).pendingUserData;
      if (pendingData) {
        await axios.put(`http://localhost:3000/api/users/${userToDeactivate.id.$oid}`, pendingData);
        // Limpiar datos pendientes
        delete (window as any).pendingUserData;
      } else {
        await axios.patch(`http://localhost:3000/api/users/${userToDeactivate.id.$oid}/deactivate`);
      }
      closeConfirmModal();
      closeUserModal(); // También cerrar el modal de usuario
      onShowToast('Registro guardado correctamente');
      fetchUsers();
    } catch (err) {
      console.error('Error deactivating user:', err);
    }
  }, [userToDeactivate, fetchUsers, closeConfirmModal, closeUserModal, onShowToast]);

  const handleToggleStatus = useCallback(async (user: User) => {
    if (user.isActive) {
      // Si se desactiva, mostrar confirmación
      setUserToDeactivate(user);
      setIsConfirmModalOpen(true);
    } else {
      // Si se activa, hacerlo directamente
      try {
        await axios.put(`http://localhost:3000/api/users/${user.id.$oid}`, {
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          isActive: true
        });
        fetchUsers();
      } catch (err) {
        console.error('Error activating user:', err);
      }
    }
  }, [fetchUsers]);

  const handleSearchInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  }, []);

  const handleSearchSubmit = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchTerm(searchInput);
    setPage(1); // Volver a la primera página al buscar
  }, [searchInput]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  }, [handleSearchSubmit]);

  const handleClearSearch = useCallback(() => {
    setSearchInput('');
    setSearchTerm('');
    setPage(1);
  }, []);

  const handleUserModalSave = useCallback((userData: Omit<User, 'id'>, isDeactivating?: boolean) => {
    if (isDeactivating && selectedUser) {
      // Guardar el usuario a desactivar y mostrar modal de confirmación
      setUserToDeactivate(selectedUser);
      setIsConfirmModalOpen(true);
      // Guardar los datos actualizados temporalmente
      (window as any).pendingUserData = userData;
    } else {
      // Flujo normal de guardado
      if (selectedUser) {
        handleUpdateUser(userData);
      } else {
        handleCreateUser(userData);
      }
    }
  }, [selectedUser, handleUpdateUser, handleCreateUser]);

  if (loading) {
    return (
      <Container>
        <LoadingContainer>Loading users...</LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <TitleSection>
          <Title>Alumnos</Title>
          <Subtitle>{metadata.totalItems} elementos</Subtitle>
        </TitleSection>
        <HeaderControls>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Buscar por nombre, apellido, usuario, email o teléfono..."
              value={searchInput}
              onChange={handleSearchInputChange}
              onKeyPress={handleKeyPress}
            />
            <SearchButton onClick={handleSearchSubmit}>
              Buscar
            </SearchButton>
            {searchTerm && (
              <SearchButton onClick={handleClearSearch} style={{ backgroundColor: '#ef4444' }}>
                Limpiar
              </SearchButton>
            )}
          </SearchContainer>
          <AddButton onClick={openCreateModal}>
            + Nuevo alumno
          </AddButton>
        </HeaderControls>
      </Header>

      <Table>
        <Thead>
          <tr>
            <Th width="100px"></Th>
            <Th width="25%">Nombre y apellidos</Th>
            <Th>Usuario</Th>
            <Th width="25%">Email</Th>
            <Th>Móvil</Th>
          </tr>
        </Thead>
        <Tbody>
          {users.map((user) => (
            <Tr key={user.id?.$oid || Math.random()} onClick={() => user.id?.$oid && onUserClick(user.id.$oid)}>
              <Td>
                <StatusBadge isActive={user.isActive}>
                  {user.isActive ? 'Activo' : 'Inactivo'}
                </StatusBadge>
              </Td>
              <Td>{user.name || '-'} {user.lastName || '-'}</Td>
              <Td>{user.username || '-'}</Td>
              <Td>{user.email || '-'}</Td>
              <Td>{user.phone || '-'}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <PaginationContainer>
        <PaginationInfo>
          {metadata.totalItems} elementos
        </PaginationInfo>
        <PaginationButtons>
          {renderPaginationButtons()}
        </PaginationButtons>
        <div style={{ color: '#6c757d', fontSize: '14px' }}>
          {page} de {metadata.totalPages} páginas
        </div>
      </PaginationContainer>

      <UserModal
        isOpen={isUserModalOpen}
        user={selectedUser}
        onSave={handleUserModalSave}
        onCancel={closeUserModal}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        title="Desactivar cuenta de alumno"
        message={`¿Estás seguro de que quieres desactivar la cuenta de ${userToDeactivate?.name} ${userToDeactivate?.lastName}? El alumno dejará de tener acceso a la plataforma.`}
        confirmText="Desactivar cuenta"
        cancelText="Cancelar"
        onConfirm={handleDeactivateUser}
        onCancel={closeConfirmModal}
        type="danger"
      />
    </Container>
  );
};