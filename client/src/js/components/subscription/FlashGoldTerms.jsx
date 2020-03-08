import React, { useContext } from "react";

import { UserContext } from "../../contexts/UserContext";
import * as util from "../../util";
import "../../../css/terms.css";
import { useLocation } from "react-router";

export const FlashGoldTerms = props => {
    const userContext = useContext(UserContext);
    const location = useLocation();

    return (
        <div className="modal-background" onClick={props.handleClose} >
            <div className="modal flash-gold-terms" onClick={event => event.stopPropagation()}>
                <div className="modal-header">
                    <h2>Flash Gold Terms</h2>
                    <i className="material-icons button-close" onClick={props.handleClose}>close</i>
                </div>
                <div className="modal-body">
                    {location.state && location.state.flow === "start_subscription" &&
                        <p>
                            You must agree to the terms and conditions of Flash Gold to continue.
                        </p>
                    }
                    <div className="terms">
                        <div className="terms-header">
                            <div className="terms-title">
                                <h3>Flash Gold Terms and Conditions</h3>
                                <p>Version 1.0 (February 2020)</p>
                            </div>
                            {/* Uses CSS media print queries, TODO: move to using a separate downloadable PDF */}
                            <i className="material-icons terms-print" onClick={() => print()}>print</i>
                        </div>
                        <h4>Service</h4>
                        <p>
                            Flash Gold provides additional features to subscribers for a small monthly fee,
                            currently £1.99 per month. These features include a dark mode, additional profile
                            pictures and extended quiz options.
                        </p>
                        <p>
                            Sometimes merchandise may be offered for free or at a discounted price to
                            subscribers, depending on the length of time for which they have been subscribed
                            and their geographical location. Flash retains the right to delay or refuse such
                            products in the case of supply issues or other contingencies.
                        </p>
                        <h4>Payment</h4>
                        <p>
                            Subscribers must pay a fee of GBP1.99 every calendar month using a payment method
                            accepted by Stripe, our payment processor. This will be automatically taken on the
                            monthly anniversary of the start of the subscription unless it is cancelled a minimum
                            of 24 hours prior to payment.
                        </p>
                        <p>
                            In the event that a payment fails, for example if the card is declined, Flash will
                            reattempt the payment up to four times before cancelling the subscription. Upon each
                            failed payment attempt, the subscriber will notified by email. Similarly, if a 14
                            day period passes after a payment is due, the subscription will also be cancelled.
                            If the subscriber wishes to retain their subscription to Flash Gold, they should
                            contact billing support as described at the end of this document.
                        </p>
                        <p>
                            To maintain the high levels of security that are standard as part of Flash, card
                            and bank account details are not stored on our systems and are instead managed by Stripe.
                            Apart from basic information like the last four digits of a card number, Flash will
                            never send these details over email.
                        </p>
                        <p>
                            Vouchers may be offered to subscribers as special discounts. Only one may be applied
                            at once. Even if a voucher offers a 100% discount, subscribers are still required to 
                            enter payment details and they must cancel their subscription 24 hours before the 
                            voucher expires to avoid being charged. Flash retains the right to revoke a voucher at
                            any time by providing a 14 day notice period to any subscribers using it.
                        </p>
                        <h4>Data Protection</h4>
                        <p>
                            While subscribed to Flash Gold, the standard
                            {/* FIXME: make into an actual page */} <a className="link" href="/privacy-policy">privacy policy</a> still
                            applies. To prevent fraud and to comply with legal obligations, Stripe will control
                            and process some specific information as described in the <a className="link" href="https://stripe.com/privacy">Stripe Privacy Policy</a>.
                        </p>
                        <h4>Cancellation</h4>
                        <p>
                            When a user first starts a subscription of Flash Gold, they are entitled to a cancellation
                            and a full refund within 14 days. To obtain this refund, the subscriber should first
                            cancel their subscription and then contact support as outlined at the end of these terms.
                            No other refunds can be offered outside of this 14 day period.
                        </p>
                        <p>
                            If the subscriber wishes to cancel their subcription after this, they must do so at least 24
                            hours before their subscription renews to prevent being charged again for the next month.
                            This will immediately cause them to lose all features and benefits provided by Flash
                            Gold. They should confirm that their subscription appears as cancelled from the Flash
                            subscription page, contacting billing support if they have any issues.
                        </p>
                        <h4>Termination and Modification</h4>
                        <p>
                            In order to provide the best possible service to our subscribers, Flash may change these terms
                            as long as at least 30 days&apos; notice is given by email to all subscribers. If the subscriber
                            does not agree to the revised terms and conditions, it is their responsbility to quickly
                            cancel their subscription of Flash Gold.
                        </p>
                        <p>
                            Flash retains the right to cancel a user&apos;s subscription at any time, bearing the
                            most recent monthly payment is refunded if more than three days remain of the subscription
                            period. This may occur for a variety of reasons, such as a major technical fault or
                            misuse of Flash. In this case, the subscriber will be notified by email immediately.
                        </p>
                        <h4>Contact</h4>
                        <p>
                            For questions about these terms, Flash can be contacted by email at the following addresses:
                        </p>
                        <p>
                            Billing and subscriptions: <a className="link" href="mailto:billing@flashapp.uk.to">billing@flashapp.uk.to</a>
                        </p>
                        <p>
                            Other matters: <a className="link" href="mailto:support@flashapp.uk.to">support@flashapp.uk.to</a>
                        </p>
                    </div>

                    {location.state && location.state.flow === "start_subscription" &&
                        <button onClick={async () => {
                            // Request checkout session id from server
                            const response = await util.authenticatedFetch("billing/checkout", { method: "GET" });

                            // If the user wasn't authenticated
                            if (response.status === 401) {
                                userContext.changeUser(null);
                                localStorage.removeItem("AuthToken");
                                history.push("/account", location.state);
                                return;
                            }
                            if (!response.ok) {
                                alert("Payment failed");
                                return;
                            }

                            const responseJson = await response.json();

                            // eslint-disable-next-line no-undef
                            const stripe = Stripe("pk_test_bdVzKb9hL6kZLnCIcOSQvXM200pKT3Oa5j");
                            const { error } = await stripe.redirectToCheckout({ sessionId: responseJson.session.id });
                            if (error) {
                                alert("Payment failed");
                                return;
                            }
                        }}>I agree</button>
                    }
                </div>
            </div>
        </div>
    );
};