import React from 'react';
import styled from '@emotion/styled';

const HUDContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  color: white;
  font-family: 'Comic Sans MS', 'Arial Rounded MT Bold', 'Arial', sans-serif;
  z-index: 1000;
  border-bottom: 4px solid #6e8efb;
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  min-width: 120px;
`;

const Label = styled.span`
  font-size: 0.9rem;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #a777e3;
`;

const Value = styled.span`
  font-size: 1.4rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const ProgressBar = styled.div`
  width: 200px;
  height: 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.3);
`;

const Progress = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #6e8efb, #a777e3);
  width: ${props => (props.progress / props.total) * 100}%;
  transition: width 0.3s ease;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(110, 142, 251, 0.5);
`;

const TableInfo = styled.div`
  font-size: 1rem;
  color: #ffd700;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  text-align: center;
  margin-top: 0.25rem;
  font-weight: bold;
`;

const LivesContainer = styled.div`
  display: flex;
  gap: 0.25rem;
  font-size: 1.4rem;
  animation: pulse 1s infinite;

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
`;

const HUD = ({ level, score, lives, progress, total }) => {
  const getTableInfo = () => {
    if (level <= 11) {
      return `Table: ${level + 1}×`;
    } else {
      return 'Tables: 2× to 12×';
    }
  };

  return (
    <HUDContainer>
      <Stat>
        <Label>Level</Label>
        <Value>{level}</Value>
        <TableInfo>{getTableInfo()}</TableInfo>
      </Stat>

      <Stat>
        <Label>Progress</Label>
        <ProgressBar>
          <Progress progress={progress} total={total} />
        </ProgressBar>
        <Value>{progress}/{total}</Value>
      </Stat>

      <Stat>
        <Label>Score</Label>
        <Value>⭐ {score}</Value>
      </Stat>

      <Stat>
        <Label>Lives</Label>
        <LivesContainer>
          {'❤️'.repeat(lives)}
        </LivesContainer>
      </Stat>
    </HUDContainer>
  );
};

export default HUD; 