import React from "react";

export class LoginForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            formData: {
                emailAddress: "",
                password: ""
            },
            lastLoginSuccess: true
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

    render() {
        let enableSubmit = true;
        if (!this.state.formData.emailAddress) enableSubmit = false;
        if (!this.state.formData.password) enableSubmit = false;

        return (
            <form
                className="login-form"
                onSubmit={event => {
                    event.preventDefault();
                    const successful = this.props.handleSubmit(this.state.formData.emailAddress, this.state.formData.password);
                    successful.catch(() => {
                        // Trigger wiggle animation
                        this.setState({ lastLoginSuccess: false });
                        setTimeout(
                            () => this.setState({ lastLoginSuccess: true }),
                            750
                        );
                    });

                }}>
                <label htmlFor="email-address">
                    Email Address:
                </label>
                <input
                    id="email-address"
                    autoComplete="email"
                    type="text"
                    value={this.state.formData.emailAddress}
                    onChange={event => this.updateForm("emailAddress", event.target.value)}
                />
                <label htmlFor="password">
                    Password:
                </label>
                <input
                    id="password"
                    autoComplete="password"
                    type="password"
                    value={this.state.formData.password}
                    onChange={event => this.updateForm("password", event.target.value)}
                />
                <p className="privacy-notice">Data will be stored on your device to keep you logged in.</p>
                <p className="sign-up-cta">
                    No account? <a href="" className="link" onClick={event => {
                        event.preventDefault();
                        this.props.handleSignUpCta();
                    }}>Sign up</a> to get started.
                </p>
                <input className={this.state.lastLoginSuccess ? "login-btn" : "login-btn login-btn-fail"} type="submit" value="Login" disabled={!enableSubmit} />
            </form>
        );
    }
}