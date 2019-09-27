import React from "react";

import * as constants from "../../../constants";

export class SignUpForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            formData: {
                username: "",
                password: "",
                repeatPassword: "",
                privacyNoticeAccepted: false
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
                fetch(`${constants.serverOrigin}/users/signup`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    cache: "no-cache",
                    body: JSON.stringify({
                        username: this.state.formData.username,
                        password: this.state.formData.password
                    })
                })
                    .then(response => {
                        switch (response.status) {
                            case 201:
                                return;
                            case 409:
                                throw new Error("Username already exists");
                            default:
                                throw new Error("User could not be created");
                        }
                    })
                    // Send to parent to log in
                    .then(() => this.props.afterSignUp(this.state.formData.username, this.state.formData.password))
                    // Catch any sign up errors
                    .catch(error => {
                        console.log(error);
                    });
            }}>
            <label htmlFor="username">
                Username:
            </label>
            <input
                id="username"
                autoComplete="username"
                type="text"
                value={this.state.formData.username}
                onChange={event => this.updateForm("username", event.target.value)}
            />
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
                    <div className="password-validation-message">{passwordValidation.message}</div>
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
                    <div className="password-validation-message">Passwords do not match</div>
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
            <input type="submit" value="Login" disabled={!this.validateFormData() || !passwordValidation.valid} />
        </form>);
    }
}