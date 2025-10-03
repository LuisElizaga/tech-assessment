import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
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

export const SearchInputWithRef: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search by name, email, or phone..."
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onChange(newValue);
    }, 300);

    if (inputRef.current) {
      inputRef.current.value = newValue;
    }
  };

  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== value) {
      inputRef.current.value = value;
    }
  }, [value]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <StyledInput
      ref={inputRef}
      type="text"
      placeholder={placeholder}
      defaultValue={value}
      onChange={handleInputChange}
    />
  );
};