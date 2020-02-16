import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import  { Container } from 'reactstrap';
import Navbar from './NavBar';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import './Home.css';


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
      
        <Container className = "App">

            <Navbar></Navbar>

            <div className="Text">
                <h1 style={{fontSize: "500%"}, {fontFamily: "PlayfairDisplay"}}><b>Detritus AI</b></h1>

                <p style={{fontSize: "200%"}, {fontFamily: "PlayfairDisplay"}}>Detritus AI is a smart city garbage treatment component. Itrecognizes <br/>the garbage type
                using machine learning and opens the corresponding lid.<br/> It uploads the fullness of each 
                bin in real time. The data is transferred in real <br/> time using Solace and displayed on our front
                end built with React.
                </p>

                <div className={classes.root}>
                <Button variant="contained" color="primary" href="/map">Get Started</Button>


            </div>


            </div>

        
        </Container>

  );
}

export default Home;
