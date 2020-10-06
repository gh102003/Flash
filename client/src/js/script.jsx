"use strict";

import React from "react";
import { Helmet } from "react-helmet";
import { GlobalHotKeys, configure as configureHotkeys } from "react-hotkeys";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect, Link } from "react-router-dom";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import TouchBackend from "react-dnd-touch-backend";
import MultiBackend, { MouseTransition, TouchTransition } from "react-dnd-multi-backend";
import ReactGA from "react-ga";
import { createBrowserHistory } from "history";

import * as util from "./util";
import * as envConstants from "./envConstants";
import * as constants from "./constants";
import * as serviceWorker from "./initServiceWorker";

import "../css/stylesheet.scss";
import "../css/flashcard.scss";
import "../css/subcategory.scss";
import "../css/add-card.scss";
import "../css/modal-box.scss";
import "../css/tag.scss";
import "../css/dark-theme.scss";
import "../css/hints.scss";

import "../res/ios-splashscreens"; // All in folder, using index.js
import "../res/icons";

import { UserContext } from "./contexts/UserContext";

import { Category } from "./components/Category.jsx";
import { Prioritise } from "./components/prioritise/Prioritise.jsx";
import { InfoBox } from "./components/InfoBox.jsx";
import { Account } from "./components/account/Account.jsx";
import { TagManager } from "./components/tagManager/TagManager.jsx";
import { Quiz } from "./components/quiz/Quiz.jsx";
import { NetworkIndicator } from "./components/NetworkIndicator.jsx";
import { TrackingConsent } from "./components/TrackingConsent.jsx";
import { ToggleDarkTheme } from "./components/ToggleDarkTheme.jsx";
import { ManageSubscription } from "./components/subscription/ManageSubscription.jsx";
import { SubscriptionStarted } from "./components/subscription/SubscriptionStarted.jsx";
import { SubscriptionUpdatedPayment } from "./components/subscription/SubscriptionUpdatedPayment.jsx";
import { SubscriptionCancelled } from "./components/subscription/SubscriptionCancelled.jsx";
import { PaymentHistory } from "./components/subscription/PaymentHistory.jsx";
import { FlashGoldTerms } from "./components/subscription/FlashGoldTerms.jsx";
import { VerifyEmailAddress } from "./components/account/VerifyEmailAddress.jsx";
import { ModeSelector } from "./components/modeSelector/ModeSelector.jsx";
import { CoronavirusInfo } from "./components/CoronavirusInfo.jsx";
import { Privacy } from "./components/Privacy.jsx";
import { BottomBannerAd } from "./components/ads/BottomBannerAd.jsx";

configureHotkeys({
    ignoreKeymapAndHandlerChangesByDefault: false
});

class Page extends React.Component {
    constructor(props) {
        super(props);

        let trackingConsent = localStorage.getItem("TrackingConsentTimestamp");
        if (trackingConsent < new Date("2020-04-22")) { // Date the consent message was updated
            trackingConsent = null;
            localStorage.removeItem("TrackingConsentTimestamp");
        }

        if (trackingConsent) {
            this.initAnalytics();
        }

        this.state = {
            modalOpen: trackingConsent === null ? "trackingConsent" : null,
            currentUser: util.getUserFromAuthToken(localStorage.getItem("AuthToken")),
            theme: "light"
        };
    }

    componentDidMount() {
        this.getRootCategoryIdFromServer();

        // If logged in but not enough data about the user
        if (this.state.currentUser && !this.state.currentUser.username) {
            this.getUserData();
        }

        // Initialize google analytics page view tracking
        const history = createBrowserHistory();
        history.listen(location => {
            console.log("pageview");

            ReactGA.set({ page: location.pathname }); // Update the user's current page
            ReactGA.pageview(location.pathname); // Record a pageview for the given page
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.currentUser !== this.state.currentUser) {
            if (util.hasFlashGold(this.state.currentUser) && window.matchMedia) {
                const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
                if (darkModeMediaQuery.matches) {
                    this.setState({ theme: "dark" });
                    // Background underneath content (html element) is also styled for consistency
                    document.documentElement.style.backgroundColor = "#222";
                }
                darkModeMediaQuery.addListener(event => {
                    this.setState({ theme: event.matches ? "dark" : "light" });
                    document.documentElement.style.backgroundColor = event.matches ? "#222" : "#fff";
                });
            } else {
                this.setState({ theme: "light" });
                document.documentElement.style.backgroundColor = "#fff";
            }
        }
    }

    async getUserData() {
        // Get more data about user in a request
        const userResponse = await util.authenticatedFetch("users/" + this.state.currentUser.id, {
            method: "GET"
        });
        if (userResponse.status === 200) {
            const userData = await userResponse.json();

            this.setState({ currentUser: { ...userData, ...this.state.currentUser } });
        } else {
            this.setState({ currentUser: null });
            localStorage.removeItem("AuthToken");
            this.getRootCategoryIdFromServer().then(() => history.pushState(null, null, "/"));
        }
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

    returnToBackgroundLocation(history, location) {
        history.push(location.state ? location.state.background.pathname : "/");
    }

    initAnalytics() {
        if (process.env.NODE_ENV === "production") {
            console.log("init analytics");

            ReactGA.initialize(constants.googleAnalyticsTrackingId, {
                gaOptions: {
                    siteSpeedSampleRate: 20,
                    anonymizeIp: true
                }
            });
        } else {
            console.log("init analytics");

            window.ga_debug = { trace: true };

            ReactGA.initialize(constants.googleAnalyticsTrackingId, {
                debug: true,
                gaOptions: {
                    siteSpeedSampleRate: 20,
                    anonymizeIp: true
                }
            });
        }
    }

    render() {
        const hasFlashGold = util.hasFlashGold(this.state.currentUser);

        return (
            <UserContext.Provider value={{
                currentUser: this.state.currentUser,
                changeUser: newUser => {
                    // Update analytics
                    ReactGA.set({
                        userId: newUser,
                        hasFlashGold: util.hasFlashGold(newUser)
                    });
                    this.setState({ currentUser: newUser });
                },
                refreshUser: async () => {
                    if (!this.state.currentUser) {
                        return;
                    }
                    const userId = this.state.currentUser.id;

                    // Get more data about user in a separate request
                    let userResponse;
                    userResponse = await util.authenticatedFetch("users/" + userId, {
                        method: "GET"
                    });
                    if (userResponse.status !== 200) {
                        // Log out if the token is invalid or expired
                        this.setState({ currentUser: null });
                        localStorage.removeItem("AuthToken");
                        return;
                    }
                    const userData = await userResponse.json();

                    this.setState({ currentUser: { ...this.state.currentUser, ...userData, subscription: { ...userData.subscription } } });
                }
            }}>
                <Helmet
                    defaultTitle="Flash"
                    titleTemplate="%s - Flash"
                >
                    <meta property="og:site_name" content="Flash" />
                    <meta property="og:description" content="Create, manage and practise with your own flashcards!" />
                </Helmet>
                <div className={hasFlashGold ? "banner-ad-wrapper ads-hidden" : "banner-ad-wrapper"}>
                    <BrowserRouter>
                        <Route render={({ match, location, history }) => (
                            <div className={"theme theme-" + this.state.theme}>
                                <header>
                                    <span>
                                        <Link to="/">
                                            <h1>Flash</h1>
                                        </Link>
                                        <h2 className="mode-heading">
                                            <Switch location={location.state ? location.state.background : location}>
                                                <Route path="/quiz" render={() => "Quiz"} />
                                                <Route path="/category" render={() => <Link to={"/category"}>Learn</Link>} />
                                                <Route path="/prioritise" render={() => <Link to={"/prioritise"}>Prioritise</Link>} />
                                            </Switch>
                                        </h2>
                                    </span>
                                    <div className="header-buttons">
                                        {hasFlashGold &&
                                            <ToggleDarkTheme theme={this.state.theme} setTheme={theme => {
                                                document.documentElement.style.backgroundColor = theme === "dark" ? "#222" : "#fff";
                                                this.setState({ theme });
                                            }} />
                                        }
                                        {/* <Link className="home-button" to="/">
                                        <i className="material-icons">home</i>
                                    </Link> */}
                                        {/* <Link className="tag-manager-button" to={{
                                        pathname: "/tag-manager",
                                        // Save current location for the background while modal is open
                                        // Flow is the current flow, like "start_subscription"
                                        state: { background: location, flow: null }
                                    }}>
                                        <i className="material-icons">local_offer</i>
                                    </Link> */}
                                        <Link className={"account-button" + (hasFlashGold ? " account-button-gold" : "")} to={{
                                            pathname: "/account",
                                            state: { ...location.state, background: location }
                                        }}>
                                            {
                                                this.state.currentUser && this.state.currentUser.profilePicture ?
                                                    <img src={"/res/profile-pictures/128/" + this.state.currentUser.profilePicture + ".png"} alt="account" />
                                                    : <i className="material-icons">person</i>
                                            }
                                        </Link>
                                        <Link className="info-button" to={{
                                            pathname: "/info",
                                            state: { ...location.state, background: location }
                                        }}>
                                            <i className="material-icons">info</i>
                                        </Link>
                                    </div>
                                </header>
                                {/* Intercept location and use the background location if it exists */}
                                <Switch location={location.state ? location.state.background : location}>
                                    <Route path="/quiz/category/:categoryId" exact component={Quiz} />
                                    <Route path="/quiz/tag/:tagId" exact component={Quiz} />
                                    <Route path="/category/:id" exact render={(routeProps) => (
                                        <Category {...routeProps} handleInvalidAuthToken={invalidToken => {
                                            if (invalidToken) {
                                                localStorage.removeItem("AuthToken");
                                                this.setState({ currentUser: null });
                                            }
                                            // Get a new root category based on the authenticated user, then go to it
                                            this.getRootCategoryIdFromServer()
                                                .then(() => routeProps.history.push("/"));
                                        }} />
                                    )} />
                                    <Route path="/prioritise" component={Prioritise} />
                                    <Route path="/coronavirus" component={CoronavirusInfo} />
                                    <Route path="/privacy" component={Privacy} />
                                    <Route path="/category" render={() => {
                                        // If there's a root category loaded then go to it, otherwise do nothing until the next render
                                        if (this.state.rootCategoryId) {
                                            if (location.pathname === "/category") {
                                                return <Redirect from="/category" to={`/category/${this.state.rootCategoryId}`} exact />;
                                            } else {
                                                // Redirect the background if a modal is open
                                                return <Redirect to={{
                                                    pathname: location.pathname,
                                                    state: {
                                                        ...location.state,
                                                        background: {
                                                            pathname: `/category/${this.state.rootCategoryId}`
                                                        }
                                                    }
                                                }} />;
                                            }
                                        } else {
                                            return <div className="categories-loading"><NetworkIndicator /></div>;
                                        }
                                    }} />
                                    <Route component={ModeSelector} />
                                </Switch>

                                <GlobalHotKeys keyMap={constants.keyMap} handlers={{
                                    OPEN_INFO_MODAL_BOX: () => {
                                        if (location.state && location.state.background) {
                                            history.push("/info", { ...location.state, background: location.state.background });
                                        } else {
                                            history.push("/info", { ...location.state, background: location });
                                        }
                                    },
                                    OPEN_ACCOUNT_MODAL_BOX: () => {
                                        if (location.state && location.state.background) {
                                            history.push("/account", { ...location.state, background: location.state.background });
                                        } else {
                                            history.push("/account", { ...location.state, background: location });
                                        }
                                    },
                                    OPEN_TAG_MANAGER_MODAL_BOX: () => {
                                        if (location.state && location.state.background) {
                                            history.push("/tag-manager", { ...location.state, background: location.state.background });
                                        } else {
                                            history.push("/tag-manager", { ...location.state, background: location });
                                        }
                                    },
                                    TOGGLE_THEME: () => {
                                        if (hasFlashGold) {
                                            if (this.state.theme === "dark") {
                                                document.documentElement.style.backgroundColor = "#fff";
                                                this.setState({ theme: "light" });
                                            } else {
                                                document.documentElement.style.backgroundColor = "#222";
                                                this.setState({ theme: "dark" });
                                            }
                                        }
                                    }
                                }} />

                                {this.state.modalOpen === "trackingConsent" ? // Hide modals from routes if tracking consent modal is open
                                    <TrackingConsent handleClose={didAgree => {
                                        if (didAgree) {
                                            this.initAnalytics();
                                        }
                                        this.setState({ modalOpen: null });
                                    }} /> :
                                    <Switch>
                                        <Route path="/tag-manager" exact>
                                            {/* Restore background's url */}
                                            <TagManager handleClose={() => this.returnToBackgroundLocation(history, location)} />
                                        </Route>
                                        <Route path="/account" exact>
                                            <Account
                                                handleClose={() => this.returnToBackgroundLocation(history, location)}
                                                afterAccountChange={() => {
                                                    // Get a new root category based on the authenticated user, then go to it in the background
                                                    this.getRootCategoryIdFromServer()
                                                        .then(() => history.push("/account", { ...location.state, background: { pathname: "/" } }));
                                                }}
                                            />
                                        </Route>

                                        <Route path="/account/verify-email/:emailVerificationToken" render={routeProps => (
                                            <VerifyEmailAddress emailVerificationToken={routeProps.match.params.emailVerificationToken} handleClose={() => history.push("/account", location.state)} />
                                        )} />
                                        <Route path="/account/subscription" exact>
                                            <ManageSubscription handleClose={() => history.push("/account", location.state)} />
                                        </Route>
                                        <Route path="/account/subscription/started" exact>
                                            <SubscriptionStarted handleClose={() => history.push("/account/subscription", location.state)} />
                                        </Route>
                                        <Route path="/account/subscription/updated-payment" exact>
                                            <SubscriptionUpdatedPayment handleClose={() => history.push("/account/subscription", location.state)} />
                                        </Route>
                                        <Route path="/account/subscription/cancelled" exact>
                                            <SubscriptionCancelled handleClose={() => history.push("/account/subscription", location.state)} />
                                        </Route>
                                        <Route path="/account/subscription/payment-history" exact>
                                            <PaymentHistory handleClose={() => history.push("/account/subscription", location.state)} />
                                        </Route>
                                        <Route path="/account/subscription/terms" exact>
                                            <FlashGoldTerms handleClose={() => history.push("/account/subscription", location.state)} />
                                        </Route>
                                        <Route path="/info" exact>
                                            <InfoBox handleClose={() => this.returnToBackgroundLocation(history, location)} />
                                        </Route>
                                    </Switch>
                                }
                            </div>
                        )}>
                        </Route>
                    </BrowserRouter>
                    <BottomBannerAd />
                </div>
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
            backend: TouchBackend({ enableMouseEvents: true, delay: 250 }),
            preview: true,
            transition: TouchTransition
        },
    ]
};

const PageDnd = () => (
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
