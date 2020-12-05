import React from "react";

import { Link } from "react-router-dom";

import * as constants from "../constants";
import "../../css/terms.scss";
import "../../css/privacy.scss";

export const Privacy = () => (
    <div className="privacy">
        <h2>Privacy</h2>
        <p>
            Here at Flash, we take your privacy extremely seriously. That&apos;s why
            we&apos;re transparent about what we do with your data and who has access to
            it.
        </p>

        <div className="terms">
            <div className="terms-header">
                <div className="terms-title">
                    <h3>Flash Privacy Policy</h3>
                    <p>Version 2.2 (6th December 2020)</p>
                </div>
                <i className="material-icons terms-print" onClick={() => print()}>print</i>
            </div>

            <h4>Data Collected and Controlled by Flash</h4>
            <p>
                Flash App Limited (&quot;Flash&quot;) collects and stores information about your device to enable it to function correctly,
                prevent spam and monitor its performance, which is within our legitimate interests. We
                store this information indefinitely because it cannot be used to identify you. This
                includes your IP address, the pages you visit and your interactions with Flash. We do
                not transfer this information to anyone outside of Flash.
            </p>
            <p>
                When you create a Flash account, you must agree for your data to be &quot;stored and
                processed for functional purposes&quot;. Here, we collect your email address and display
                name, which are stored in our database to allow you to log in. This is part of a contract
                between you and Flash that you initiate when you create your account. We may also use your
                email address to contact you about important changes to your account or to Flash and this
                is part of our legal obligation to keep you informed about our processing of your data.
                We will store this information indefinitely unless you request that you account be deleted.
                We may transfer this information to our database service provider (MongoDB Limited) for its
                storage and organisation. If and when you begin the process of subscribing to Flash Gold,
                we will send your email address to our payment service provider (Stripe Payments Europe, Ltd.) to manage
                your details as a customer. These service providers may transfer your data outside of the UK or
                European Economic Area, but will use standard contractual clauses to ensure its protection.
                By subscribing to Flash Gold, you are also bound by
                    the <Link to="/account/subscription/terms" className="link">Flash Gold Terms and Conditions</Link>.
            </p>
            <p>
                If you use Flash Prioritise, we will store information about how you rate each topic. This
                is part of a contract between you and Flash where we store your ratings. Flash may also
                process this information as part of anonymised statistical analysis, which is part of our
                legitimate interest to understand the educational performance of students. Our findings may
                be published, although no users will be indentifiable.
            </p>
            <p>
                If you send an email to Flash, your information will be processed by our email service providers
                (Google and ImprovMX). This is part of an implicit contract you enter when you send the email.
                In some cases, Flash also has a legal obligation to be contactable. Any information transmitted by
                email will be deleted once your enquiry is resolved.
            </p>
            <h4>Data Controlled Jointly with Third Parties</h4>
            <p>
                To allow Flash&apos;s Snapchat sharing functionality to work correctly, Snapchat may process
                some of your data as described in
                    their <a className="link" href="https://www.snap.com/en-US/terms">Terms of Service</a>.
            </p>
            <p>
                Finally, if you agree to tracking for analytical and advertising purposes when you first
                open Flash, Google will collect some data from you and your device. Please
                    see <a href="https://policies.google.com/technologies/partner-sites" className="link">how Google uses data</a> for
                    more information about this. You can review or revoke this consent at any time by pressing
                    the <i className="material-icons">info</i> button in the top-right corner and pressing
                    &quot;Review or revoke tracking consent for analytics&quot;. If you do not consent to this
                    tracking, Flash will instruct Google only to collect anonymised data from you, and you will
                    not be personally identifiable from this information.
            </p>

            <h4>Your Rights</h4>
            <p>
                You have a right to access any of the personal data that we store as well as the right to
                make sure it is correct and the right to have it deleted. Please contact us with the email
                address at the bottom of this document to express these rights.
            </p>
            <p>
                If you are not happy with our processing of your personal data, you can contact a supervisory authority such as
                    the <a href="https://ico.org.uk" className="link" target="_blank" rel="noreferrer noopener">Information Commissioner&apos;s Office</a>.
            </p>

            <h4>Contact</h4>
            <p>
                For questions about these terms, Flash can be contacted by email at <a className="link" href={constants.dataProtectionEmail}>data-protection@flash-app.co.uk</a>.
                    Flash App Limited is a private limited company registered in England and Wales with company number 12974271.
            </p>
        </div>
        {/* </div> */}
    </div>
);