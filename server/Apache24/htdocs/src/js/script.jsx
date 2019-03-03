"use strict";

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Link, Route, Switch, Redirect } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import * as util from "./util";
import "../css/stylesheet.css";
import "../css/flashcard.css";
import "../css/subcategory.css";
import "../css/add-card.css";

import { Category } from "./components/Category.jsx";

class Page extends React.Component {
    constructor(props) {
        super(props);
    }

    handleAddButtonClick() {
        console.log("clicked");
    }

    render() {
        return (
            <div>
                <h1 className="app-title">Flash</h1>
                <BrowserRouter>
                    <Route>
                        <Switch>
                            <Route path="*/category/:id" component={Category} />
                            <Redirect from="/" to="/category/1" exact />
                        </Switch>
                    </Route>
                </BrowserRouter>
            </div>
        );
    }
}

window.onload = function () {
    ReactDOM.render(<Page />, document.getElementById("root"));
};