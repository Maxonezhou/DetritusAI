import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import  { Container } from 'reactstrap';
import Navbar from './NavBar';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';


const useStyles = makeStyles(theme => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  }));

function Home() {
  const classes = useStyles();

  return (
      
    <div>
      <Navbar></Navbar>

      <Container>
      <h1>Detritus AI</h1>
      <p>Detritus AI is a smart city component that identifies the garbage type and analyzes the contents
          of a trash can to produce an optimal collection route
      </p>

      <div className={classes.root}>
        <Button variant="outlined" href="/map">Get Started</Button>


      </div>
    

      </Container>
    </div>

  );
}

export default Home;
