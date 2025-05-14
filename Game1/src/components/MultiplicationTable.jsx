import React from 'react';
import styled from '@emotion/styled';

const TableContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(110, 142, 251, 0.3);
  max-width: 600px;
  width: 90%;
  margin: 20px auto;
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: 'Comic Sans MS', 'Arial Rounded MT Bold', 'Arial', sans-serif;
`;

const TableHeader = styled.th`
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  color: white;
  padding: 12px;
  font-size: 1.2rem;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TableCell = styled.td`
  padding: 10px;
  text-align: center;
  font-size: 1.1rem;
  color: #333;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(110, 142, 251, 0.1);
    transform: scale(1.05);
  }
`;

const Title = styled.h2`
  color: #6e8efb;
  text-align: center;
  margin-bottom: 20px;
  font-family: 'Comic Sans MS', 'Arial Rounded MT Bold', 'Arial', sans-serif;
  font-size: 1.8rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #666;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 5px;
  transition: all 0.3s ease;

  &:hover {
    color: #6e8efb;
    transform: scale(1.1);
  }
`;

const MultiplicationTable = ({ onClose }) => {
  // Generate multiplication table data
  const generateTable = () => {
    const table = [];
    for (let i = 1; i <= 10; i++) {
      const row = [];
      for (let j = 1; j <= 10; j++) {
        row.push(i * j);
      }
      table.push(row);
    }
    return table;
  };

  const tableData = generateTable();

  return (
    <TableContainer>
      <CloseButton onClick={onClose}>×</CloseButton>
      <Title>Multiplication Table (1-10)</Title>
      <Table>
        <thead>
          <tr>
            <TableHeader>×</TableHeader>
            {[...Array(10)].map((_, i) => (
              <TableHeader key={i + 1}>{i + 1}</TableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, i) => (
            <tr key={i}>
              <TableHeader>{i + 1}</TableHeader>
              {row.map((cell, j) => (
                <TableCell key={j}>{cell}</TableCell>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default MultiplicationTable; 