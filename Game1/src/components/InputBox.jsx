import React, { forwardRef, useEffect } from 'react';
import styled from '@emotion/styled';

const InputContainer = styled.div`
  position: fixed;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  align-items: center;
  z-index: 1000;
`;

const StyledInput = styled.input`
  width: 200px;
  padding: 15px 20px;
  font-size: 24px;
  border: 3px solid #6e8efb;
  border-radius: 12px;
  text-align: center;
  font-family: 'Comic Sans MS', 'Arial Rounded MT Bold', 'Arial', sans-serif;
  background: white;
  color: #333;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &:focus {
    outline: none;
    border-color: #a777e3;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  &:disabled {
    background: #f5f5f5;
    border-color: #ddd;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const InputBox = forwardRef(({ value, onChange, onKeyPress, disabled, shouldFocus }, ref) => {
  return (
    <InputContainer>
      <StyledInput
        ref={ref}
        type="number"
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        disabled={disabled}
        placeholder="Type your answer..."
        autoComplete="off"
      />
    </InputContainer>
  );
});

InputBox.displayName = 'InputBox';

export default InputBox; 