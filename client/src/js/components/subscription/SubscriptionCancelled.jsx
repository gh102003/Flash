import React, { useContext, useEffect } from "react";
import { Helmet } from "react-helmet";

import { UserContext } from "../../contexts/UserContext";
import * as util from "../../util";
import { useState } from "react";

export const SubscriptionCancelled = props => {
    const userContext = useContext(UserContext);
    const currentUser = userContext.currentUser;

    let [updating, setUpdating] = useState(true);
    // Refresh user data when modal is opened
    useEffect(() => {
        userContext.refreshUser().then(() => setUpdating(false));
    }, []);

    if (updating || (currentUser && !util.hasFlashGold(currentUser))) {
        return (
            <div className="modal-background" onClick={props.handleClose} >
                <Helmet>
                    <title>Subscription Cancelled</title>
                    <meta property="og:title" content="Subscription Cancelled" />
                </Helmet>
                <div className="modal subscription-cancelled" onClick={event => event.stopPropagation()}>
                    <div className="modal-header">
                        <h2>Goodbye</h2>
                        <i className="material-icons button-close" onClick={props.handleClose}>close</i>
                    </div>
                    <div className="modal-body">
                        <p>
                            We&apos;re sorry to see you go! If you have any feedback, please email <a className="link" href="mailto:feedback@flashapp.uk.to">feedback@flashapp.uk.to</a>

                        </p>
                        <p>
                            If you were no longer using your free trial, you will be charged a portion of the amount for this month.
                        </p>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="modal-background" onClick={props.handleClose} >
                <div className="modal subscription-started" onClick={event => event.stopPropagation()}>
                    <div className="modal-header">
                        <h2>Error</h2>
                        <i className="material-icons button-close" onClick={props.handleClose}>close</i>
                    </div>
                    <div className="modal-body">
                        <p>
                            Unfortunately, there&apos;s been a problem cancelling your subscription.
                        </p>
                        <p>
                            Please try closing this window and refreshing the page. If the problem persists and
                            you still are subscribed, please contact support at <a href="mailto:support@flashapp.uk.to">support@flashapp.uk.to</a>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
};