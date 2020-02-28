import React, { useState, useEffect } from "react";
import { DateTime } from "luxon";

import { NetworkIndicator } from "../NetworkIndicator.jsx";
import "../../../css/coupon.css";

export const CouponCodeInput = ({ prevDiscount, applyCouponCode }) => {
    // Input is controlled here; data is passed up to ManageSubscription when buttons are clicked
    const [couponCode, setCouponCode] = useState("");
    const [inputVisible, setInputVisibility] = useState(false);
    const [couponApplicationState, setCouponApplicationState] = useState("normal"); // "normal" = normal; "fail" = shake animation; "loading" = contacting server

    // When prevDiscount updates, hide the input box in case the coupon is deleted
    useEffect(() => { setInputVisibility(false); setCouponCode(""); }, [prevDiscount]);

    if (prevDiscount) {
        return (
            <div className="coupon-code-input">
                <h3>Current Voucher</h3>
                {couponApplicationState === "loading" && <NetworkIndicator />}
                <div className="coupon">
                    <h4 className="coupon-name">{prevDiscount.coupon.name}</h4>
                    <p className="coupon-code">{prevDiscount.coupon.id}</p>
                    <p>
                        <span className="coupon-discount">{prevDiscount.coupon.percent_off}% off </span>
                        <span className="coupon-duration">
                            {prevDiscount.coupon.duration === "repeating" ?
                                "for " + prevDiscount.coupon.duration_in_months + " months" :
                                prevDiscount.coupon.duration // Either 'once' or 'forever'
                            }
                        </span>
                    </p>
                    <p className="coupon-redeemed">Redeemed {DateTime.fromSeconds(prevDiscount.start).toRelative()}</p>
                    <p className="coupon-expires">{
                        prevDiscount.end ?
                            "Expires " + DateTime.fromSeconds(prevDiscount.end).toRelative()
                            : "Never expires"
                    }</p>
                    <p className="coupon-remove">
                        <a href="" className="link" onClick={async event => {
                            event.preventDefault();
                            setCouponApplicationState("loading");
                            await applyCouponCode(null);
                            setCouponApplicationState("normal");
                        }}>
                            Remove
                        </a>
                    </p>
                </div>
            </div>
        );
    }

    const applyButtonClicked = async () => {
        setCouponApplicationState("loading");
        try {
            await applyCouponCode(couponCode);
            setCouponApplicationState("normal");
        } catch (error) {
            console.error("invalid coupon");
            // Shake button
            setCouponApplicationState("fail");
            setTimeout(() => setCouponApplicationState("normal"), 750);
        }
    };

    return (
        <div className="coupon-code-input">
            {inputVisible ?
                <>
                    <input
                        value={couponCode}
                        type="text"
                        disabled={couponApplicationState === "loading"}
                        onChange={event => setCouponCode(event.target.value.trim())}
                        autoFocus={true}
                        onKeyDown={event => {
                            if (event.keyCode === 13) { // Enter
                                applyButtonClicked();
                            }
                        }}
                        placeholder="Enter your voucher code"
                    />
                    <button
                        disabled={couponCode === "" || couponApplicationState === "loading"}
                        className={"primary coupon-code-apply coupon-code-apply-" + couponApplicationState}
                        onClick={applyButtonClicked}>
                        {couponApplicationState === "loading" ? <NetworkIndicator /> : "Apply"}
                    </button>
                    <button disabled={couponApplicationState === "loading"} onClick={() => setInputVisibility(false)}>Cancel</button>
                </>
                :
                <a href="" className="link show-coupon-input" onClick={event => {
                    setInputVisibility(true);
                    event.preventDefault();
                }}>
                    Got a voucher code?
                </a>
            }
        </div>
    );
};