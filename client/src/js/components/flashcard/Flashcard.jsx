import React from "react";

import { FlashcardNormal } from "./FlashcardNormal.jsx";
import { FlashcardEdit } from "./FlashcardEdit.jsx";
import { FlashcardModal } from "./FlashcardModal.jsx";

import * as util from "../../util.js";
import * as constants from "../../constants";

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

    flip() {
        if (this.state.side === "front") {
            this.setState({ side: "back" });
        }
        else if (this.state.side === "back") {
            this.setState({ side: "front" });
        }
    }

    handleTagAdd(tagId) {
        fetch(`${constants.serverOrigin}/flashcards/${this.props.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify([
                { propName: "tags", type: "push", value: tagId }
            ])
        });
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
                    handleEdit={newValue => this.props.handleEdit(this.state.side, newValue)}
                    handleSaveEdit={() => {
                        this.props.handleSaveEdit({ propName: this.state.side, value: this.props[this.state.side] });
                        this.setState({ view: "normal" });
                    }}
                    handleDelete={() => this.props.handleDelete()}
                />
            );
        }
        else if (this.state.view === "modal") {
            return (
                <>
                    <FlashcardModal
                        text={text}
                        styles={styles}
                        handleFlip={() => this.flip()}
                        handleExit={() => this.setState({ view: "normal" })}
                    />
                    <FlashcardNormal
                        editable={false}
                        text={text}
                        tags={this.props.tags}
                        styles={styles}
                    />
                </>
            );
        }
        else {
            return (
                <FlashcardNormal
                    editable={true}
                    id={this.props.id}
                    text={text}
                    tags={this.props.tags}
                    styles={styles}
                    handleFlip={() => this.flip()}
                    handleChangeView={view => this.setState({ view })}
                    handleTagAdd={tag => {
                        this.props.handleEdit("tags", tag, "push");
                        this.props.handleSaveEdit({ propName: "tags", type: "push", value: tag.id });
                    }}
                    handleTagDelete={tag => {
                        this.props.handleEdit("tags", tag, "pull");
                        this.props.handleSaveEdit({ propName: "tags", type: "pull", value: tag.id });
                    }}
                />
            );
        }

    }
}