import React from "react";
import { ThemeProvider, CssBaseline } from "@material-ui/core";
import Theme from "./Theme";
import "./App.css";

import { Route, Link } from "react-router-dom";
import Login from "./pages/login";
import HomeCi from "./pages/HomeCi";
import HomeIa from "./pages/HomeIa";

import newProfile from "./pages/citizen/newProfile";
import viewProfile from "./pages/citizen/viewProfile";

function App() {
    return (
        <div className="App">
            <ThemeProvider theme={Theme}>
                <CssBaseline />
                <Link to="/">
                    <h1>IAN</h1>
                </Link>
                <Route exact path="/" component={Login}></Route>
                <Route exact path="/HomeCi" component={HomeCi}></Route>
                <Route exact path="/HomeIa" component={HomeIa}></Route>

                <Route exact path="/citizen/viewProfile/:id" component={viewProfile}></Route>
                <Route exact path="/citizen/newProfile" component={newProfile}></Route>
            </ThemeProvider>
        </div>
    );
}

export default App;
