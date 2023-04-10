import { ChangeEvent, FC, Fragment, useState } from "react";
import "./Login.scss";
import axios, { AxiosResponse } from "axios";
import jwt_decode from "jwt-decode";


type LoginProps = {
    token: (token: string) => void;
}

enum SIGN_UP_ERRORS {
    UNAVAILABLE_USERNAME = "typeNewUsername",
    UNAVAILABLE_EMAIL = "emailInUse",
    PASSWORDS_DONT_MATCH = "unmatchedPasswords",
    NO_ERRORS = "noErrors",
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
    const [signUpErrors, setSignUpErrors] = useState<SIGN_UP_ERRORS>(SIGN_UP_ERRORS.NO_ERRORS);
    const [signInError, setSignInError] = useState(false);

    function handleSignIn(event: any) {
        //submit and wait for token
        setSignInError(false);
        axios.post("/signin",
            {
                userName: userName,
                password: password,
            }).then((response: AxiosResponse) => {
                if (typeof response.data === 'string') {
                    token(response.data);
                }
            }).catch((error) => {
                if (error.response) {
                    if (error.response.status === 404) {
                        setSignInError(true);
                    }
                    else { console.log(error); }
                }
            })



    }

    function handleSignUp(): void {
        //check that passwords match and then go to server
        if (password !== confirmedPassword) {
            setSignUpErrors(SIGN_UP_ERRORS.PASSWORDS_DONT_MATCH);
        }

        else {
            setSignUpErrors(SIGN_UP_ERRORS.NO_ERRORS);
            axios.post('/signup',
                {
                    userName: userName,
                    password: password,
                    email: email,
                }).then((response: AxiosResponse) => {
                    //response is token, fire off signedUp Event and assign token
                    if (typeof response.data === 'string') {
                       
                        token(response.data);
                    }
                    
                }).catch((error) => {
                    if (error.response) {
                        //bad token, re-login for a new one
                        if (error.response.status === 409) {
                            if (error.response.data === "userName") {
                                setSignUpErrors(SIGN_UP_ERRORS.UNAVAILABLE_USERNAME);
                            }
                            else if (error.response.data === "email") {
                                setSignUpErrors(SIGN_UP_ERRORS.UNAVAILABLE_EMAIL);
                            }
                            else {
                                console.log(error.response)
                            }
                        }
                    }
                })
        }
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

    function getPWAlert(error: string): JSX.Element {
        if (error === SIGN_UP_ERRORS.PASSWORDS_DONT_MATCH) {
            return (
                <div className="alert">
                    <p>Passwords must match.</p>
                </div>);
        }
        else { return (<Fragment />); }
    }

    function getUserNameAlert(error: string) {
        if (error === SIGN_UP_ERRORS.UNAVAILABLE_USERNAME) {
            return (
                <div className="alert">
                    <p>Username is unavailabe.</p>
                </div>);
        }
        else { return (<Fragment />); }
    }

    function getEmailAlert(error: string) {
        if (error === SIGN_UP_ERRORS.UNAVAILABLE_EMAIL) {
            return (
                <div className="alert">
                    <p>Email is already in use.</p>
                </div>);
        }
        else { return (<Fragment />); }
    }

    function getNotFoundUserAlert(notFound: boolean) {
        if (notFound) {
            return (
                <div className="alert">
                    Username and password combination doesn't exist.
                </div>);
        }
        else { return (<Fragment />); }
    }


    function getSignInForm() {
        return (
            <form className="loginForm">
                {getNotFoundUserAlert(signInError)}

                <div>
                    <label htmlFor="username">Username: </label>
                    <input type="text" value={userName} onChange={handleUNInput} id="username" />
                </div>
                <div>
                    <label htmlFor="password">Password: </label>
                    <input type="password" value={password} onChange={handlePWInput} id="password" />
                </div>
                <div className="buttonContainer">
                    <button type="button" onClick={handleSignIn}>Submit</button>
                </div>
            </form>);
    }

    function getSignUpForm() {
        return (
            <form className="loginForm">
                <div>
                    <label htmlFor="username">Username: </label>
                    <input type="text" value={userName} onChange={handleUNInput} id="username" />
                    {getUserNameAlert(signUpErrors)}
                </div>

                <div>
                    <label htmlFor="email">Email: </label>
                    <input type="email" value={email} onChange={handleEmailInput} id="email" />
                    {getEmailAlert(signUpErrors)}
                </div>

                <div>
                    <label htmlFor="password">Password: </label>
                    <input type="password" value={password} onChange={handlePWInput} id="password" />
                </div>
                <div>
                    <label htmlFor="passwordRepeat">Confirm Password: </label>
                    <input type="password" value={confirmedPassword} onChange={handlePWRInput} id="passwordRepeat" />
                    {getPWAlert(signUpErrors)}
                </div>
                <button type="button" onClick={handleSignUp}>Submit</button>
            </form>
        );
    }

    function handleSignInRenderClick() {
        setSignUp(false);
        setSignIn(true);
    }

    function handleSignUpRenderClick() {
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


