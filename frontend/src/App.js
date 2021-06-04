import React, {useEffect, useState} from 'react'
import {HashRouter, Route, Switch} from 'react-router-dom'
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import './App.css';
function App() {
    return (
      <HashRouter>
        <div className="container-fluid">
             <Switch>
              <Route exact path="/login" component={Login}/>
              <Route exact path="/register" component={Register}/>
              <Route exact path="/chat" component={Chat}/>
             </Switch>
        </div>
      </HashRouter>
    );
  }

export default App
