import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { DateTime } from "luxon";

import { Login } from "./Login.jsx";
import { UserContext } from "../../../contexts/UserContext";
import * as util from "../../../util";

import "../../../../css/account.css";
import { ProfilePictureEdit } from "./ProfilePictureEdit.jsx";

// Whole folder as dependency
// eslint-disable-next-line no-undef
require.context("../../../../res/profile-pictures/256");

export const Account = props => {

    const userContext = useContext(UserContext);
    const [editDialog, setEditDialog] = useState(null);

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
        const formattedLoginTime = DateTime.fromSeconds(userContext.currentUser.loginTimestamp).toRelative();
        const userHasRoles = userContext.currentUser && userContext.currentUser.roles && userContext.currentUser.roles.length > 0;
        modalBox = (
            <div className="modal account" onClick={event => event.stopPropagation()}>
                <div className="modal-header">
                    <h2>Account</h2>
                    <i className="material-icons button-close" onClick={props.handleClose}>close</i>
                </div>
                <div className="modal-body">
                    <div className={userHasRoles ? "user-info user-info-roles" : "user-info"}>
                        <div className="profile-picture">
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
                        <div className="role-badges">{renderRoleBadges()}</div>
                    </div>
                    <p>
                        {userContext.currentUser.emailAddress}
                    </p>
                    <p>
                        Logged in {formattedLoginTime}
                    </p>

                    <h3>Flash Gold</h3>
                    <Link className="link" to={{ pathname: "/account/subscription", state: location.state }}>{hasFlashGold ? "Manage subscription" : "Upgrade now!"}</Link>

                    <button className="btn-log-out" onClick={() => logOut()}>
                        Log out
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-background" onClick={props.handleClose} >
            {modalBox}
        </div>
    );
};