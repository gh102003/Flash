import React from "react";
import moment from "moment";

import { Login } from "./Login.jsx";
import * as util from "../../../util";

import "../../../../css/account.css";

export class Account extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            user: util.getUserFromAuthToken(localStorage.getItem("AuthToken"))
        };
    }

    async componentDidMount() {
        // If logged in but not enough data about the user
        if (this.state.user && !this.state.user.username) {
            // Get more data about user in a request
            const userResponse = await util.authenticatedFetch("users/" + this.state.user.id, {
                method: "GET"
            });
            const userData = await userResponse.json();

            this.setState(oldState => ({ user: { ...userData, ...oldState.user } }));
        }
    }

    renderRoleBadges() {
        if (!this.state.user || !this.state.user.roles) return null;
        return this.state.user.roles.map(role => (
            <span key={role} className={`role-badge role-badge-${role}`}>{role}</span>
        ));
    }

    render() {
        let modalBox;

        if (!this.state.user) {
            modalBox = (
                <Login
                    afterLogin={async (loginResponse) => {
                        localStorage.setItem("AuthToken", loginResponse.token);
                        const loginResponseData = util.getUserFromAuthToken(loginResponse.token);

                        // Get more data about user in a separate request
                        const userResponse = await util.authenticatedFetch("users/" + loginResponseData.id, {
                            method: "GET"
                        });
                        const userData = await userResponse.json();

                        this.setState({ user: { ...userData, ...loginResponseData } });
                        this.props.afterAccountChange();
                    }}
                    handleClose={this.props.handleClose}
                />
            );
        } else {
            let formattedLoginTime = moment.unix(this.state.user.loginTimestamp).fromNow();
            modalBox = (
                <div className="modal account" onClick={event => event.stopPropagation()}>
                    <div className="modal-header">
                        <h2>Account</h2>
                        <i className="material-icons button-close" onClick={this.props.handleClose}>close</i>
                    </div>
                    <div className="modal-body">
                        <h3 className="username">
                            {this.state.user.username}{this.renderRoleBadges()}
                        </h3>
                        <p>
                            {this.state.user.emailAddress}
                        </p>
                        <p>
                            Logged in {formattedLoginTime}
                        </p>
                        <button onClick={() => {
                            localStorage.removeItem("AuthToken");
                            this.setState({ user: null });
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