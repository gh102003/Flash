import React from "react";
import moment from "moment";

import { Login } from "./Login.jsx";
import { UserContext } from "../../../contexts/UserContext";
import * as util from "../../../util";

import "../../../../css/account.css";

export class Account extends React.Component {

    async componentDidMount() {
        // If logged in but not enough data about the user
        if (this.context.currentUser && !this.context.currentUser.username) {
            // Get more data about user in a request
            const userResponse = await util.authenticatedFetch("users/" + this.context.currentUser.id, {
                method: "GET"
            });
            const userData = await userResponse.json();

            this.context.changeUser({...userData, ...this.context.currentUser});
        }
    }

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

                        this.context.changeUser({...userData, ...loginResponseData});
                        this.props.afterAccountChange();
                    }}
                    handleClose={this.props.handleClose}
                />
            );
        } else {
            let formattedLoginTime = moment.unix(this.context.currentUser.loginTimestamp).fromNow();
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