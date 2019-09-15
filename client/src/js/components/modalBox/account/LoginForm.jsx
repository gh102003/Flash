import React from "react";

export class LoginForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            formData: {
                username: "",
                password: ""
            },
            lastLoginSuccess: true
        };

        this.submitButtonRef = React.createRef();
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
        if (!this.state.formData.username) enableSubmit = false;
        if (!this.state.formData.password) enableSubmit = false;

        return (
            <form
                className="login-form"
                onSubmit={event => {
                    event.preventDefault();
                    const successful = this.props.handleSubmit(this.state.formData.username, this.state.formData.password);
                    successful.catch(() => {
                        // Trigger wiggle animation
                        this.setState({ lastLoginSuccess: false });
                        setTimeout(
                            () => this.setState({ lastLoginSuccess: true }),
                            750
                        );
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
                <input
                    id="password"
                    autoComplete="password"
                    type="password"
                    value={this.state.formData.password}
                    onChange={event => this.updateForm("password", event.target.value)}
                />
                <p className="sign-up-cta">
                    No account? <a href="" onClick={event => {
                        event.preventDefault();
                        this.props.handleSignUpCta();
                    }}>Sign up</a> to get started.
                </p>
                <input className={this.state.lastLoginSuccess ? "login-btn" : "login-btn login-btn-fail"} ref={this.submitButtonRef} type="submit" value="Login" disabled={!enableSubmit} />
            </form>
        );
    }
}