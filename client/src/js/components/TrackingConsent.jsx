import React from "react";
import { Link } from "react-router-dom";

export const TrackingConsent = props => {

    return (
        <div className="modal-background modal-prompt-background">
            <div className="modal tracking-consent" role="dialog" aria-labelledby="tracking-consent-modal-title">
                <div className="modal-header">
                    <h2 id="tracking-consent-modal-title">Tracking and Privacy</h2>
                </div>
                <div className="modal-body">
                    <p>
                        Flash uses cookies and other storage mechanisms for some of its key
                        functionality and fraud prevention, as well as for analytics. We also
                        store some other information about you, as detailed in
                        our <Link className="link" to="/privacy">Privacy Policy</Link>.
                    </p>

                    <p>
                        To enhance the efficiency and accuracy of Flash, tracking
                        identifiers may be stored on your device and used by third parties (Google and Stripe),
                        but you have a right to decide whether this will happen. You can revoke your
                        consent at any time through the info icon in the top right corner of Flash.
                    </p>
                    <p>
                        For further details, please see <a className="link" href="https://www.google.com/policies/privacy/partners">how Google uses data</a> when you use Flash.
                    </p>
                    <p>
                        Do you agree to tracking for analytics?
                    </p>

                    <div className="controls">
                        <button onClick={() => {
                            localStorage.setItem("TrackingConsentTimestamp", Date.now());
                            props.handleClose(true);
                        }}>
                            Yes
                        </button>
                        <button onClick={() => {
                            props.handleClose(false);
                        }}>
                            No
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};