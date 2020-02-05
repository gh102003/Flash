import React, { useEffect, useContext } from "react";

import { UserContext } from "../../contexts/UserContext";

export const SubscriptionUpdatedPayment = props => {

    const userContext = useContext(UserContext);

    // Refresh user data when modal is opened
    useEffect(() => {
        userContext.refreshUser();
    }, []);

    return (
        <div className="modal-background" onClick={props.handleClose} >
            <div className="modal subscription-updated-payment" onClick={event => event.stopPropagation()}>
                <div className="modal-header">
                    <h2>Success!</h2>
                    <i className="material-icons button-close" onClick={props.handleClose}>close</i>
                </div>
                <div className="modal-body">
                    Your payment details have been updated.
                </div>
            </div>
        </div>
    );
};