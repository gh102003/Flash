import React from "react";
import { DateTime } from "luxon";

import { Login } from "./Login.jsx";
import { UserContext } from "../../../contexts/UserContext";
import * as util from "../../../util";

import "../../../../css/account.css";

export class Account extends React.Component {

    renderRoleBadges() {
        if (!this.context.currentUser || !this.context.currentUser.roles) return null;
        return this.context.currentUser.roles.map(role => (
            <span key={role} className={`role-badge role-badge-${role}`}>{role}</span>
        ));
    }

    render() {
        let modalBox;

        if (!this.context.currentUser) {
            modalBox = (
                <Login
                    afterLogin={async loginResponse => {
                        localStorage.setItem("AuthToken", loginResponse.token);
                        const loginResponseData = util.getUserFromAuthToken(loginResponse.token);

                        // Get more data about user in a separate request
                        const userResponse = await util.authenticatedFetch("users/" + loginResponseData.id, {
                            method: "GET"
                        });
                        const userData = await userResponse.json();

                        this.context.changeUser({ ...userData, ...loginResponseData });
                        this.props.afterAccountChange();
                    }}
                    handleClose={this.props.handleClose}
                />
            );
        } else {
            let formattedLoginTime = DateTime.fromSeconds(this.context.currentUser.loginTimestamp).toRelative();
            modalBox = (
                <div className="modal account" onClick={event => event.stopPropagation()}>
                    <div className="modal-header">
                        <h2>Account</h2>
                        <i className="material-icons button-close" onClick={this.props.handleClose}>close</i>
                    </div>
                    <div className="modal-body">
                        <h3 className="username">
                            {this.context.currentUser.username}{this.renderRoleBadges()}
                        </h3>
                        <p>
                            {this.context.currentUser.emailAddress}
                        </p>
                        <p>
                            Logged in {formattedLoginTime}
                        </p>
                        <button onClick={() => {
                            localStorage.removeItem("AuthToken");
                            this.context.changeUser(null);
                            this.props.afterAccountChange();
                        }}>
                            Log out
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className="modal-background" onClick={this.props.handleClose} >
                {modalBox}
            </div>
        );
    }
}

Account.contextType = UserContext;