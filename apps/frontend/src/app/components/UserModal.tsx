import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface User {
  id?: { $oid: string };
  name: string;
  lastName: string;
  username: string;
  email: string;
  phone: string | null;
  isActive: boolean;
}

interface UserModalProps {
  isOpen: boolean;
  user?: User | null;
  onSave: (userData: Omit<User, 'id'>, isDeactivating?: boolean) => void;
  onCancel: () => void;
}

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  border-radius: 12px;
  padding: 32px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #111827;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
  padding: 4px;

  &:hover {
    color: #374151;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }

  &:invalid {
    border-color: #ef4444;
  }
`;

const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 8px 0;
`;

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
`;

const SwitchInput = styled.input`
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

const SwitchSlider = styled.span`
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

const SwitchLabel = styled.span`
  font-size: 14px;
  color: #374151;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
`;

const Button = styled.button<{ variant: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  ${props => props.variant === 'primary' ? `
    background-color: #10b981;
    color: white;
    &:hover {
      background-color: #059669;
    }
    &:disabled {
      background-color: #d1d5db;
      cursor: not-allowed;
    }
  ` : `
    background-color: #f3f4f6;
    color: #374151;
    &:hover {
      background-color: #e5e7eb;
    }
  `}
`;

const AvatarContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  background-color: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #6b7280;
`;

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  user,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    isActive: true
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        lastName: user.lastName || '',
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        isActive: user.isActive
      });
    } else {
      setFormData({
        name: '',
        lastName: '',
        username: '',
        email: '',
        phone: '',
        isActive: true
      });
    }
    setErrors({});
  }, [user, isOpen]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Check if we're deactivating an active user
      const isDeactivating = user && user.isActive && !formData.isActive;

      onSave({
        name: formData.name.trim(),
        lastName: formData.lastName.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        isActive: formData.isActive
      }, isDeactivating);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const isEditing = !!user?.id;

  if (!isOpen) return null;

  return (
    <Overlay isOpen={isOpen} onClick={onCancel}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>{isEditing ? 'Editar estudiante' : 'Nuevo alumno'}</Title>
          <CloseButton onClick={onCancel}>&times;</CloseButton>
        </Header>

        <AvatarContainer>
          <Avatar>👤</Avatar>
        </AvatarContainer>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Nombre *</Label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ingresa el nombre"
              required
            />
            {errors.name && <span style={{color: '#ef4444', fontSize: '12px'}}>{errors.name}</span>}
          </FormGroup>

          <FormGroup>
            <Label>Apellidos *</Label>
            <Input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              placeholder="Ingresa los apellidos"
              required
            />
            {errors.lastName && <span style={{color: '#ef4444', fontSize: '12px'}}>{errors.lastName}</span>}
          </FormGroup>

          <FormGroup>
            <Label>Nombre de usuario *</Label>
            <Input
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              placeholder="Ingresa el nombre de usuario"
              required
            />
            {errors.username && <span style={{color: '#ef4444', fontSize: '12px'}}>{errors.username}</span>}
          </FormGroup>

          <FormGroup>
            <Label>Email *</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="usuario@ejemplo.com"
              required
            />
            {errors.email && <span style={{color: '#ef4444', fontSize: '12px'}}>{errors.email}</span>}
          </FormGroup>

          <FormGroup>
            <Label>Móvil</Label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="000 000 000"
            />
          </FormGroup>

          <SwitchContainer>
            <Switch>
              <SwitchInput
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
              />
              <SwitchSlider />
            </Switch>
            <SwitchLabel>Cuenta activa</SwitchLabel>
          </SwitchContainer>

          <ButtonContainer>
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              {isEditing ? 'Guardar' : 'Crear estudiante'}
            </Button>
          </ButtonContainer>
        </Form>
      </Modal>
    </Overlay>
  );
};