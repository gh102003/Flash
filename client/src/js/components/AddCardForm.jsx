import React from "react";

import * as constants from "../constants";

export class AddCardForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { front: "", back: "", isReversible: false };
    }
    _handleChange(event) {
        let key = event.target.name;
        let value;
        if (event.target.type === "checkbox") {
            value = event.target.checked;
        }
        else {
            value = event.target.value;
        }
        this.setState({ [key]: value });
    }
    _handleSubmit(event) {
        fetch(`${constants.serverOrigin}/flashcards/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                flashcard: {
                    ...this.state,
                    category: this.props.categoryId
                }
            })
        }).then(() => {
            this.props.afterSubmit();
        });
        event.preventDefault();
    }
    render() {
        return (
            <div className="modal-background" onClick={this.props.handleCancel}>
                <form className="add-card-form add-form" id="add-card-form" onSubmit={(e) => this._handleSubmit(e)} onClick={event => event.stopPropagation()}>
                    <label>
                        Front:
                        <input autoFocus name="front" type="text" value={this.state.front} onChange={(e) => this._handleChange(e)} />
                    </label>
                    <label>
                        Back:
                        <input name="back" type="text" value={this.state.back} onChange={(e) => this._handleChange(e)} />
                    </label>
                    <label>
                        <input type="checkbox" name="isReversible" checked={this.state.isReversible} onChange={(e) => this._handleChange(e)} />
                        Reversible
                    </label>
                    <div>
                        <input type="submit" value="Add flashcard" />
                        <button onClick={this.props.handleCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        );
    }
}
