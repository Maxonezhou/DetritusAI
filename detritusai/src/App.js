import React from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';

import  { Container } from 'reactstrap';

import Navbar from './Components/NavBar';

function App() {
  return (
      
    <div>
      <Navbar></Navbar>

      <Container>
      <h1>Detritus AI</h1>
      <p>Detritus AI is a smart city component that identifies the garbage type and analyzes the contents
          of a trash can to produce an optimal collection route
      </p>
      </Container>
    </div>

  );
}

export default App;
