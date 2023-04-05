import { ChangeEvent, FC, useState } from "react";
import "./Login.scss";
import axios, { AxiosResponse } from "axios";

type LoginProps = {
    token: boolean
}

const Login: FC<LoginProps> = ({
    token
}) => {

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");
    const [email, setEmail] = useState("");
    const [signIn, setSignIn] = useState(false);
    const [signUp, setSignUp] = useState(false);

    function handleSubmit(event:any) {
        //submit and wait for token
        console.log("here");
        console.log(event);
    }

    function handleSignUp():void{
        axios.post('/signup',
        {
            userName: userName,
            password: password,
            email: email,
        }).then((response:AxiosResponse)=>{
            //response is token, fire off signedUp Event and assign token
            response.data
            console.log(response);
        }).catch((error)=>{
            console.log(error);
        })
    }
    function handleUNInput(event: ChangeEvent<HTMLInputElement>) {
        setUserName(event.target.value);
    }
    function handleEmailInput(event: ChangeEvent<HTMLInputElement>) {
        setEmail(event.target.value);
    }

    function handlePWRInput(event: ChangeEvent<HTMLInputElement>) {
        setConfirmedPassword(event.target.value);
    }

    function handlePWInput(event: ChangeEvent<HTMLInputElement>) {
        setPassword(event.target.value);
    }


    function getSignInForm() {
        return (
            <form  className="loginForm">
                <div>
                    <label htmlFor="username">Username: </label>
                    <input type="text" value={userName} onChange={handleUNInput} id="username" />
                </div>
                <div>
                    <label htmlFor="password">Password: </label>
                    <input type="text" value={password} onChange={handlePWInput} id="password" />
                </div>
                <div className="buttonContainer">
                    <button type="button" onClick={handleSubmit}>Submit</button>
                </div>
            </form>);
    }

    function getSignUpForm() {
        return (
            <form className="loginForm">
                <div>
                    <label htmlFor="username">Username: </label>
                    <input type="text" value={userName} onChange={handleUNInput} id="username" />
                </div>

                <div>
                    <label htmlFor="email">Email: </label>
                    <input type="email" value={email} onChange={handleEmailInput} id="email" />
                </div>
                
                <div>
                    <label htmlFor="password">Password: </label>
                    <input type="password" value={password} onChange={handlePWInput} id="password" />
                </div>
                <div>
                    <label htmlFor="passwordRepeat">Confirm Password: </label>
                    <input type="password" value={confirmedPassword} onChange={handlePWRInput} id="passwordRepeat" />
                </div>
                <button type="button" onClick={handleSignUp}>Submit</button>
            </form>
        );
    }

    function handleSignInRenderClick(){
        setSignUp(false);
        setSignIn(true);
    }

    function handleSignUpRenderClick(){
        setSignIn(false);
        setSignUp(true);
    }

    function getSignChoice() {
        return (
            <div className="signInChoiceContainer">
                <button onClick={handleSignInRenderClick}>Sign In</button> or <button onClick={handleSignUpRenderClick}>Sign Up</button>
            </div>);
    }

    function getSignActionJSX() {
        if (!signIn && !signUp) {
            return getSignChoice();
        }
        else if (signIn) {
            return getSignInForm();
        }
        else if (signUp) {
            return getSignUpForm();
        }
    }
    return (
        <div className="loginContainer">
            {getSignActionJSX()}
        </div>
    );

}
export { Login };
