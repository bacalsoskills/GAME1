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
`;

const Modal = styled.div`
  background: white;
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h1`
  color: #ff4d4d;
  font-size: 36px;
  margin-bottom: 20px;
`;

const Score = styled.p`
  font-size: 24px;
  color: #333;
  margin-bottom: 30px;
`;

const RestartButton = styled.button`
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 20px;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const GameOverScreen = ({ score, onRestart }) => {
  return (
    <Overlay>
      <Modal>
        <Title>Game Over!</Title>
        <Score>Final Score: {score}</Score>
        <RestartButton onClick={onRestart}>
          Play Again
        </RestartButton>
      </Modal>
    </Overlay>
  );
};

export default GameOverScreen; 