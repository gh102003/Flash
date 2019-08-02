"use strict";

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect, Link } from "react-router-dom";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
// import MultiBackend from 'react-dnd-multi-backend';
// import HTML5toTouch from 'react-dnd-multi-backend/lib/HTML5toTouch'; // or any other pipeline

import * as constants from "./constants";

import "../css/stylesheet.css";
import "../css/flashcard.css";
import "../css/subcategory.css";
import "../css/add-card.css";
import "../css/modal-box.css";
import "../css/tag.css";
import "../favicon.png";

import { Category } from "./components/Category.jsx";
import { InfoBox } from "./components/modalBox/InfoBox.jsx";
import { TagManager } from "./components/modalBox/TagManager/TagManager.jsx";
import { Quiz } from "./components/quiz/Quiz.jsx";

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = { modalOpen: null };
    }

    componentDidMount() {
        this.getRootCategoryIdFromServer();
    }

    getRootCategoryIdFromServer() {
        fetch(`${constants.serverOrigin}/categories`, { method: "GET" })
            .then(response => {
                return response.json();
            })
            .then(response => {
                const rootCategory = response.categories[0];

                this.setState({ rootCategoryId: rootCategory.id });
            });
    }

    render() {
        return (
            <>
                <BrowserRouter>
                    <>
                        <header>
                            <Link to="/">
                                <h1>Flash</h1>
                            </Link>
                            <div className="header-buttons">
                                <i className="material-icons tag-manager-button" onClick={() => this.setState({ modalOpen: "tagManager" })}>local_offer</i>
                                <i className="material-icons info-button" onClick={() => this.setState({ modalOpen: "infoBox" })}>info</i>
                            </div>
                        </header>
                        <Switch>
                            <Route path="/category/:categoryId/quiz" exact component={Quiz} />
                            <Route path="/category/:id" exact component={Category} />
                            {this.state.rootCategoryId !== undefined &&
                                (<Redirect from="/" to={`/category/${this.state.rootCategoryId}`} exact />)
                            }
                        </Switch>
                    </>
                </BrowserRouter>
                {this.state.modalOpen === "tagManager" && <TagManager handleClose={() => this.setState({ modalOpen: null })}></TagManager>}
                {this.state.modalOpen === "infoBox" && <InfoBox handleClose={() => this.setState({ modalOpen: null })}></InfoBox>}
            </>
        );
    }
}

var PageDndContext = DragDropContext(HTML5Backend)(Page);
// var PageDndContext = DragDropContext(MultiBackend(HTML5toTouch))(Page);

window.onload = function () {
    ReactDOM.render(<PageDndContext></PageDndContext>, document.getElementById("root"));
}; 