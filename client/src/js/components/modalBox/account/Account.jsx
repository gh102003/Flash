import React from "react";
import jsonwebtoken from "jsonwebtoken";
import moment from "moment";

import { Login } from "./Login.jsx";

import "../../../../css/account.css";

export class Account extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            user: this.getUserFromAuthToken(localStorage.getItem("AuthToken"))
        };
    }

    getUserFromAuthToken(authToken) {
        const decodedAuthToken = jsonwebtoken.decode(authToken);

        if (!decodedAuthToken) {
            return null;
        }
        else {
            return {
                id: decodedAuthToken.id,
                username: decodedAuthToken.username,
                loginTimestamp: decodedAuthToken.iat // In Unix time
            };
        }
    }

    render() {
        let modalBox;

        if (!this.state.user) {
            modalBox = (
                <Login
                    afterLogin={response => {
                        localStorage.setItem("AuthToken", response.token);
                        this.setState({ user: this.getUserFromAuthToken(response.token) });
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
                            {this.state.user.username}
                        </h3>
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