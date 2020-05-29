import React from "react";

import { FlashcardNormal } from "./FlashcardNormal.jsx";
import { FlashcardEdit } from "./FlashcardEdit.jsx";
import { FlashcardModal } from "./FlashcardModal.jsx";
import { UserContext } from "../../contexts/UserContext";

import * as util from "../../util.js";
import * as envConstants from "../../envConstants";

export class Flashcard extends React.Component {

    constructor(props) {
        super(props);
        if (this.props.isReversible && Math.random() > 0.5) {
            this.state = { side: "back" };
        }
        else {
            this.state = { side: "front" };
        }
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
        fetch(`${envConstants.serverOrigin}/flashcards/${this.props.id}`, {
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

        const moderatorLoggedIn = !!(this.context.currentUser) && this.context.currentUser.roles && this.context.currentUser.roles.includes("moderator");
        const editable = this.props.locked === false || moderatorLoggedIn;

        if (this.props.view === "edit") {
            return (
                <FlashcardEdit
                    text={text}
                    isReversible={this.props.isReversible}
                    styles={styles}
                    handleTextEdit={newValue => this.props.handleEdit(this.state.side, newValue)}
                    handleSaveTextEdit={() => {
                        this.props.handleSaveEdit({ propName: this.state.side, value: this.props[this.state.side] });
                        this.props.handleChangeView("normal");
                    }}
                    handleToggleReversible={() => {
                        const nextReversible = !this.props.isReversible;
                        this.props.handleEdit("isReversible", nextReversible);
                        this.props.handleSaveEdit({ propName: "isReversible", value: nextReversible });
                    }}
                    handleDelete={() => this.props.handleDelete()}
                />
            );
        }
        else if (this.props.view === "modal") {
            return (
                <>
                    <FlashcardModal
                        text={text}
                        styles={styles}
                        handleSwitch={(deltaIndex) => {
                            this.props.handleSwitch(deltaIndex);
                        }}
                        handleFlip={() => this.flip()}
                        handleExit={() => this.props.handleChangeView("normal")}
                    />
                    <FlashcardNormal
                        editable={false}
                        text={text}
                        tags={this.props.tags}
                        styles={styles}
                        disableModal={true}
                    />
                </>
            );
        }
        else {
            return (
                <div className={"flashcard-whole flashcard-whole-" + this.state.side}>
                    <FlashcardNormal
                        editable={editable}
                        id={this.props.id}

                        text={this.props.front}

                        side="front"
                        // activeSide={this.state.side}

                        tags={this.props.tags}
                        styles={styles}
                        handleFlip={() => this.flip()}
                        handleChangeView={view => this.props.handleChangeView(view)}
                        handleTagAdd={tag => {
                            this.props.handleEdit("tags", tag, "push");
                            this.props.handleSaveEdit({ propName: "tags", type: "push", value: tag.id });
                        }}
                        handleTagDelete={tag => {
                            this.props.handleEdit("tags", tag, "pull");
                            this.props.handleSaveEdit({ propName: "tags", type: "pull", value: tag.id });
                        }}
                        disableModal={this.props.disableModal}
                    />
                    <FlashcardNormal
                        editable={editable}
                        id={this.props.id}

                        text={this.props.back}

                        side="back"
                        // activeSide={this.state.side}

                        tags={this.props.tags}
                        styles={styles}
                        handleFlip={() => this.flip()}
                        handleChangeView={view => this.props.handleChangeView(view)}
                        handleTagAdd={tag => {
                            this.props.handleEdit("tags", tag, "push");
                            this.props.handleSaveEdit({ propName: "tags", type: "push", value: tag.id });
                        }}
                        handleTagDelete={tag => {
                            this.props.handleEdit("tags", tag, "pull");
                            this.props.handleSaveEdit({ propName: "tags", type: "pull", value: tag.id });
                        }}
                        disableModal={this.props.disableModal}
                    />
                </div>
            );
        }

    }
}

Flashcard.contextType = UserContext;