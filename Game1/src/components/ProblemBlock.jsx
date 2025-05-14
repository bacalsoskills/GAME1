import React, { useMemo } from 'react';
import styled from '@emotion/styled';

// Predefined kid-friendly colors
const COLORS = [
  { bg: '#FF9AA2', text: '#fff' }, // Soft pink
  { bg: '#FFB7B2', text: '#fff' }, // Light coral
  { bg: '#FFDAC1', text: '#333' }, // Peach
  { bg: '#E2F0CB', text: '#333' }, // Light green
  { bg: '#B5EAD7', text: '#333' }, // Mint
  { bg: '#C7CEEA', text: '#333' }, // Lavender
  { bg: '#FFD3B6', text: '#333' }, // Light orange
  { bg: '#AAFFC3', text: '#333' }, // Mint green
  { bg: '#FFFFD8', text: '#333' }, // Light yellow
  { bg: '#B5EAD7', text: '#333' }, // Aqua
];

const Block = styled.div`
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  background: ${props => props.color.bg};
  color: ${props => props.color.text};
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  font-size: 2rem;
  font-weight: bold;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: transform 0.2s ease;
  animation: float 2s ease-in-out infinite;
  user-select: none;

  &:hover {
    transform: scale(1.05);
  }

  @keyframes float {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-5px);
    }
    100% {
      transform: translateY(0px);
    }
  }
`;

const Operator = styled.span`
  font-size: 1.8rem;
  opacity: 0.8;
`;

const ProblemBlock = ({ num1, num2, x, y }) => {
  // Use useMemo to keep the same color for each problem
  const color = useMemo(() => {
    const index = (num1 * num2) % COLORS.length;
    return COLORS[index];
  }, [num1, num2]);

  return (
    <Block x={x} y={y} color={color}>
      {num1} <Operator>×</Operator> {num2}
    </Block>
  );
};

export default ProblemBlock; 