import React, { useState, useContext, useEffect } from "react";
import { Redirect, useLocation, useHistory } from "react-router";

import { CouponCodeInput } from "./CouponCodeInput.jsx";
import * as util from "../../util";
import * as envConstants from "../../envConstants";
import "../../../css/manage-subscription.scss";

import { UserContext } from "../../contexts/UserContext";
import { Link } from "react-router-dom";
import { NetworkIndicator } from "../NetworkIndicator.jsx";

export const ManageSubscription = props => {

    const userContext = useContext(UserContext);
    const location = useLocation();
    const history = useHistory();

    // Refresh user data when modal is opened
    useEffect(() => {
        userContext.refreshUser();
    }, []);

    if (!userContext.currentUser) {
        return <Redirect to={{ pathname: "/account", state: location.state }} />;
    }

    const hasFlashGold = util.hasFlashGold(userContext.currentUser);

    let currentPlanInfo;
    if (hasFlashGold) {
        try {
            const paymentMethod = userContext.currentUser.subscription.stripeSubscription.default_payment_method;
            currentPlanInfo = (
                <p className="current-plan-info">
                    You&apos;re subscribed to Flash Gold with your {paymentMethod.type} ending in {paymentMethod[paymentMethod.type].last4}.
                </p>
            );
        } catch (error) {
            console.log("no payment method attached to stripe subscription");
        }
    } else {
        currentPlanInfo = <p className="current-plan-info">You&apos;re currently not subscribed to Flash Gold.</p>;
    }

    return (
        <div className="modal-background" onClick={props.handleClose} >
            <div className="modal manage-subscription" onClick={event => event.stopPropagation()}>
                <div className="modal-header">
                    <h2>Subscription</h2>
                    <i className="material-icons button-close" onClick={props.handleClose}>close</i>
                </div>
                <div className="modal-body">
                    <p>Subscribe to Flash Gold for a prodigious upgrade with even more features!</p>
                    {/*<ul>
                        <li>Meticulously analyse your progress with extended quiz options</li>
                        <li>Build up your resilience over time using our exclusive machine learning algorithms, powered by AI</li>
                        <li>Get exclusive access to premium sets tailored specifically to your course</li>
                    </ul> */}

                    <div className="subscription-comparison">
                        <div className="subscription subscription-basic">
                            <h3>Basic</h3>
                            <ul className="subscription-feature-list">
                                <li>Create and edit flashcards</li>
                                <li>Use your private workspace to stop others changing your cards</li>
                                <li>Choose from one of the default profile pictures</li>
                                <li>Take the quiz to test your knowledge</li>
                            </ul>
                            <div className="price">Free</div>
                        </div>
                        <div className="subscription subscription-gold">
                            <h3>Flash Gold</h3>
                            <p className="terms-link">
                                <Link className="link" to={{ pathname: "/account/subscription/terms", state: location.state }}>Terms</Link>
                            </p>
                            <ul className="subscription-feature-list">
                                <li className="feature-sidelined">Everything in basic, plus...</li>
                                <li>Stand a level above the rest with exclusive profile pictures</li>
                                <li>Meticulously analyse your progress with extended quiz options and access to our machine learning algorithm (coming soon)</li>
                                <li>Match your personality with colour themes including dark mode</li>
                                <li>Show off your commitment to the maintenance of Flash with free merchandise delivered straight to your front door (UK mainland only)</li>
                            </ul>
                            <div className="price price-gold">
                                <span>£1.99</span>
                                <span>per</span>
                                <span>month</span>

                                <div className="price-details">
                                    <span>&asymp; €2.40</span>
                                    <span>&asymp; $2.70</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {currentPlanInfo}

                    {userContext.currentUser.subscription ?
                        <div className={userContext.currentUser.verifiedEmail ? "email-verification-required email-verification-complete" : "email-verification-required email-verification-incomplete"}>
                            {!userContext.currentUser.verifiedEmail &&
                                <div className="email-verification-cta">
                                    You must verify your email address in the account page to get Flash Gold.
                                </div>
                            }
                            <div className="email-verification-dependent">
                                <CouponCodeInput
                                    prevDiscount={userContext.currentUser.subscription.stripeDiscount}
                                    applyCouponCode={async nextCouponCode => {
                                        const response = await util.authenticatedFetch("billing/apply-coupon", {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json"
                                            },
                                            body: JSON.stringify({
                                                couponCode: nextCouponCode
                                            })
                                        });

                                        if (response.status === 401) {
                                            userContext.changeUser(null);
                                            localStorage.removeItem("AuthToken");
                                            history.push("/account", location.state);
                                            return;
                                        }

                                        if (response.status !== 200) {
                                            throw new Error("coupon code could not be applied");
                                        }

                                        await userContext.refreshUser();
                                    }}
                                />


                                <p>
                                    {!hasFlashGold &&
                                        <button className="get-flash-gold-cta" onClick={() => {
                                            history.push("/account/subscription/terms", { ...location.state, flow: "start_subscription" });
                                        }}>Get Flash Gold now</button>
                                    }
                                    {hasFlashGold &&
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
                                                alert("Edit failed");
                                            }

                                            const responseJson = await response.json();

                                            // eslint-disable-next-line no-undef
                                            const stripe = Stripe(envConstants.stripePublicKey);
                                            const { error } = await stripe.redirectToCheckout({ sessionId: responseJson.session.id });
                                            if (error) {
                                                alert("Edit failed");
                                            }
                                        }}>Edit payment details</button>
                                    }
                                    {hasFlashGold &&
                                        <button onClick={async () => {
                                            const response = await util.authenticatedFetch("billing/cancel-subscription", { method: "GET" });
                                            if (response.status !== 200) {
                                                alert("There was an error cancelling your subscription. Please contact us at billing@flashapp.uk.to for assistance.");
                                            } else {
                                                history.push("/account/subscription/cancelled", location.state);
                                            }
                                        }}>Cancel subscription</button>
                                    }

                                    <button onClick={() => history.push("/account/subscription/payment-history", location.state)}>Payment history</button>
                                </p>
                            </div>
                        </div>
                        : <NetworkIndicator />
                    }
                </div>
            </div>
        </div>
    );
};