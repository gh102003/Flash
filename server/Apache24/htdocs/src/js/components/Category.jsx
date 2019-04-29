import React from "react";

import * as util from "../util";
import { draggableTypes } from "../constants";
import { Flashcard } from "./flashcard/Flashcard.jsx";
import { Subcategory } from "./subcategory/Subcategory.jsx";
import { AddCardForm } from "./AddCardForm.jsx";
import { AddCategoryForm } from "./AddCategoryForm.jsx";
import { AddButton } from "./AddButton.jsx";
import { LoadingIndicator } from "./LoadingIndicator.jsx";
import { Breadcrumb } from "./breadcrumb/Breadcrumb.jsx";

export class Category extends React.Component {

    constructor(props) {
        super(props);
        this.state = { currentForm: null };
    }

    componentDidMount() {
        this.getFromServer(this.props.match.params.id).then(() => this.setState({ loadedData: true }));
    }

    componentDidUpdate(prevProps) {
        // Check for a change in location, indicating that the page has been navigated
        if (this.props.location !== prevProps.location) {
            this.setState({ loadedData: false });
            this.getFromServer(this.props.match.params.id).then(() => this.setState({ loadedData: true }));
        }
    }

    // Called when mounting or changing category, also when cards are changed
    // Returns a promise
    getFromServer(categoryId) {
        return new Promise((resolve) => {
            fetch(`/cgi-bin/get_category.py?id=${categoryId}`, {
                method: "GET",
                cache: "no-cache"
            }).then(response => {
                return response.json();
            }).then(response => {
                let { id, name, colour, parent_id, flashcards, subcategories } = response;
                util.shuffle(flashcards);
                this.setState({ id, name, colour, parent_id, flashcards, subcategories });
                resolve();
            });
        });
    }

    afterAddFormSubmit() {
        this.setState({ currentForm: null });
        this.getFromServer(this.props.match.params.id);
    }

    handleCardEdit(cardType, clientIndex, field, newValue) {
        this.setState(oldState => {
            let list;
            if (cardType === "subcategory") {
                list = oldState.subcategories;
            } else if (cardType === "flashcard") {
                list = oldState.flashcards;
            }
            list[clientIndex][field] = newValue;
            return oldState;
        });
    }

    handleCardSaveEdit(cardType, clientIndex, field, newValue) {
        if (cardType === "subcategory") {
            let subcategoryId = this.state.subcategories[clientIndex].id;
            let formData = new FormData();
            formData.set("categoryId", subcategoryId);
            formData.set("field", field);
            formData.set("newValue", newValue);
            fetch("/cgi-bin/edit_category.py", {
                method: "POST",
                cache: "no-cache",
                body: formData
            });
        } else if (cardType === "flashcard") {
            let flashcardId = this.state.flashcards[clientIndex].id;
            let formData = new FormData();
            formData.set("flashcardId", flashcardId);
            formData.set("field", field);
            formData.set("newValue", newValue);
            fetch("/cgi-bin/edit_flashcard.py", {
                method: "POST",
                cache: "no-cache",
                body: formData
            });
        }
    }

    handleCardMove(cardType, cardId, newCategoryId) {
        // If same category, do nothing
        if (this.props.match.params.id == newCategoryId) {
            return;
        }

        if (cardType === draggableTypes.FLASHCARD) {
            // Send move to server
            let formData = new FormData();
            formData.set("flashcardId", cardId);
            formData.set("newCategoryId", newCategoryId);
            fetch("/cgi-bin/move_flashcard.py", {
                method: "POST",
                cache: "no-cache",
                body: formData
            });

            // Remove on client
            this.setState((oldState) => ({
                flashcards: oldState.flashcards.filter((flashcard) => flashcard.id !== cardId)
            }));
        } else if (cardType === draggableTypes.SUBCATEGORY) {
            // Send move to server
            let formData = new FormData();
            formData.set("categoryId", cardId);
            formData.set("newParentId", newCategoryId);
            fetch("/cgi-bin/move_category.py", {
                method: "POST",
                cache: "no-cache",
                body: formData
            });

            // Remove on client
            this.setState((oldState) => ({
                subcategories: oldState.subcategories.filter((subcategory) => subcategory.id !== cardId)
            }));
        }
    }

    handleCardDelete(cardType, clientIndex) {
        let listName;
        // Send move to server
        if (cardType === "flashcard") {
            let formData = new FormData();
            formData.set("flashcardId", this.state.flashcards[clientIndex].id);
            fetch("/cgi-bin/delete_flashcard.py", {
                method: "POST",
                cache: "no-cache",
                body: formData
            });

            listName = "flashcards";
        } else if (cardType === "subcategory") {
            let formData = new FormData();
            formData.set("categoryId", this.state.subcategories[clientIndex].id);
            fetch("/cgi-bin/delete_category.py", {
                method: "POST",
                cache: "no-cache",
                body: formData
            });

            listName = "subcategories";
        }

        // Remove on client
        this.setState((oldState) => {
            let cardsBefore = oldState[listName].slice(0, clientIndex);
            let cardsAfter = oldState[listName].slice(clientIndex + 1);

            return {
                [listName]: [...cardsBefore, ...cardsAfter]
            };
        });
    }

    _renderFlashcards() {
        if (!this.state.flashcards) return null;

        return this.state.flashcards.map((flashcard, clientIndex) => (
            <Flashcard
                key={flashcard.id}
                id={flashcard.id}
                front={flashcard.front}
                back={flashcard.back}
                isReversible={flashcard.is_reversible}
                colour={this.state.colour}
                handleEdit={(side, newName) => this.handleCardEdit("flashcard", clientIndex, side, newName)}
                handleSaveEdit={(side, newName) => this.handleCardSaveEdit("flashcard", clientIndex, side, newName)}
                handleDelete={() => this.handleCardDelete("flashcard", clientIndex)}
            />
        ));
    }

    _renderSubcategories() {
        if (!this.state.subcategories) return null;

        return this.state.subcategories.map((subcategory, clientIndex) => (
            <Subcategory
                key={subcategory.id}
                id={subcategory.id}
                name={subcategory.name}
                colour={subcategory.colour}
                handleCardMove={(itemType, cardId, newCategoryId) => this.handleCardMove(itemType, cardId, newCategoryId)}
                handleEdit={newName => this.handleCardEdit("subcategory", clientIndex, "name", newName)}
                handleSaveEdit={newName => this.handleCardSaveEdit("subcategory", clientIndex, "name", newName)}
                handleDelete={() => this.handleCardDelete("subcategory", clientIndex)}
            />
        ));
    }

    _renderAddElement() {
        if (this.state.currentForm === "addCard") {
            return (
                <AddCardForm
                    afterSubmit={() => this.afterAddFormSubmit()}
                    handleCancel={() => this.setState({ currentForm: null })}
                    categoryId={this.props.match.params.id}>
                </AddCardForm>
            );
        } else if (this.state.currentForm === "addCategory") {
            return (
                <AddCategoryForm
                    afterSubmit={() => this.afterAddFormSubmit()}
                    handleCancel={() => this.setState({ currentForm: null })}
                    parentId={this.props.match.params.id}>
                </AddCategoryForm>
            );
        }
        return;
    }

    render() {
        return (
            <> {/* Shorthand for React.Fragment */}
                <Breadcrumb
                    categoryId={this.props.match.params.id}
                    handleCardMove={(itemType, cardId, newCategoryId) => this.handleCardMove(itemType, cardId, newCategoryId)}
                />
                <div className={"category " + (this.state.loadedData ? "category-loaded" : "category-loading")} >
                    <div className="card-display">
                        {
                            this.state.loadedData ?
                                <>
                                    {this._renderSubcategories()}
                                    {this._renderFlashcards()}
                                </>
                                : <LoadingIndicator/>
                        }
                    </div>
                    {this._renderAddElement()}
                    <AddButton handleClick={(nextForm) => this.setState({ currentForm: nextForm })} />
                </div>
            </>
        );
    }
}
