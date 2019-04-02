"use strict";

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { DragDropContext, DragDropContextProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import * as util from "./util";
import "../css/stylesheet.css";
import "../css/flashcard.css";
import "../css/subcategory.css";
import "../css/add-card.css";
import "../css/info-box.css";

import { Category } from "./components/Category.jsx";
import { InfoBox } from "./components/InfoBox.jsx";

class Page extends React.Component {
    constructor(props) {
        super(props);

        this.state = { infoBoxOpen: false };
    }

    handleAddButtonClick() {
        console.log("clicked");
    }

    render() {
        return (
            <div>
                <div className="header">
                    <h1>Flash</h1>
                    <i className="material-icons" onClick={() => this.setState({ infoBoxOpen: true })}>info</i>
                </div>
                {this.state.infoBoxOpen && <InfoBox handleClose={() => this.setState({ infoBoxOpen: false })}></InfoBox>}
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

var PageDndContext = DragDropContext(HTML5Backend)(Page);

window.onload = function () {
    ReactDOM.render(<PageDndContext></PageDndContext>, document.getElementById("root"));
}; 