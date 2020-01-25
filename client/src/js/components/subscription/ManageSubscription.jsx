import React, { useContext } from "react";
import { Redirect, useLocation, useHistory } from "react-router";

import * as util from "../../util";

import { UserContext } from "../../contexts/UserContext";

export const ManageSubscription = props => {

    const userContext = useContext(UserContext);
    const location = useLocation();
    const history = useHistory();

    if (!userContext.currentUser) {
        return <Redirect to={{ pathname: "/account", state: location.state }} />;
    }

    return (
        <div className="modal-background" onClick={props.handleClose} >
            <div className="modal manage-subscription" onClick={event => event.stopPropagation()}>
                <div className="modal-header">
                    <h2>Manage Subscription</h2>
                    <i className="material-icons button-close" onClick={props.handleClose}>close</i>
                </div>
                <div className="modal-body">
                    <p>
                        Subscribe to Flash Gold for a prodigious upgrade with even more features!
                    </p>
                    <h3>Coming soon to Flash Gold:</h3>
                    <ul>
                        <li>Match your personality with colour themes including <span style={{ backgroundColor: "#446", color: "#ddd" }}>dark mode</span></li>
                        <li>Meticulously analyse your progress with extended quiz options</li>
                        <li>Stand a level above the rest with exclusive profile pictures</li>
                        <li>Build up your resilience over time using our exclusive machine learning algorithms, powered by AI</li>
                        <li>Show off your commitment to the maintenance of Flash with free merchandise delivered straight to your front door (UK mainland only)</li>
                        <li>Get exclusive access to premium sets tailored specifically to your course</li>
                    </ul>
                    <button onClick={async () => {
                        // Request checkout session id from server
                        const response = await util.authenticatedFetch("billing/checkout", { method: "GET" });
                        if (response.status === 401) {
                            userContext.changeUser(null);
                            localStorage.removeItem("AuthToken");
                            history.push("/account", location.state );
                            return;
                        }
                        if (!response.ok) {
                            alert("Payment failed");
                        }
                        const responseJson = await response.json();

                        // eslint-disable-next-line no-undef
                        const stripe = Stripe("pk_test_bdVzKb9hL6kZLnCIcOSQvXM200pKT3Oa5j");
                        const { error } = await stripe.redirectToCheckout({ sessionId: responseJson.session.id });
                        if (error) {
                            alert("Payment failed");
                        }
                    }}>Get Gold now</button>
                </div>
            </div>
        </div>
    );
};