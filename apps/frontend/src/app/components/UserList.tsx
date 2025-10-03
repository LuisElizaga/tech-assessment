import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import axios from 'axios';

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
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 32px;
  color: #1a1a1a;
  margin: 0 0 20px 0;
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
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
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
    border-color: #4CAF50;
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
    border-color: #4CAF50;
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

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 18px;
  color: #dc3545;
`;

// Main Component
export const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [metadata, setMetadata] = useState({
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Debounce search
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1); // Reset to first page on search
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '50',
      });

      if (debouncedSearchTerm) {
        params.append('search', debouncedSearchTerm);
      }

      if (statusFilter !== 'all') {
        params.append('isActive', statusFilter);
      }

      const response = await axios.get<UsersResponse>(
        `http://localhost:3000/api/users?${params}`
      );

      setUsers(response.data.data);
      setMetadata(response.data.metadata);
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearchTerm, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handlers
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setPage(1); // Reset to first page on filter change
  };

  const handlePrevPage = () => {
    if (metadata.hasPrevPage) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (metadata.hasNextPage) {
      setPage(page + 1);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <Container>
        <LoadingContainer>Loading users...</LoadingContainer>
      </Container>
    );
  }

  // Render error state
  if (error) {
    return (
      <Container>
        <ErrorContainer>{error}</ErrorContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>User Management</Title>
      </Header>

      <FiltersContainer>
        <SearchInput
          type="text"
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
            <Th>ID</Th>
            <Th>Name</Th>
            <Th>Last Name</Th>
            <Th>Email</Th>
            <Th>Phone</Th>
            <Th>Status</Th>
          </tr>
        </Thead>
        <Tbody>
          {users.map((user) => (
            <Tr key={user.id?.$oid || Math.random()}>
              <Td>{user.id?.$oid?.slice(-8) || 'N/A'}</Td>
              <Td>{user.name || '-'}</Td>
              <Td>{user.lastName || '-'}</Td>
              <Td>{user.email || '-'}</Td>
              <Td>{user.phone || '-'}</Td>
              <Td>
                <StatusBadge isActive={user.isActive}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </StatusBadge>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <PaginationContainer>
        <PaginationInfo>
          Showing {((page - 1) * 50) + 1} - {Math.min(page * 50, metadata.totalItems)} of {metadata.totalItems} users
        </PaginationInfo>
        <PaginationButtons>
          <PageButton
            onClick={handlePrevPage}
            disabled={!metadata.hasPrevPage}
          >
            Previous
          </PageButton>
          <PageButton
            onClick={handleNextPage}
            disabled={!metadata.hasNextPage}
          >
            Next
          </PageButton>
        </PaginationButtons>
      </PaginationContainer>
    </Container>
  );
};