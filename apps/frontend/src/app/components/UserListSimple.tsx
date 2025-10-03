import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

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
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 20px;
`;

const Message = styled.p`
  color: #666;
  font-size: 16px;
`;

const UserCard = styled.div`
  background: white;
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

// Simple Component
export const UserListSimple: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simple fetch without axios
    fetch('http://localhost:3000/api/users?page=1&limit=10')
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch');
        return response.json();
      })
      .then((data: UsersResponse) => {
        setUsers(data.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <Container><Message>Loading...</Message></Container>;
  if (error) return <Container><Message>Error: {error}</Message></Container>;

  return (
    <Container>
      <Title>User Management - Simple Version</Title>
      <Message>Found {users.length} users</Message>
      {users.map(user => (
        <UserCard key={user.id.$oid}>
          {user.name} {user.lastName} - {user.email} - {user.isActive ? 'Active' : 'Inactive'}
        </UserCard>
      ))}
    </Container>
  );
};