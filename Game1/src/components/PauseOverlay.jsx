import React, { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import MultiplicationTable from './MultiplicationTable';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
  overflow-y: auto;
  padding: 2rem;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #6e8efb;
    border-radius: 6px;
    border: 3px solid rgba(255, 255, 255, 0.1);
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #5d7de9;
  }
`;

const Modal = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 1.5rem;
  width: 90%;
  max-width: 800px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.3);
  animation: scaleIn 0.3s ease;
  border: 4px solid #6e8efb;
  position: relative;
  margin: auto;

  @keyframes scaleIn {
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
`;

const Title = styled.h2`
  color: #6e8efb;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
  font-family: 'Comic Sans MS', 'Arial Rounded MT Bold', 'Arial', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Button = styled.button`
  padding: 1rem 2rem;
  border: none;
  border-radius: 1rem;
  cursor: pointer;
  font-size: 1.2rem;
  font-family: 'Comic Sans MS', 'Arial Rounded MT Bold', 'Arial', sans-serif;
  font-weight: bold;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &.resume {
    background: linear-gradient(135deg, #6e8efb, #a777e3);
    color: white;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }
  }

  &.settings {
    background: #f8f9fa;
    color: #333;
    border: 2px solid #e9ecef;

    &:hover {
      background: #e9ecef;
      transform: translateY(-2px);
    }
  }

  &.restart {
    background: #ff6b6b;
    color: white;

    &:hover {
      background: #ff5252;
      transform: translateY(-2px);
    }
  }

  &.table {
    background: #4CAF50;
    color: white;

    &:hover {
      background: #45a049;
      transform: translateY(-2px);
    }
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const TableSection = styled.div`
  margin-top: 2rem;
  padding: 2rem;
  border-radius: 1rem;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  animation: fadeIn 0.3s ease;
  max-height: 70vh;
  overflow-y: auto;

  /* Custom scrollbar styling for table section */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #6e8efb;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #5d7de9;
  }
`;

const TableTitle = styled.h3`
  color: #6e8efb;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-align: center;
  font-family: 'Comic Sans MS', 'Arial Rounded MT Bold', 'Arial', sans-serif;
`;

const PauseOverlay = ({ onResume, onSettings, onRestart }) => {
  const [showTable, setShowTable] = useState(false);
  const tableRef = useRef(null);
  const overlayRef = useRef(null);

  // Scroll to table when it's shown
  useEffect(() => {
    if (showTable && tableRef.current) {
      const scrollToTable = () => {
        const tableTop = tableRef.current.offsetTop;
        const overlayTop = overlayRef.current.scrollTop;
        const overlayHeight = overlayRef.current.clientHeight;
        
        // Only scroll if table is not fully visible
        if (tableTop < overlayTop || tableTop > overlayTop + overlayHeight) {
          overlayRef.current.scrollTo({
            top: tableTop - 20, // 20px offset from top
            behavior: 'smooth'
          });
        }
      };

      // Small delay to ensure the table is rendered
      setTimeout(scrollToTable, 100);
    }
  }, [showTable]);

  const handleTableToggle = () => {
    setShowTable(!showTable);
  };

  return (
    <Overlay ref={overlayRef}>
      <Modal>
        <Title>
          <span>⏸️</span>
          Game Paused
        </Title>

        <ButtonGroup>
          <Button className="resume" onClick={onResume}>
            <span>▶️</span> Resume
          </Button>
          <Button className="settings" onClick={onSettings}>
            <span>⚙️</span> Settings
          </Button>
          <Button className="restart" onClick={onRestart}>
            <span>🔄</span> Restart
          </Button>
          <Button 
            className="table" 
            onClick={handleTableToggle}
            style={{ 
              background: showTable ? '#45a049' : '#4CAF50',
              transform: showTable ? 'translateY(1px)' : 'none'
            }}
          >
            <span>📚</span> Table
          </Button>
        </ButtonGroup>

        {showTable && (
          <TableSection ref={tableRef}>
            <TableTitle>Multiplication Table Reference</TableTitle>
            <MultiplicationTable onClose={() => {}} />
          </TableSection>
        )}
      </Modal>
    </Overlay>
  );
};

export default PauseOverlay; 