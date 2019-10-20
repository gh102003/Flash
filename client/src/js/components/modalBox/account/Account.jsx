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

    render() {
        let modalBox;

        if (!this.state.user) {
            modalBox = (
                <Login
                    afterLogin={response => {
                        localStorage.setItem("AuthToken", response.token);
                        this.setState({ user: util.getUserFromAuthToken(response.token) });
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