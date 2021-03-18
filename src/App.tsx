import './App.css';
import {
  Switch,
  Route,
  useHistory,
  Redirect
} from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/database';
import { AppHeader } from './core'
import { Board } from './board';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

function App() {
  // Initialize Firebase
  if (!firebase.apps.length) {
    const database = firebase.initializeApp(firebaseConfig).database();
    const ref = database.ref('boards');

    ref.once('value').then(val => val.forEach(x => console.log(x.key, x.val())));
  }

  return (
    <div className="App">
      <AppHeader />

      <Switch>
        <Route path='/board'>
          <Board />
        </Route>
        <Route path='/pig'>
        </Route>
        <Route path='/'>
          <Redirect to='/board' />
        </Route>
      </Switch>
    </div>
  );
}

export default App;