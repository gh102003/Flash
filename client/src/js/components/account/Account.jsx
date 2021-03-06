import React, { useContext, useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link, useLocation } from "react-router-dom";
import { DateTime } from "luxon";
import { GlobalHotKeys } from "react-hotkeys";


import { Login } from "./Login.jsx";
import { NetworkIndicator } from "../NetworkIndicator.jsx";
import { UserContext } from "../../contexts/UserContext";
import * as constants from "../../constants";
import * as util from "../../util";

import "../../../css/account.scss";
import { ProfilePictureEdit } from "./ProfilePictureEdit.jsx";

// Whole folder as dependency
// eslint-disable-next-line no-undef
require.context("../../../res/profile-pictures/256", true, /^\.\/.*$/, "lazy");

export const Account = props => {

    const userContext = useContext(UserContext);
    const [editDialog, setEditDialog] = useState(null);
    const [emailVerificationTriggered, setEmailVerificationTriggered] = useState(false); // Makes sure user can't spam verify, must close modal and reopen first

    useEffect(() => {
        userContext.refreshUser();
    }, []);

    const renderRoleBadges = () => {
        if (!userContext.currentUser || !userContext.currentUser.roles) return null;
        return userContext.currentUser.roles.map(role => (
            <span key={role} className={`role-badge role-badge-${role}`}>{role}</span>
        ));
    };

    const logOut = () => {
        localStorage.removeItem("AuthToken");
        userContext.changeUser(null);
        props.afterAccountChange();
    };

    const location = useLocation();

    let modalBox;

    if (!userContext.currentUser) {
        modalBox = (
            <Login
                afterLogin={async loginResponse => {
                    localStorage.setItem("AuthToken", loginResponse.token);

                    let loginResponseData;
                    try {
                        loginResponseData = util.getUserFromAuthToken(loginResponse.token);
                    } catch (error) {
                        logOut();
                        return;
                    }

                    // Log out if the token is invalid or expired
                    if (!loginResponseData) {
                        logOut();
                    }

                    userContext.changeUser({ ...loginResponseData });
                    userContext.refreshUser();
                    props.afterAccountChange();
                }}
                handleClose={props.handleClose}
            />
        );
    } else {
        const hasFlashGold = util.hasFlashGold(userContext.currentUser);
        const formattedLoginTime = (userContext.currentUser && userContext.currentUser.loginTimestamp) ? DateTime.fromSeconds(userContext.currentUser.loginTimestamp).toRelative() : "";
        const userHasRoles = userContext.currentUser && userContext.currentUser.roles && userContext.currentUser.roles.length > 0;
        modalBox = (
            <div className="modal account" role="dialog" aria-labelledby="account-modal-title" onClick={event => event.stopPropagation()}>
                <Helmet>
                    <title>Account</title>
                    <meta property="og:title" content="Account" />
                </Helmet>
                <div className="modal-header">
                    <h2 id="account-modal-title">Account</h2>
                    <i className="material-icons button-close" onClick={props.handleClose}>close</i>
                </div>
                <div className="modal-body">
                    {userContext.currentUser.emailAddress ? // Wait for extended user data to be loaded
                        <>
                            <div className={userHasRoles ? "user-info user-info-roles" : "user-info"}>
                                <div className={"profile-picture" + (hasFlashGold ? " profile-picture-flash-gold" : "")}>
                                    {userContext.currentUser.profilePicture && <img
                                        src={"/res/profile-pictures/256/" + userContext.currentUser.profilePicture + ".png"}
                                        draggable="false"
                                        onClick={event => setEditDialog(editDialog ? null : "profilePicture")} // Event is here because click events are disabled for span in CSS
                                        tabIndex="0"
                                    />}
                                    <span>
                                        <i className="material-icons">edit</i>
                                        Change
                                    </span>
                                    {editDialog === "profilePicture" && <ProfilePictureEdit handleClose={() => setEditDialog(null)} />}
                                </div>
                                <h3 className="username">
                                    {userContext.currentUser.username}
                                </h3>
                                <div className="role-badges">
                                    {renderRoleBadges()}
                                    {hasFlashGold && <span className={`role-badge role-badge-flash-gold`}>Flash Gold</span>}
                                </div>
                            </div>
                            <p>
                                {userContext.currentUser.emailAddress}
                                {userContext.currentUser.verifiedEmail ?
                                    <span className="email-verification email-verified"> (verified)</span>
                                    : <span className="email-verification email-not-verified"> (not verified:&nbsp;
                                        {
                                            emailVerificationTriggered ? "check your emails"
                                                : <a className="link" href="" onClick={async event => {
                                                    event.preventDefault();
                                                    setEmailVerificationTriggered(true);
                                                    const response = await util.authenticatedFetch("users/resend-verification-email", { method: "GET" });
                                                    if (!response.ok) {
                                                        alert("Flash could not send a verification email");
                                                        setEmailVerificationTriggered(false);
                                                    }
                                                }}>click here</a>
                                        })
                                    </span>
                                }
                            </p>
                            <p>
                                Logged in {formattedLoginTime}
                            </p>

                            <div className="get-flash-gold-cta">
                                <h3>Flash Gold</h3>
                                {!hasFlashGold &&
                                    <p>
                                        Flash Gold comes with even more features and expands on both the appearance and functionality of Flash.
                                    </p>
                                }
                                <Link className="link" to={{ pathname: "/account/subscription", state: location.state }}>{hasFlashGold ? "Manage subscription" : "Find out more"}</Link>
                            </div>
                        </>
                        : <NetworkIndicator />
                    }

                    <button className="btn-log-out" onClick={() => logOut()}>
                        Log out
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-background" onClick={props.handleClose} >
            <GlobalHotKeys keyMap={constants.keyMap} handlers={{
                CLOSE_MODAL_BOX: props.handleClose
            }} />
            {modalBox}
        </div>
    );
};