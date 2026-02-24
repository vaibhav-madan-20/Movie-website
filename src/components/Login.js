import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { auth } from "../utils/firebase";

import { checkValidData } from '../utils/validate';
import { addUser } from '../utils/userSlice';

import Header from './Header';
import { NETFLIX_BACKGROUND, USER_AVATAR } from "../utils/constants";
import { toggleGptState } from '../utils/gptSlice';

const Login = () => {
    const dispatch = useDispatch();
    const { gptState } = useSelector(store => store.gpt);

    const [isLoginForm, setIsLoginForm] = useState(true);
    const name = useRef(null);
    const email = useRef(null);
    const password = useRef(null);
    const [errorMessage, setErrorMessage] = useState(null);

    function handleButtonClick() {
        const message = checkValidData(name?.current?.value, email.current.value, password.current.value, isLoginForm);
        setErrorMessage(message);
        if (message) return;

        if (!isLoginForm) {
            let user;
            createUserWithEmailAndPassword(auth, email.current.value, password.current.value)
                .then((userCredential) => {
                    // Signed up 
                    user = userCredential.user;
                    // console.log("Signed up");
                    // console.log(user);
                })
                .then(() => updateProfile(auth.currentUser, { displayName: name.current.value, photoURL: USER_AVATAR }))
                .then(() => {

                    // Profile updated!
                    gptState && dispatch(toggleGptState());
                    dispatch(addUser({ uid: user.uid, displayName: user.displayName, email: user.email, photoURL: user.photoURL }));
                    // console.log(auth.currentUser);
                })
                .catch((error) => {
                    console.log(error.code);
                    if (error.code === "auth/email-already-in-use") {
                        setErrorMessage("This email address is already in use by some other user");
                    }
                    else {
                        setErrorMessage(error.code + '-' + error.message);
                    }
                });
        }
        else {
            signInWithEmailAndPassword(auth, email.current.value, password.current.value)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    // console.log("Logged in");
                    // console.log(user);
                    gptState && dispatch(toggleGptState());
                    dispatch(addUser({ uid: user.uid, displayName: user.displayName, email: user.email, photoURL: user.photoURL }));
                })
                .catch((error) => {
                    console.log(error.code);
                    if (error.code === "auth/invalid-credential") {
                        setErrorMessage("Invalid credentials");
                    }
                    else if (error.code === "auth/missing-password") {
                        setErrorMessage("Password is missing");
                    }
                    else {
                        setErrorMessage(error.code + '-' + error.message);
                    }
                });
        }
    }

    function handleGoogleLogin() {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                // IdP data available using getAdditionalUserInfo(result)
                // ...
                // console.log(user);
                dispatch(
                    addUser({
                        uid: user.uid,
                        displayName: user.displayName,
                        email: user.email,
                        photoURL: user.photoURL,
                    })
                );
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });
    }

    return (<>
        <div className="absolute">
            <Header />
        </div>
        <div className="w-screen h-screen flex items-center justify-center" style={{ backgroundImage: `url(${NETFLIX_BACKGROUND})` }}>
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            <form className="relative z-10 flex flex-col items-center bg-black bg-opacity-80 px-8 py-4 rounded-lg w-96 mx-auto text-white border-[1px] border-red-500"
                onSubmit={e => e.preventDefault()}
            >

                <h1 className="text-3xl font-bold mb-6">{isLoginForm ? "Sign In" : "Sign Up"}</h1>
                {!isLoginForm && <input
                    ref={name}
                    type="text"
                    placeholder="Name"
                    className="w-full p-3 mb-4 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                />}
                <input
                    autoComplete='on'
                    ref={email}
                    type="email"
                    placeholder="Email address"
                    className="w-full p-3 mb-4 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                <input
                    autoComplete='on'
                    ref={password}
                    type="password"
                    placeholder="Password"
                    className="w-full p-3 mb-4 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                <p className="text-red-500 text-sm mb-2"
                >{errorMessage}</p>
                <button
                    className="w-full bg-red-600 text-white p-3 rounded text-lg font-semibold hover:bg-red-700"
                    onClick={handleButtonClick}>
                    {isLoginForm ? "Sign In" : "Sign Up"}
                </button>
                <p className="flex items-center w-full my-4 text-gray-400 text-sm">
                    <span className="flex-grow border-t border-gray-600"></span>
                    <span className="mx-2">OR</span>
                    <span className="flex-grow border-t border-gray-600"></span>
                </p>
                <button
                    className="w-full bg-white text-black font-semibold py-2 px-2 rounded flex items-center justify-center gap-2 hover:bg-gray-200 transition"
                    onClick={handleGoogleLogin}
                >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt='' />
                    Continue with Google
                </button>

                <p
                    className="text-gray-400 mt-4 cursor-pointer hover:underline"
                    onClick={() => { setIsLoginForm(!isLoginForm); setErrorMessage(null) }}
                >{isLoginForm ? "New to Netflix? Sign Up" : "Already have an account? Sign In"}</p>
            </form>
        </div>
    </>
    );
};
export default Login;