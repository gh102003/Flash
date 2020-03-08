import React, { useState, useEffect } from "react";
import { serverOrigin } from "../../../envConstants";

export const VerifyEmailAddress = ({ handleClose, emailVerificationToken }) => {

    const [verificationResult, setVerificationResult] = useState(null);

console.log(emailVerificationToken);


    useEffect(() => {
        fetch(`${serverOrigin}/users/verify-email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                emailVerificationToken
            })
        })
            .then(setVerificationResult);
    }, [emailVerificationToken]);

    return (
        <div className="modal-background" onClick={handleClose} >
            <div className="modal verify-email-address" onClick={event => event.stopPropagation()}>
                <div className="modal-header">
                    <h2>Verify Email Address</h2>
                    <i className="material-icons button-close" onClick={handleClose}>close</i>
                </div>
                <div className="modal-body">
                    {
                        verificationResult ?
                            (verificationResult.ok ?
                                <p>Email verified!</p>
                                : <p>Email could not be verified</p>
                            )
                            : <p>Your email address is being verified.</p>
                    }

                </div>
            </div>
        </div>
    );
};