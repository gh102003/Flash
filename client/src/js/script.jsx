"use strict";

import React from "react";
import { Helmet } from "react-helmet";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect, Link } from "react-router-dom";
import { DndContext, DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import TouchBackend from "react-dnd-touch-backend";
import MultiBackend, { MouseTransition, TouchTransition } from "react-dnd-multi-backend";
// import HTML5toTouch from "react-dnd-multi-backend/lib/HTML5toTouch"; // or any other pipeline

import * as util from "./util";
import * as serviceWorker from "./initServiceWorker";

import "../css/stylesheet.css";
import "../css/flashcard.css";
import "../css/subcategory.css";
import "../css/add-card.css";
import "../css/modal-box.css";
import "../css/tag.css";

import "../ios-splashscreens"; // All in folder, using index.js
import "../favicon.png";
import "../icons-192.png";
import "../icons-512.png";
import "../apple-touch-icon.png";

import { UserContext } from "./contexts/UserContext";

import { Category } from "./components/Category.jsx";
import { InfoBox } from "./components/modalBox/InfoBox.jsx";
import { Account } from "./components/modalBox/account/Account.jsx";
import { TagManager } from "./components/modalBox/tagManager/TagManager.jsx";
import { Quiz } from "./components/quiz/Quiz.jsx";
import { NetworkIndicator } from "./components/NetworkIndicator.jsx";

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: null,
            currentUser: util.getUserFromAuthToken(localStorage.getItem("AuthToken"))
        };
    }

    componentDidMount() {
        this.getRootCategoryIdFromServer();

        // If logged in but not enough data about the user
        if (this.state.currentUser && !this.state.currentUser.username) {
            this.getUserData();
        }
    }

    async getUserData() {
        // Get more data about user in a request
        const userResponse = await util.authenticatedFetch("users/" + this.state.currentUser.id, {
            method: "GET"
        });
        const userData = await userResponse.json();

        this.setState({ currentUser: { ...userData, ...this.state.currentUser } });
    }

    async getRootCategoryIdFromServer() {
        this.setState({ rootCategoryId: undefined });
        let response = await util.authenticatedFetch("categories", { method: "GET" });
        let responseData = await response.json();

        // Handle invalid auth tokens
        if (responseData.message != null && responseData.message.includes("token")) {
            localStorage.removeItem("AuthToken");
            response = await util.authenticatedFetch("categories", { method: "GET" });
            responseData = await response.json();
        }

        const rootCategory = responseData.categories[0];
        this.setState({ rootCategoryId: rootCategory.id });
    }

    render() {
        return (
            <UserContext.Provider value={{
                currentUser: this.state.currentUser,
                changeUser: newUser => this.setState({ currentUser: newUser })
            }}>
                <BrowserRouter>
                    <>
                        <Helmet>
                            <title>Flash</title>
                            <meta property="og:site_name" content="Flash" />
                            <meta property="og:description" content="Create, manage and practise with your own flashcards!" />
                        </Helmet>
                        <header>
                            <Link to="/">
                                <h1>Flash</h1>
                            </Link>
                            <div className="header-buttons">
                                <i className="material-icons tag-manager-button" onClick={() => this.setState({ modalOpen: "tagManager" })}>local_offer</i>
                                <i className="material-icons account-button" onClick={() => this.setState({ modalOpen: "account" })}>{this.state.currentUser ? "person" : "account_circle"}</i>
                                <i className="material-icons info-button" onClick={() => this.setState({ modalOpen: "infoBox" })}>info</i>
                            </div>
                        </header>
                        <Switch>
                            <Route path="/quiz/category/:categoryId" exact component={Quiz} />
                            <Route path="/quiz/tag/:tagId" exact component={Quiz} />
                            <Route path="/category/:id" exact render={(routeProps) => (
                                <Category {...routeProps} handleInvalidAuthToken={invalidToken => {
                                    if (invalidToken) {
                                        localStorage.removeItem("AuthToken");
                                    }
                                    // Get a new root category based on the authenticated user, then go to it
                                    this.getRootCategoryIdFromServer()
                                        .then(() => routeProps.history.push("/"));
                                }} />
                            )} />
                            <Route render={() => {
                                // If there's a root category loaded then go to it, otherwise do nothing until the next render
                                if (this.state.rootCategoryId) {
                                    return <Redirect from="/" to={`/category/${this.state.rootCategoryId}`} exact />;
                                } else {
                                    return <div className="categories-loading"><NetworkIndicator /></div>;
                                }
                            }} />
                        </Switch>
                        {this.state.modalOpen === "tagManager" && <TagManager handleClose={() => this.setState({ modalOpen: null })} />}
                        {this.state.modalOpen === "account" &&
                            // Use a blank route for account to get access to history
                            <Route render={({ history }) => (
                                <Account handleClose={() => this.setState({ modalOpen: null })} afterAccountChange={() => {
                                    // Get a new root category based on the authenticated user, then go to it
                                    this.getRootCategoryIdFromServer()
                                        .then(() => history.push("/"));
                                }} />
                            )} />
                        }
                        {this.state.modalOpen === "infoBox" && <InfoBox handleClose={() => this.setState({ modalOpen: null })} />}
                    </>
                </BrowserRouter>
            </UserContext.Provider>
        );
    }
}

const DndBackendPipeline = {
    backends: [
        {
            backend: HTML5Backend,
            transition: MouseTransition
        },
        {
            backend: TouchBackend,
            options: { enableMouseEvents: true, delay: 500, delayTouchStart: 500 },
            preview: true,
            transition: TouchTransition
        },
    ]
};

const PageDnd = () => (
    // <DndProvider backend={HTML5Backend}>
    <DndProvider backend={MultiBackend(DndBackendPipeline)}>
        <Page />
    </DndProvider>
);

window.onload = function () {
    ReactDOM.render(
        <PageDnd />,
        document.getElementById("root")
    );
};

serviceWorker.register();
