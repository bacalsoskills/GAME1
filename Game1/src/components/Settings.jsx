import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import audioManager from '../utils/AudioManager';

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
  z-index: 2000;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const Modal = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 1.5rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.3);
  animation: scaleIn 0.3s ease;
  border: 4px solid #6e8efb;

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

const Emoji = styled.span`
  font-size: 2rem;
`;

const SettingGroup = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 1rem;
  margin-bottom: 1.5rem;
  border: 2px solid #e9ecef;
`;

const SettingLabel = styled.label`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  color: #333;
  font-size: 1.1rem;
  font-weight: bold;
  font-family: 'Comic Sans MS', 'Arial Rounded MT Bold', 'Arial', sans-serif;
`;

const Toggle = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 30px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 30px;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);

    &:before {
      position: absolute;
      content: "";
      height: 24px;
      width: 24px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
  }

  input:checked + span {
    background: linear-gradient(135deg, #6e8efb, #a777e3);
  }

  input:checked + span:before {
    transform: translateX(30px);
  }
`;

const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 0.8rem;
  border: 2px solid #e9ecef;
`;

const VolumeSlider = styled.input`
  flex: 1;
  height: 8px;
  -webkit-appearance: none;
  background: #e9ecef;
  border-radius: 4px;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    background: linear-gradient(135deg, #6e8efb, #a777e3);
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.1);
    }
  }
`;

const VolumeIcon = styled.span`
  font-size: 1.5rem;
  color: #6e8efb;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 1rem;
  cursor: pointer;
  font-size: 1.1rem;
  font-family: 'Comic Sans MS', 'Arial Rounded MT Bold', 'Arial', sans-serif;
  font-weight: bold;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &.save {
    background: linear-gradient(135deg, #6e8efb, #a777e3);
    color: white;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }
  }

  &.cancel {
    background: #f8f9fa;
    color: #333;
    border: 2px solid #e9ecef;

    &:hover {
      background: #e9ecef;
      transform: translateY(-2px);
    }
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #6e8efb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-left: 10px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  background: #ffe6e6;
  padding: 0.8rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: shake 0.5s ease-in-out;

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
`;

const RetryButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: #c82333;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Settings = ({ onClose, onSave, isOpen }) => {
  const [musicEnabled, setMusicEnabled] = useState(() => {
    const saved = localStorage.getItem('musicEnabled');
    return saved ? JSON.parse(saved) : true;
  });

  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('musicVolume');
    return saved ? parseFloat(saved) : 0.5;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Set up loading and error callbacks
    audioManager.setLoadingCallback(setIsLoading);
    audioManager.setErrorCallback((error) => {
      setError(error.message || 'Failed to play audio. Please try again.');
    });

    return () => {
      audioManager.setLoadingCallback(null);
      audioManager.setErrorCallback(null);
    };
  }, []);

  useEffect(() => {
    if (musicEnabled) {
      audioManager.restart();
    } else {
      audioManager.pause();
    }
  }, [musicEnabled]);

  useEffect(() => {
    audioManager.setVolume(volume);
  }, [volume]);

  const handleRetry = () => {
    setError(null);
    if (musicEnabled) {
      audioManager.restart();
    }
  };

  const handleSave = () => {
    localStorage.setItem('musicEnabled', JSON.stringify(musicEnabled));
    localStorage.setItem('musicVolume', volume.toString());
    
    if (musicEnabled) {
      audioManager.restart();
    } else {
      audioManager.pause();
    }
    
    onSave();
  };

  if (!isOpen) return null;

  return (
    <Overlay>
      <Modal>
        <Title>
          <Emoji>⚙️</Emoji>
          Game Settings
        </Title>
        
        <SettingGroup>
          <SettingLabel>
            Background Music
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {isLoading && <LoadingSpinner />}

            </div>
          </SettingLabel>
          
          {musicEnabled && (
            <>
              <VolumeControl>
                <VolumeIcon>🔈</VolumeIcon>
                <VolumeSlider
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  disabled={isLoading}
                />
                <VolumeIcon>🔊</VolumeIcon>
              </VolumeControl>

              {error && (
                <ErrorMessage>
                  <span>⚠️</span>
                  {error}
                  <RetryButton onClick={handleRetry}>
                    Retry
                  </RetryButton>
                </ErrorMessage>
              )}
            </>
          )}
        </SettingGroup>

        <ButtonGroup>
          <Button 
            className="cancel" 
            onClick={onClose}
            disabled={isLoading}
          >
            <span>❌</span> Cancel
          </Button>
          <Button 
            className="save" 
            onClick={handleSave}
            disabled={isLoading}
          >
            <span>💾</span> Save
          </Button>
        </ButtonGroup>
      </Modal>
    </Overlay>
  );
};

export default Settings; 