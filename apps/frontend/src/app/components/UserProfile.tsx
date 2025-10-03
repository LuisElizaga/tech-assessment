import React, { useState, useEffect } from 'react';
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
  photo?: string;
}

interface UserProfileProps {
  userId: string;
  onBack: () => void;
  onShowToast: (message: string) => void;
}

const Container = styled.div`
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 16px 0;
  border-bottom: 1px solid #e5e5e7;
`;

const Title = styled.h1`
  font-size: 18px;
  color: #1a1a1a;
  margin: 0;
  font-weight: 500;
`;

const CloseButton = styled.button`
  background-color: #f3f4f6;
  color: #374151;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e5e7eb;
  }
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  text-align: center;
`;

const AvatarContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
  position: relative;
`;

const Avatar = styled.div<{ hasPhoto?: boolean }>`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: #6b7280;
  background: ${props => props.hasPhoto ? 'transparent' : '#f3f4f6'};
  border: 2px solid #e5e7eb;
  background-image: ${props => props.hasPhoto ? `url(${props.hasPhoto})` : 'none'};
  background-size: cover;
  background-position: center;
  position: relative;
  cursor: pointer;

  &:hover::after {
    content: '📷';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const UserInfo = styled.div`
  margin-bottom: 32px;
`;

const UserName = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 24px 0;
  text-align: left;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const DetailIcon = styled.div`
  width: 20px;
  height: 20px;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DetailText = styled.div`
  display: flex;
  flex-direction: column;
`;

const DetailLabel = styled.span`
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
`;

const DetailValue = styled.span`
  font-size: 14px;
  color: #111827;
  font-weight: 400;
`;

const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  margin: 24px 0;
`;

const StatusLabel = styled.span`
  font-size: 14px;
  color: #374151;
  font-weight: 500;
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

const EditButton = styled.button`
  background-color: #10b981;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;

  &:hover {
    background-color: #059669;
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

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

const EmailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
  </svg>
);

export const UserProfile: React.FC<UserProfileProps> = ({ userId, onBack, onShowToast }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingUserData, setPendingUserData] = useState<Omit<User, 'id'> | null>(null);

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/users/${userId}`);
      setUser(response.data);
    } catch (err) {
      console.error('Error fetching user:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!user) return;

    if (user.isActive) {
      setIsConfirmModalOpen(true);
    } else {
      try {
        await axios.put(`http://localhost:3000/api/users/${user.id.$oid}`, {
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          isActive: true
        });
        fetchUser();
      } catch (err) {
        console.error('Error activating user:', err);
      }
    }
  };

  const handleDeactivateUser = async () => {
    if (!user) return;
    try {
      // Si hay datos pendientes de edición, actualizarlos junto con la desactivación
      if (pendingUserData) {
        await axios.put(`http://localhost:3000/api/users/${user.id.$oid}`, pendingUserData);
        setPendingUserData(null);
      } else {
        // Solo desactivar
        await axios.patch(`http://localhost:3000/api/users/${user.id.$oid}/deactivate`);
      }
      setIsConfirmModalOpen(false);
      setIsEditModalOpen(false);
      onShowToast('Registro guardado correctamente');
      onBack(); // Volver a la pantalla principal
    } catch (err) {
      console.error('Error deactivating user:', err);
    }
  };

  const compressImage = (file: File, maxWidth: number = 200, quality: number = 0.7): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido.');
      return;
    }

    try {
      // Compress the image before uploading
      const compressedPhoto = await compressImage(file);

      await axios.put(`http://localhost:3000/api/users/${user.id.$oid}`, {
        ...user,
        photo: compressedPhoto
      });
      fetchUser();
    } catch (err) {
      console.error('Error uploading photo:', err);
      alert('Error al subir la foto. Por favor intenta con una imagen más pequeña.');
    }
  };

  const handleEditUser = (userData: Omit<User, 'id'>, isDeactivating?: boolean) => {
    if (!user) return;

    // Si se está desactivando un usuario activo, mostrar confirmación
    if (isDeactivating) {
      setPendingUserData(userData);
      setIsConfirmModalOpen(true);
    } else {
      // Flujo normal de actualización
      axios.put(`http://localhost:3000/api/users/${user.id.$oid}`, userData)
        .then(() => {
          setIsEditModalOpen(false);
          onShowToast('Registro guardado correctamente');
          onBack(); // Volver a la pantalla principal
        })
        .catch(err => console.error('Error updating user:', err));
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setPendingUserData(null); // Limpiar datos pendientes si se cancela
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>Cargando perfil...</LoadingContainer>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container>
        <LoadingContainer>Usuario no encontrado</LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>MI ACADEMIA/Modal perfil alumno</Title>
        <CloseButton onClick={onBack}>Cerrar</CloseButton>
      </Header>

      <ProfileCard>
        <AvatarContainer>
          <Avatar
            hasPhoto={user.photo}
            onClick={() => document.getElementById('photo-input')?.click()}
          >
            {!user.photo && '📷'}
          </Avatar>
          <HiddenFileInput
            id="photo-input"
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
          />
        </AvatarContainer>

        <UserInfo>
          <UserName>{user.name} {user.lastName}</UserName>
        </UserInfo>

        <UserDetails>
          <DetailItem>
            <DetailIcon>
              <UserIcon />
            </DetailIcon>
            <DetailText>
              <DetailLabel>Nombre y apellidos</DetailLabel>
              <DetailValue>{user.name} {user.lastName}</DetailValue>
            </DetailText>
          </DetailItem>

          <DetailItem>
            <DetailIcon>
              <UserIcon />
            </DetailIcon>
            <DetailText>
              <DetailLabel>Nombre de usuario</DetailLabel>
              <DetailValue>{user.username || '-'}</DetailValue>
            </DetailText>
          </DetailItem>

          <DetailItem>
            <DetailIcon>
              <EmailIcon />
            </DetailIcon>
            <DetailText>
              <DetailLabel>Email</DetailLabel>
              <DetailValue>{user.email}</DetailValue>
            </DetailText>
          </DetailItem>

          <DetailItem>
            <DetailIcon>
              <PhoneIcon />
            </DetailIcon>
            <DetailText>
              <DetailLabel>Móvil</DetailLabel>
              <DetailValue>{user.phone || '000 000 000'}</DetailValue>
            </DetailText>
          </DetailItem>
        </UserDetails>

        <StatusContainer>
          <StatusLabel>Cuenta activa</StatusLabel>
          <ToggleSwitch>
            <ToggleInput
              type="checkbox"
              checked={user.isActive}
              onChange={handleToggleStatus}
            />
            <ToggleSlider />
          </ToggleSwitch>
        </StatusContainer>

        <EditButton onClick={() => setIsEditModalOpen(true)}>
          Editar estudiante
        </EditButton>
      </ProfileCard>

      <UserModal
        isOpen={isEditModalOpen}
        user={user}
        onSave={handleEditUser}
        onCancel={handleCloseEditModal}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        title="Desactivar cuenta de alumno"
        message={`¿Estás seguro de que quieres desactivar la cuenta de ${user.name} ${user.lastName}? El alumno dejará de tener acceso a la plataforma.`}
        confirmText="Desactivar cuenta"
        cancelText="Cancelar"
        onConfirm={handleDeactivateUser}
        onCancel={() => {
          setIsConfirmModalOpen(false);
          setPendingUserData(null);
        }}
        type="danger"
      />
    </Container>
  );
};