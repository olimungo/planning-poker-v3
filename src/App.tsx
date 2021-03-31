import './App.css';
import {
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import firebase from 'firebase/app';
import { BoardPage, PigPage } from './pages'
import firebaseConfig from './environments/firebase-config.json';

firebase.initializeApp(firebaseConfig).database();

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path='/board/:key'>
          <BoardPage />
        </Route>
        <Route path='/board'>
          <BoardPage />
        </Route>
        <Route path='/pig/:boardKey/:key'>
          <PigPage />
        </Route>
        <Route path='/pig/:boardKey'>
          <PigPage />
        </Route>
        <Route path='/'>
          <Redirect to='/board' />
        </Route>
      </Switch>
    </div>
  );
}

export default App;