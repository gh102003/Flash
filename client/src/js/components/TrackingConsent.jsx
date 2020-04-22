import React from "react";

export const TrackingConsent = props => {

    return (
        <div className="modal-background">
            <div className="modal tracking-consent">
                <div className="modal-header">
                    <h2>Tracking and Privacy</h2>
                </div>
                <div className="modal-body">
                    <p>
                        Flash uses cookies and other storage mechanisms for some of its key
                        functionality and fraud prevention, as well as for analytics.
                    </p>

                    <p>
                        To enhance the efficiency and accuracy of this, tracking
                        identifiers may be stored on your device and used by third parties (Google and Stripe), 
                        but you have a right to decide whether this will happen. You can revoke your
                        consent at any time through the info icon in the top right corner of Flash.
                    </p>
                    <p>
                        For further details, please see <a href="https://www.google.com/policies/privacy/partners">how Google uses data</a> when you use Flash.
                    </p>
                    <p>
                        Do you agree to tracking for analytics?
                    </p>

                    <div className="controls">
                        <button className="primary" onClick={() => {
                            localStorage.setItem("TrackingConsentTimestamp", Date.now());
                            props.handleClose();
                        }}>
                            Yes
                        </button>
                        <button onClick={() => {
                            props.handleClose();
                        }}>
                            No
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};