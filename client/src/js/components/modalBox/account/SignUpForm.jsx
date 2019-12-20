import React from "react";

import * as constants from "../../../constants";
import * as envConstants from "../../../envConstants";

export class SignUpForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            formData: {
                username: "",
                emailAddress: "",
                password: "",
                repeatPassword: "",
                privacyNoticeAccepted: false
            },
            lastSignUp: {
                success: true,
                error: ""
            }
        };
    }

    updateForm(key, value) {
        this.setState(lastState => ({
            formData: {
                ...lastState.formData,
                [key]: value
            }
        }));
    }

    /**
     * Checks the entered password is secure enough
     * @returns {{valid: boolean, message: string}}
     */
    validatePassword() {
        const password = this.state.formData.password;
        if (password.length < 8) return {
            valid: false,
            message: "Must be 8 or more characters long"
        }; // At least 8 chars long

        if (!password.match(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/)) return {
            valid: false,
            message: "Must contain a number, lowercase letter and uppercase letter"
        }; // Lowercase, uppercase and number
        return { valid: true, message: "Valid" };
    }

    /**
     * Validates the data that has been entered
     * @returns {boolean} whether the data is valid
     */
    validateFormData() {
        if (!this.state.formData.username) return false;
        if (!this.state.formData.emailAddress.match(constants.emailAddressRegex)) return false;
        if (!this.state.formData.password) return false;
        if (!this.state.formData.repeatPassword) return false;
        if (this.state.formData.password !== this.state.formData.repeatPassword) return false;
        if (!this.state.formData.privacyNoticeAccepted) return false;
        return true;
    }

    render() {
        const passwordValidation = this.validatePassword();

        return (<form
            className="login-form"
            onSubmit={event => {
                event.preventDefault();
                fetch(`${envConstants.serverOrigin}/users/signup`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    cache: "no-cache",
                    body: JSON.stringify({
                        username: this.state.formData.username,
                        emailAddress: this.state.formData.emailAddress,
                        password: this.state.formData.password
                    })
                })
                    .then(async response => {
                        let responseData;
                        switch (response.status) {
                            case 201:
                                return;
                            case 409:
                                responseData = await response.json();
                                this.setState({
                                    lastSignUp: { success: false, error: responseData.error }
                                });
                                throw new Error(responseData.error);
                            default:
                                throw new Error("User could not be created");
                        }
                    })
                    // Send to parent to log in
                    .then(() => this.props.afterSignUp(this.state.formData.emailAddress, this.state.formData.password))
                    .catch(error => {
                        // Trigger wiggle animation
                        this.setState(oldState => ({
                            lastSignUp: { ...oldState.lastSignUp, success: false }
                        }));
                        // Timeout resets animation and hides error popup, but animation finished before this in CSS
                        setTimeout(
                            () => this.setState({ lastSignUp: { success: true, error: "" } }),
                            3000
                        );
                    });
            }}>


            <label htmlFor="username">
                Username:
            </label>
            <div className="input-with-validation">
                <input
                    id="username"
                    autoComplete="username"
                    type="text"
                    value={this.state.formData.username}
                    onChange={event => this.updateForm("username", event.target.value)}
                />
                {
                    // Check last sign up for conflicting username
                    !this.state.lastSignUp.success && this.state.lastSignUp.error.split(" ")[0] === "Username" &&
                    <div className="validation-message">{this.state.lastSignUp.error}</div>
                }
            </div>


            <label htmlFor="email-address">
                Email Address:
            </label>
            <div className="input-with-validation">
                <input
                    id="email-address"
                    autoComplete="email"
                    type="text"
                    value={this.state.formData.emailAddress}
                    onChange={event => this.updateForm("emailAddress", event.target.value)}
                />
                {
                    // Check email address is valid
                    this.state.formData.emailAddress &&
                    !this.state.formData.emailAddress.match(constants.emailAddressRegex) &&
                    <div className="validation-message">Invalid email address</div>
                }
                {
                    // Check last sign up for conflicting email address
                    !(this.state.formData.emailAddress && !this.state.formData.emailAddress.match(constants.emailAddressRegex)) &&
                    !this.state.lastSignUp.success && this.state.lastSignUp.error.split(" ")[0] === "Email" &&
                    <div className="validation-message">{this.state.lastSignUp.error}</div>
                }
            </div>


            <label htmlFor="password">
                Password:
            </label>
            <div className="input-with-validation">
                <input
                    id="password"
                    autoComplete="new-password"
                    type="password"
                    value={this.state.formData.password}
                    onChange={event => this.updateForm("password", event.target.value)}
                />
                {
                    this.state.formData.password != "" && !passwordValidation.valid &&
                    <div className="validation-message">{passwordValidation.message}</div>
                }
            </div>


            <label htmlFor="repeat-password">
                Repeat Password:
            </label>
            <div className="input-with-validation">
                <input
                    id="repeat-password"
                    autoComplete="new-password"
                    type="password"
                    value={this.state.formData.repeatPassword}
                    onChange={event => this.updateForm("repeatPassword", event.target.value)}
                />
                {
                    passwordValidation.valid && this.state.formData.password !== this.state.formData.repeatPassword &&
                    <div className="validation-message">Passwords do not match</div>
                }
            </div>


            <input
                type="checkbox"
                name="accept-privacy-notice"
                id="accept-privacy-notice"
                checked={this.state.formData.privacyNoticeAccepted}
                onChange={event => this.updateForm("privacyNoticeAccepted", event.target.checked)} />
            <label className="privacy-notice" htmlFor="accept-privacy-notice">I agree for my data to be stored and processed for functional purposes</label>


            <p className="sign-up-cta">
                Already got an account? <a href="" onClick={event => {
                    event.preventDefault();
                    this.props.handleLoginCta();
                }}>Login</a> instead.
            </p>
            <input className={this.state.lastSignUp.success ? "sign-up-btn" : "sign-up-btn sign-up-btn-fail"} type="submit" value="Sign up" disabled={!this.validateFormData() || !passwordValidation.valid} />
        </form>);
    }
}