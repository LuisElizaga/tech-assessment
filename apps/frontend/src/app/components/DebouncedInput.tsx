import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

interface DebouncedInputProps {
  onDebouncedChange: (value: string) => void;
  placeholder?: string;
  delay?: number;
}

const StyledInput = styled.input`
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

export const DebouncedInput: React.FC<DebouncedInputProps> = ({
  onDebouncedChange,
  placeholder = "Search by name, email, or phone...",
  delay = 300
}) => {
  const [inputValue, setInputValue] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      onDebouncedChange(inputValue);
    }, delay);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [inputValue, delay, onDebouncedChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <StyledInput
      type="text"
      placeholder={placeholder}
      value={inputValue}
      onChange={handleChange}
    />
  );
};