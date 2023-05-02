import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.scss'
import { Desktop } from './Desktop'
import { Login } from './Login';
import React from 'react';
import jwt_decode from "jwt-decode";
import axios, { Axios, AxiosResponse } from 'axios';
import { SavedAppsType } from './Desktop';


function App() {
  type jwtType = {
    exp: number;
    iat: number;//issued at time
    userId: string;
  }




  const [token, setToken] = React.useState("");
  function handleUserSignup(token: string): void {
    setToken(token);
  }

  function parseJwt(t: string): string {

    const decoded: jwtType = jwt_decode(t);
    return decoded.userId;
  }



  //for invalid token, relog back in, perhaps implement a message later
  function clearToken(): void {
    setToken("");
  }

  if (token !== "") {
  
    return (
      <>
        <Desktop relog={clearToken} token={token} userID={parseJwt(token)}></Desktop>
      </>
    );
  }
  else {
    return (<Login token={handleUserSignup} />);
  }

}

export default App

