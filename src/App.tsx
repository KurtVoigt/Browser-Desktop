import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.scss'
import { Desktop } from './Desktop'
import { Login } from './Login';
import React from 'react';

function App() {

  const [token, setToken] = React.useState("");

  function handleUserSignup(token:string):void{
    setToken(token);
  }
  //for invalid token, relog back in, perhaps implement a message later
  function clearToken():void{
    setToken("");
  }
  //validate the token

  if (token!=="") {
    console.log(token);
    return (
      <>
        <Desktop relog={clearToken} token={token}></Desktop>
      </>
    );
  }
  else{
    return(<Login token={handleUserSignup}/>);
  }
}

export default App
