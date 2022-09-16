import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {createTheme, ThemeProvider} from "@mui/material";
import Main from "./Main";
import * as firebase from 'firebase/app';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {AuthProvider} from "./components/providers/AuthProvider";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

firebase.initializeApp({
  apiKey: "AIzaSyDGDiJ8hfrdG3ehejSNerkgrENiSNU8l4U",
  authDomain: "social-media-61fcf.firebaseapp.com",
  projectId: "social-media-61fcf",
  storageBucket: "social-media-61fcf.appspot.com",
  messagingSenderId: "896372137807",
  appId: "1:896372137807:web:36a268fbcae44c0d28ef3a",
  measurementId: "G-CJ2E0SC7ZX"
});

const theme = createTheme({
  palette: {
    primary: {
      main: '#244d61'
    },
    secondary: {
      main: '#eaebed'
    }
  }
})

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Main/>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);