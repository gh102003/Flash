import React from "react";

import "../../../css/tracking-consent.css";

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
                        functionality, as well as for analytics and advertisements.
                    </p>

                    <p>
                        To enhance the efficiency and relevance of these advertisements, tracking
                        identifiers may be stored on your device and used by third parties (including Google), 
                        but you have a right to decide whether this will happen. You can revoke your
                        consent at any time through the icon in the top right corner.
                    </p>
                    <p>
                        Do you agree to tracking for ad personalisation?
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