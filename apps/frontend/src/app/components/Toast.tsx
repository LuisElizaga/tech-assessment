import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const ToastContainer = styled.div<{ type: string; isClosing?: boolean }>`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 10000;
  min-width: 300px;
  animation: ${props => props.isClosing ? slideOut : slideIn} 0.3s ease-in-out;

  background-color: ${props => {
    switch (props.type) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'info': return '#3b82f6';
      default: return '#10b981';
    }
  }};
  color: white;
`;

const Icon = styled.div`
  font-size: 20px;
  flex-shrink: 0;
`;

const Message = styled.div`
  flex: 1;
  font-size: 14px;
  font-weight: 500;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  onClose,
  duration = 3000
}) => {
  const [isClosing, setIsClosing] = React.useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // Esperar a que termine la animación
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'info': return 'ℹ';
      default: return '✓';
    }
  };

  return (
    <ToastContainer type={type} isClosing={isClosing}>
      <Icon>{getIcon()}</Icon>
      <Message>{message}</Message>
      <CloseButton onClick={handleClose}>&times;</CloseButton>
    </ToastContainer>
  );
};
