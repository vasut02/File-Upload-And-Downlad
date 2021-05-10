import './App.css';
import { Redirect, BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Form from './components/Form'

const App = () => {
  return (
    //Router 
    <Router>
      <div className="App">
        <Switch>
          <Route exact path='/' component={Form} />
          <Redirect from='*' to='/' />
        </Switch>
      </div>
    </Router>
  );
}


export default App;
