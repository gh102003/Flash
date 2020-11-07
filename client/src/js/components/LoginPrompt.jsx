import React from "react";
import { useHistory, useLocation } from "react-router-dom";

export const LoginPrompt = props => {
    const history = useHistory();
    const location = useLocation();

    return <div className="modal-background modal-prompt-background" onClick={props.handleClose}>
        <div className="modal login-prompt" onClick={event => event.stopPropagation()}>
            <div className="modal-header">
                <h2>
                    Account Recommended
                </h2>
                <i className="material-icons button-close" onClick={props.handleClose}>close</i>
            </div>
            <div className="modal-body">
                {/* <p>
                    To mark topics with priorities, you need to be logged in to a Flash account. Without an account,
                    you&apos;ll only be able to look at the topics.
                </p> */}
                <p>
                    {props.children}
                </p>
                <p>
                    If you don&apos;t already have an account, you can sign up for free.
                </p>
                <div className="controls">
                    <button onClick={() => {
                        history.push("/account", { background: location });
                        props.handleClose();
                    }} className="primary">Log in or sign up</button>
                    <button onClick={props.handleClose}>Skip</button>
                </div>
            </div>
        </div>
    </div>
};