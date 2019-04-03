import React from "react";

import { FlashcardNormal, FlashcardNormalDragSource } from "./FlashcardNormal.jsx";
import { FlashcardEdit } from "./FlashcardEdit.jsx";
import { FlashcardModal } from "./FlashcardModal.jsx";

import * as util from "../../util.js";
import * as constants from "../../constants.js";

export class Flashcard extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.isReversible && Math.random() > 0.5) {
            this.state = { side: "back" };
        }
        else {
            this.state = { side: "front" };
        }
        this.state.view = "normal";
    }
    _flip() {
        if (this.state.side === "front") {
            this.setState({ side: "back" });
        }
        else if (this.state.side === "back") {
            this.setState({ side: "front" });
        }
    }
    render() {
        let backgroundColor = util.colourFromInteger(this.props.colour);
        let color = util.contrastingColourFromInteger(this.props.colour);
        let styles = { backgroundColor, color };
        let text = this.props[this.state.side];

        if (this.state.view === "edit") {
            return (
                <FlashcardEdit
                    text={text}
                    styles={styles}
                    handleEdit={(newValue) => this.props.handleEdit(this.state.side, newValue)}
                    saveEdit={() => {
                        this.props.handleSaveEdit(this.state.side, this.props[this.state.side]);
                        this.setState({ view: "normal" });
                    }}
                />
            );
        }
        else if (this.state.view === "modal") {
            return (
                <> {/* Shorthand for React.Fragment */}
                    <FlashcardModal
                        text={text}
                        styles={styles}
                        handleFlip={() => this._flip()}
                        handleExit={() => this.setState({ view: "normal" })}
                    />
                    <FlashcardNormal
                        text={text}
                        styles={styles}
                    />
                </>
            );
        }
        else {
            return (
                <FlashcardNormalDragSource
                    id={this.props.id}
                    text={text}
                    styles={styles}
                    handleFlip={() => this._flip()}
                    handleChangeView={(newView) => this.setState({ view: newView })}
                />
            );
        }

    }
}