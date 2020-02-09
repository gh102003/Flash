import React from "react";
import { version, dataProtectionEmail, sourceCodeLink } from "../../constants";

export function InfoBox(props) {

    const trackingConsent = localStorage.getItem("TrackingConsentTimestamp");

    return (
        <div className="modal-background" onClick={props.handleClose}>
            <div className="modal info-box" onClick={(event) => event.stopPropagation()}>
                <div className="modal-header">
                    <h2>Flash {version}{version.split(".")[0] < 1 && "-alpha"}</h2>
                    by George Howarth
                    <i className="material-icons button-close" onClick={props.handleClose}>close</i>
                </div>
                <div className="modal-body">
                    <p>Create, manage and practise with your own flashcards!</p>
                    <h3>Tips</h3>
                    <ul>
                        <li>Click the pen icon to edit a card or category</li>
                        <li>Drag a flashcard or category to move it somewhere else</li>
                        <li>The breadcrumbs can also be clicked or dropped into, but they can&apos;t be dragged</li>
                        <li>Click the graph icon on a category to take a quiz</li>
                        <li>Create your own account to make private flashcards</li>
                        <li>When you&apos;re logged in, use the breadcrumbs to switch between personal and public workspaces</li>
                        <li>Lock a category to stop other users editing or deleting it (apart from moderators)</li>
                    </ul>
                    <p className="external-link">
                        <i className="material-icons">open_in_new</i>
                        <a className="link" href={sourceCodeLink}>
                            View source
                        </a> on GitHub
                    </p>
                    <p className="external-link">
                        <i className="material-icons">email</i>
                        Send a&nbsp;
                        <a className="link" href={dataProtectionEmail}>
                            data protection
                        </a> email
                    </p>
                    <p className="external-link">
                        {trackingConsent === null ? "Tracking consent has not been provided for ad personalisation." :
                            <a className="link" href="" onClick={() => {
                                localStorage.removeItem("TrackingConsentTimestamp");
                            }}>Revoke tracking consent for ad personalisation</a>
                        }
                    </p>
                </div>
            </div>
        </div>
    );
}