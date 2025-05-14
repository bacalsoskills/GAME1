import React from 'react';
import styled from '@emotion/styled';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease;
`;

const Modal = styled.div`
  background: white;
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  animation: scaleIn 0.3s ease;
`;

const Title = styled.h1`
  color: #6e8efb;
  font-size: 36px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const Emoji = styled.span`
  font-size: 40px;
`;

const NextLevelInfo = styled.div`
  margin-top: 20px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 10px;
  color: #333;
`;

const TableInfo = styled.p`
  font-size: 20px;
  color: #6e8efb;
  font-weight: bold;
  margin: 10px 0;
`;

const ProblemsInfo = styled.p`
  font-size: 16px;
  color: #666;
`;

const Button = styled.button`
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 20px;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 20px;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const LevelComplete = ({ level, onContinue }) => {
  const getLevelInfo = (level) => {
    if (level <= 11) {
      return {
        table: level + 1,
        problems: level + 4,
        emoji: level < 12 ? '✅' : '🎉'
      };
    } else {
      return {
        table: 'Random (2× to 12×)',
        problems: level + 4,
        emoji: '🎉'
      };
    }
  };

  const { table, problems, emoji } = getLevelInfo(level);
  const nextLevel = level + 1;

  return (
    <Overlay>
      <Modal>
        <Title>
          <Emoji>{emoji}</Emoji>
          Level {level} Complete!
        </Title>
        <NextLevelInfo>
          <TableInfo>Next Level: {nextLevel}</TableInfo>
          <ProblemsInfo>
            {typeof table === 'number' 
              ? `Focus on ${table}× table`
              : table}
          </ProblemsInfo>
          <ProblemsInfo>
            Problems to solve: {problems}
          </ProblemsInfo>
        </NextLevelInfo>
        <Button onClick={onContinue}>
          Continue to Level {nextLevel}
        </Button>
      </Modal>
    </Overlay>
  );
};

export default LevelComplete; 