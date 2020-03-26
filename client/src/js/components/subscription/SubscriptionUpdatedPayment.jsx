import React, { useEffect, useContext } from "react";
import { Helmet } from "react-helmet";

import { UserContext } from "../../contexts/UserContext";

export const SubscriptionUpdatedPayment = props => {

    const userContext = useContext(UserContext);

    // Refresh user data when modal is opened
    useEffect(() => {
        userContext.refreshUser();
    }, []);

    //TODO: show error if details couldn't be updated
    return (
        <div className="modal-background" onClick={props.handleClose} >
            <Helmet>
                <title>Subscription Updated</title>
                <meta property="og:title" content="Subscription Updated" />
            </Helmet>
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