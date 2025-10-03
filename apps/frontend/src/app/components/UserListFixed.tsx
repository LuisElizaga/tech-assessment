import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { UserModal } from './UserModal';
import { ConfirmModal } from './ConfirmModal';

// Types
interface User {
  id: { $oid: string };
  name: string;
  lastName: string;
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

// Styled Components
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

const FiltersContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  padding: 10px 16px;
  font-size: 14px;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  flex: 1;
  min-width: 250px;

  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
  }
`;

const FilterSelect = styled.select`
  padding: 10px 16px;
  font-size: 14px;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #10b981;
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

const Th = styled.th`
  text-align: left;
  padding: 16px;
  font-weight: 600;
  color: #495057;
  font-size: 14px;
  border-bottom: 2px solid #e9ecef;
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  border-bottom: 1px solid #e9ecef;
  transition: background-color 0.2s;

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
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const PaginationInfo = styled.div`
  color: #6c757d;
  font-size: 14px;
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const PageButton = styled.button<{ disabled?: boolean }>`
  padding: 8px 16px;
  border: 1px solid #d0d0d0;
  background: white;
  border-radius: 6px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  font-size: 14px;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #f8f9fa;
    border-color: #10b981;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 18px;
  color: #6c757d;
`;

// Main Component - Memoized to prevent unnecessary re-renders
export const UserListFixed: React.FC = React.memo(() => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [metadata, setMetadata] = useState({
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Modal states
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDeactivate, setUserToDeactivate] = useState<User | null>(null);

  // Refs for debouncing
  const debounceRef = useRef<NodeJS.Timeout>();
  const searchRef = useRef<string>('');

  // Fetch users function
  const fetchUsers = useCallback(async (search: string, status: string, currentPage: number) => {
    setLoading(true);

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '50',
      });

      if (search) {
        params.append('search', search);
      }

      if (status !== 'all') {
        params.append('isActive', status);
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
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (searchRef.current !== searchTerm) {
        searchRef.current = searchTerm;
        setPage(1);
        fetchUsers(searchTerm, statusFilter, 1);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchTerm, fetchUsers, statusFilter]);

  // Initial load and filter changes
  useEffect(() => {
    fetchUsers(searchTerm, statusFilter, page);
  }, [page, statusFilter, fetchUsers]);

  // Handlers with useCallback
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleStatusFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setPage(1);
  }, []);

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

  // Modal handlers
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
  }, []);

  // CRUD operations
  const handleCreateUser = useCallback(async (userData: Omit<User, 'id'>) => {
    try {
      await axios.post('http://localhost:3000/api/users', userData);
      closeUserModal();
      fetchUsers(searchTerm, statusFilter, page);
    } catch (err) {
      console.error('Error creating user:', err);
    }
  }, [fetchUsers, searchTerm, statusFilter, page, closeUserModal]);

  const handleUpdateUser = useCallback(async (userData: Omit<User, 'id'>) => {
    if (!selectedUser?.id?.$oid) return;
    try {
      await axios.put(`http://localhost:3000/api/users/${selectedUser.id.$oid}`, userData);
      closeUserModal();
      fetchUsers(searchTerm, statusFilter, page);
    } catch (err) {
      console.error('Error updating user:', err);
    }
  }, [selectedUser, fetchUsers, searchTerm, statusFilter, page, closeUserModal]);

  const handleDeactivateUser = useCallback(async () => {
    if (!userToDeactivate?.id?.$oid) return;
    try {
      await axios.patch(`http://localhost:3000/api/users/${userToDeactivate.id.$oid}/deactivate`);
      closeConfirmModal();
      fetchUsers(searchTerm, statusFilter, page);
    } catch (err) {
      console.error('Error deactivating user:', err);
    }
  }, [userToDeactivate, fetchUsers, searchTerm, statusFilter, page, closeConfirmModal]);

  const handleUserModalSave = useCallback((userData: Omit<User, 'id'>) => {
    if (selectedUser) {
      handleUpdateUser(userData);
    } else {
      handleCreateUser(userData);
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
        <AddButton onClick={openCreateModal}>
          + Nuevo alumno
        </AddButton>
      </Header>

      <FiltersContainer>
        <SearchInput
          type="text"
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <FilterSelect value={statusFilter} onChange={handleStatusFilterChange}>
          <option value="all">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </FilterSelect>
      </FiltersContainer>

      <Table>
        <Thead>
          <tr>
            <Th>Nombre y apellidos</Th>
            <Th>Usuario</Th>
            <Th>Email</Th>
            <Th>Móvil</Th>
            <Th>Estado</Th>
            <Th>Acciones</Th>
          </tr>
        </Thead>
        <Tbody>
          {users.map((user) => (
            <Tr key={user.id?.$oid || Math.random()}>
              <Td>{user.name || '-'} {user.lastName || '-'}</Td>
              <Td>Nombre de usuario</Td>
              <Td>{user.email || '-'}</Td>
              <Td>{user.phone || '-'}</Td>
              <Td>
                <StatusBadge isActive={user.isActive}>
                  {user.isActive ? 'Activo' : 'Inactivo'}
                </StatusBadge>
              </Td>
              <Td>
                <ActionButtons>
                  <ActionButton
                    variant="edit"
                    onClick={() => openEditModal(user)}
                  >
                    Editar
                  </ActionButton>
                  {user.isActive && (
                    <ActionButton
                      variant="delete"
                      onClick={() => openDeactivateModal(user)}
                    >
                      Desactivar
                    </ActionButton>
                  )}
                </ActionButtons>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <PaginationContainer>
        <PaginationInfo>
          {((page - 1) * 50) + 1} - {Math.min(page * 50, metadata.totalItems)} de {metadata.totalItems} elementos
        </PaginationInfo>
        <PaginationButtons>
          <PageButton
            onClick={handlePrevPage}
            disabled={!metadata.hasPrevPage}
          >
            Anterior
          </PageButton>
          <PageButton
            onClick={handleNextPage}
            disabled={!metadata.hasNextPage}
          >
            Siguiente
          </PageButton>
        </PaginationButtons>
      </PaginationContainer>

      <UserModal
        isOpen={isUserModalOpen}
        user={selectedUser}
        onSave={handleUserModalSave}
        onCancel={closeUserModal}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        title="Cancelar importar test"
        message="¿Seguro que quieres desactivar esta cuenta? El usuario dejará de tener acceso a la plataforma."
        confirmText="Desactivar"
        cancelText="Cancelar"
        onConfirm={handleDeactivateUser}
        onCancel={closeConfirmModal}
        type="danger"
      />
    </Container>
  );
});