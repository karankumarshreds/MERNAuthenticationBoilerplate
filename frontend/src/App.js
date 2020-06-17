import React from 'react';
import {BrowserRouter, Switch, Route, Router} from 'react-router-dom';
import './App.css';
import Home from './components/pages/Home';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Header from './components/layout/Header';
import AuthContextProvider from './context/AuthContext';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';

function App() {
  return (
    <>
    <BrowserRouter>
      <AuthContextProvider>
        <Header />
        <Switch>
          <Route exact path="/" render={() => <Home />}/>
          <Route exact path="/login" render={() => <Login />}/>
          <Route exact path="/register" render={() => <Register />}/>
          <Route exact path="/forgot-password" render={() => <ForgotPassword />}/>
          <Route exact path="/password-reset/:id" render={(props) => <ResetPassword token={props}/>}/>
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
    </>
  );
}

export default App;
