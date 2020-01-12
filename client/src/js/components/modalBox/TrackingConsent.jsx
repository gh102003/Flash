import React from "react";

import "../../../css/tracking-consent.css";

export const TrackingConsent = props => {

    return (
        <div className="modal-background">
            <div className="modal tracking-consent">
                <div className="modal-header">
                    <h2>Tracking</h2>
                </div>
                <div className="modal-body">
                    <p>
                        Flash uses cookies and other storage mechanisms for some of its key
                        functionality, as well as for advertisements.
                    </p>

                    <p>
                        To enhance the efficiency of these advertisements, tracking data may
                        be stored on your computer, but you have a right to decide whether
                        this will happen. Do you agree to allow tracking?
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