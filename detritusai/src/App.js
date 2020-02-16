import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from './Components/Home';
import MapModified from './Components/MapModified';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <div>

      <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home}>
        </Route>
        <Route exact path="/map" component={MapModified}>
        </Route>
      </Switch>
      </BrowserRouter>
    </div>

  );
}

export default App;
