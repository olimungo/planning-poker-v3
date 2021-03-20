import './App.css';
import {
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import firebase from 'firebase/app';
import { Board, Pig } from './pages'

var firebaseConfig = {
  apiKey: "AIzaSyA_Jq10AgfGrLwlZQW9qF4xUXWZxWUx4_Q",
  authDomain: "planning-poker-test-70393.firebaseapp.com",
  databaseURL: "https://planning-poker-test-70393-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "planning-poker-test-70393",
  storageBucket: "planning-poker-test-70393.appspot.com",
  messagingSenderId: "302069956118",
  appId: "1:302069956118:web:28e225bdec917d15e6bf37",
  measurementId: "G-ZL68D26ZK3"
};

firebase.initializeApp(firebaseConfig).database();

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path='/board/:key'>
          <Board />
        </Route>
        <Route path='/board'>
          <Board />
        </Route>
        <Route path='/pig/:boardKey/:key'>
          <Pig />
        </Route>
        <Route path='/pig/:boardKey'>
          <Pig />
        </Route>
        <Route path='/'>
          <Redirect to='/board' />
        </Route>
      </Switch>
    </div>
  );
}

export default App;