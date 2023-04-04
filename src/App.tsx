import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.scss'
import { Desktop } from './Desktop'
import { Login } from './Login';

function App() {

  let token: boolean = false;

  if (token) {
    return (
      <>
        <Desktop></Desktop>
      </>
    );
  }
  else{
    return(<Login token={token}/>);
  }
}

export default App
