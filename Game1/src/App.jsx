import React from 'react';
import styled from '@emotion/styled';
import Game from './components/Game';

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: #1a1a1a;
`;

const App = () => {
  return (
    <AppContainer>
      <Game />
    </AppContainer>
  );
};

export default App;
