import React from "react";
import { Transition } from "react-spring/renderprops";
import { GlobalHotKeys } from "react-hotkeys";

import * as constants from "../constants";
import { authenticatedFetch, getUserFromAuthToken } from "../util";
import { MathsFormattingHint } from "./MathsFormattingHint.jsx";
import { Flashcard } from "./flashcard/Flashcard.jsx";

export class AddFlashcardForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { front: "", back: "", isReversible: false, showMathsFormattingHint: false };
    }
    handleChange(event) {
        const key = event.target.name;
        let value;
        if (event.target.type === "checkbox") {
            value = event.target.checked;
        }
        else {
            value = event.target.value;
        }

        if (key === "front" || key === "back") {
            this.setState({ [key]: value, showMathsFormattingHint: value.match(constants.containsMathsRegex) });
        } else {
            this.setState({ [key]: value });
        }
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

        const hintInsetDirection = window.innerWidth <= 600 ? "top" : "left";

        return (
            <div className="modal-background" onClick={this.props.handleCancel}>
                <GlobalHotKeys keyMap={constants.keyMap} handlers={{
                    CLOSE_MODAL_BOX: this.props.handleCancel
                }} />
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
                            <label htmlFor="input-isReversible">Randomise flip</label>
                            <div className="flashcard-preview">
                                <h3>Preview</h3>
                                <Flashcard
                                    colour={this.props.category.colour}
                                    isReversible={this.state.isReversible}
                                    front={this.state.front}
                                    back={this.state.back}
                                    tags={[]}
                                    view="normal"
                                    disableModal={true}
                                />
                            </div>
                            <div className="usernames-visible-to">{usernamesVisibleTo} will be able to see and edit this</div>
                            <div className="controls">
                                <input type="submit" value="Add flashcard" disabled={!enableSubmit} />
                                <button type="button" onClick={this.props.handleCancel}>Cancel</button>
                            </div>
                        </form>
                    </div>
                    <Transition
                        items={this.state.showMathsFormattingHint}
                        from={{ [hintInsetDirection]: "75%", opacity: 0, transform: "scale(1.1)", boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1" }}
                        enter={{ [hintInsetDirection]: "100%", opacity: 1, transform: "scale(1)", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2" }}
                        leave={{ [hintInsetDirection]: "75%", opacity: 0, transform: "scale(1.1)", boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1" }}
                        config={{ tension: 250, friction: 26 }}
                    >
                        {isVisible => isVisible && (props => <MathsFormattingHint style={props} />)}
                    </Transition>
                </div>
            </div>
        );
    }
}
