import React, { useContext } from "react";

import { UserContext } from "../../contexts/UserContext";
import * as util from "../../util";

export const SubscriptionStarted = props => {

    const currentUser = useContext(UserContext).currentUser;

    if (currentUser && util.hasFlashGold(currentUser)) {
        return (
            <div className="modal-background" onClick={props.handleClose} >
                <div className="modal subscription-started" onClick={event => event.stopPropagation()}>
                    <div className="modal-header">
                        <h2>Thank you!</h2>
                        <i className="material-icons button-close" onClick={props.handleClose}>close</i>
                    </div>
                    <div className="modal-body">
                        <p>
                            You&apos;re now subscribed to Flash Gold!
                        </p>

                        <p>
                            Enjoy all the extra features and thank you for contributing.
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
                            Unfortunately, there&apos;s been a problem starting your subscription.
                        </p>
                        <p>
                            Please try closing this window and refreshing the page. If the problem persists and
                            you still have no subscription, please contact support at <a className="link" href="mailto:support@flashapp.uk.to">support@flashapp.uk.to</a>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
};