// Core packages
import React from 'react';
import {Route, Link, Switch} from "react-router-dom";

// Styles
import './App.css';

// pages
import {Home} from './pages/home';
import {Graphics} from './pages/graphics';

const App = () => (
    <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand" to="/">Home</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link to="/dashboard">Graphics-Markup</Link>
                    </li>
                </ul>
            </div>
        </nav>

        <div>
            <Switch>
                <Route path="/dashboard" component={Graphics} />
                <Route path="/" component={Home} />
            </Switch>
        </div>

        <footer className="footer">
            <div className="container">
                <span className="text-muted">Place sticky footer content here.</span>
            </div>
        </footer>

    </div>
);

export default App;
