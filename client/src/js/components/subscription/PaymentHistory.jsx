import React, { useState, useContext, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Redirect, useHistory } from "react-router-dom";
import { DateTime } from "luxon";
import { GlobalHotKeys } from "react-hotkeys";

import * as constants from "../../constants";
import * as util from "../../util";
import "../../../css/payment-history.scss";
import { NetworkIndicator } from "../NetworkIndicator.jsx";
import { UserContext } from "../../contexts/UserContext";

export const PaymentHistory = props => {
    const userContext = useContext(UserContext);

    const history = useHistory();

    const [payments, setPayments] = useState(null);
    useEffect(() => {
        util.authenticatedFetch(`billing/invoice-history`, { method: "GET" })
            .then(response => {
                if (response.status === 401) {
                    history.push("/account", location.state);
                }
                return response;
            })
            .then(response => response.json())
            .then(invoices => setPayments(invoices.invoices));
    }, []);

    if (!userContext.currentUser) {
        return <Redirect to={{ pathname: "/account", state: location.state }} />;
    }

    const invoiceStatuses = {
        paid: "Paid",
        open: "Outstanding",
        void: "Voided",
        draft: "Draft",
        uncollectible: "Uncollectible"
    };

    const renderPayments = payments => (
        payments.length > 0 ? payments.map(payment =>
            <tr className="payment" key={payment.id}>
                <td className="invoice-number">
                    {payment.hosted_invoice_url ? <a className="link" rel="noopener noreferrer" target="_blank" href={payment.hosted_invoice_url}>{payment.number}</a> : payment.number}
                </td>
                {/* Two columns for date - pick one in CSS depending on screen size */}
                <td className="date">
                    <span className="date-long">{DateTime.fromSeconds(payment.created).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)}</span>
                    <span className="date-short">{DateTime.fromSeconds(payment.created).toLocaleString(DateTime.DATETIME_SHORT)}</span>
                </td>
                <td className="amount">{(payment.amount_due / 100).toLocaleString(undefined, {
                    style: "currency",
                    currency: payment.currency
                })}</td>
                <td className={payment.status === "open" || payment.status === "draft" ? "status status-bad" : "status status"}>{invoiceStatuses[payment.status]}</td>
            </tr>
        ) : <tr><td colSpan="4" className="no-payments">No payments have been made yet</td></tr>
    );

    return (
        <div className="modal-background" onClick={props.handleClose} >
            <GlobalHotKeys keyMap={constants.keyMap} handlers={{
                CLOSE_MODAL_BOX: props.handleClose
            }} />
            <Helmet>
                <title>Payment History</title>
                <meta property="og:title" content="Payment History" />
            </Helmet>
            <div className="modal payment-history" onClick={event => event.stopPropagation()}>
                <div className="modal-header">
                    <h2>Payment History</h2>
                    <i className="material-icons button-close" onClick={props.handleClose}>close</i>
                </div>
                <div className="modal-body">
                    <p>
                        Showing the last 10 of your invoices. For more details, please contact us at <a className="link" href="mailto:billing@flash-app.co.uk">billing@flash-app.co.uk</a>.
                    </p>
                    <table className="payment-history-list">
                        <thead>
                            <tr>
                                <th className="invoice-number">Invoice No.</th>
                                <th className="date">Date</th>
                                <th className="amount">Amt</th>
                                <th className="status">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments ?

                                renderPayments(payments)

                                : <tr>
                                    <td colSpan="4">
                                        <NetworkIndicator />
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};