import React from "react";

import { authenticatedFetch, getUserFromAuthToken } from "../util";

export class AddCardForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { front: "", back: "", isReversible: false };
    }
    handleChange(event) {
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
    handleSubmit(event) {
        authenticatedFetch("flashcards", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                flashcard: {
                    ...this.state,
                    category: this.props.category.id
                }
            })
        }).then(() => {
            this.props.afterSubmit();
        });
        event.preventDefault();
    }
    render() {
        const usernamesVisibleTo = this.props.category.user ? "Only you" : "Everyone";

        // Validation
        let enableSubmit = true;
        if (!this.state.front) enableSubmit = false;
        if (!this.state.back) enableSubmit = false;

        return (
            <div className="modal-background" onClick={this.props.handleCancel}>
                <div className="modal add add-card" onClick={event => event.stopPropagation()}>
                    <div className="modal-header">
                        <h2>Add Flashcard</h2>
                        <i className="material-icons button-close" onClick={this.props.handleCancel}>close</i>
                    </div>
                    <div className="modal-body">
                        <form className="add-card-form add-form" id="add-card-form" onSubmit={(e) => this.handleSubmit(e)} onClick={event => event.stopPropagation()}>
                            <label htmlFor="input-front">Front:</label>
                            <input autoFocus id="input-front" name="front" type="text" size="30" value={this.state.front} onChange={(e) => this.handleChange(e)} />
                            <label htmlFor="input-back">Back:</label>
                            <input id="input-back" name="back" type="text" size="30" value={this.state.back} onChange={(e) => this.handleChange(e)} />
                            <input id="input-isReversible" type="checkbox" name="isReversible" checked={this.state.isReversible} onChange={(e) => this.handleChange(e)} />
                            <label htmlFor="input-isReversible">Reversible</label>
                            <div className="usernames-visible-to">{usernamesVisibleTo} will be able to see and edit this</div>
                            <div className="controls">
                                <input type="submit" value="Add flashcard" disabled={!enableSubmit} />
                                <button type="button" onClick={this.props.handleCancel}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
