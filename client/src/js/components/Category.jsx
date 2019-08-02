import React from "react";

import { Redirect, withRouter } from "react-router-dom";

import * as util from "../util";
import * as constants from "../constants";
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
        this.getFromServer(this.props.match.params.id)
            .then(response => {
                let { id, name, colour, parent, flashcards, children: subcategories } = response.category;
                util.shuffle(flashcards);

                this.setState({ loadedData: true, category: { id, name, colour, parent, flashcards, subcategories } });
            });
    }

    componentDidUpdate(prevProps) {
        const loadedNextCategory = this.state.category && this.props.location.pathname === "/category/" + this.state.category.id;

        // Check for a change in location, indicating that the page has been navigated
        if (this.props.location !== prevProps.location) {
            if (loadedNextCategory) {

                this.getFromServer(this.props.match.params.id)
                    .then(response => {
                        let { parent, children, flashcards } = response.category;
                        this.setState(oldState => {

                            let missingChildren = children.filter(newChild => {
                                let found = false;
                                oldState.category.subcategories.forEach(subcategory => {
                                    if (subcategory.id === newChild.id) found = true;
                                });
                                return !found;
                            });

                            let missingFlashcards = flashcards.filter(newFlashcard => {
                                let found = false;
                                oldState.category.flashcards.forEach(flashcard => {
                                    if (flashcard.id === newFlashcard.id) found = true;
                                });
                                return !found;
                            });

                            return {
                                category: {
                                    parent,
                                    ...oldState.category,
                                    flashcards: [
                                        ...oldState.category.flashcards,
                                        ...missingFlashcards
                                    ],
                                    subcategories: [
                                        ...oldState.category.subcategories,
                                        ...missingChildren
                                    ],
                                }
                            };
                        });
                    });

            } else {

                this.setState({ loadedData: false }); // Only show loading animation if whole category must be loaded

                this.getFromServer(this.props.match.params.id)
                    .then(response => {
                        let { id, name, colour, parent, flashcards, children: subcategories } = response.category;
                        util.shuffle(flashcards);
                        this.setState({ loadedData: true, category: { id, name, colour, parent, flashcards, subcategories } });
                    });
            }
        }
    }

    /** Used to navigate imperatively to another category
     * @param categoryData (optional) data for the category to be navigated to
     */
    navigate(url, categoryData) {
        if (categoryData) {
            let { id, name, colour, parent, flashcards, children: subcategories } = categoryData;
            util.shuffle(flashcards);
            this.setState({ category: { id, name, colour, parent, flashcards, subcategories } });
        }
        this.props.history.push(url);
    }

    /**
     * Called when mounting or changing category and when cards are changed
     * 
     * @returns a promise
     */
    getFromServer(categoryId) {
        return new Promise((resolve) => {
            fetch(`${constants.serverOrigin}/categories/${categoryId}`, {
                method: "GET"
            }).then(response => {
                resolve(response.json());
            });
        });
    }

    afterAddFormSubmit() {
        this.setState({ currentForm: null });
        this.getFromServer(this.props.match.params.id)
            .then(response => {
                let { id, name, colour, parent, flashcards, children: subcategories } = response.category;
                util.shuffle(flashcards);
                this.setState({ category: { id, name, colour, parent, flashcards, subcategories } });
            });
    }

    handleCardEdit(cardType, clientIndex, key, value, operationType = null) {
        this.setState(oldState => {
            let list;
            if (cardType === "subcategory") {
                list = oldState.category.subcategories;
            } else if (cardType === "flashcard") {
                list = oldState.category.flashcards;
            }

            if (key === "tags" && operationType !== null) {
                switch (operationType) {
                    case "push":
                        list[clientIndex][key].push(value);
                        break;
                    case "pull":
                        list[clientIndex][key] = list[clientIndex][key].filter(x => x.id !== value.id);
                        break;
                }
            } else {
                list[clientIndex][key] = value;
            }
            return oldState;
        });
    }

    handleCardSaveEdit(cardType, clientIndex, editData) {
        let listNameServer, listNameClient;
        if (cardType === "subcategory") {
            listNameServer = "categories";
            listNameClient = "subcategories";
        } else if (cardType === "flashcard") {
            listNameServer = "flashcards";
            listNameClient = "flashcards";
        }

        let cardId = this.state.category[listNameClient][clientIndex].id;
        fetch(`${constants.serverOrigin}/${listNameServer}/${cardId}`, {
            method: "PATCH",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify([
                editData
            ])
        });
    }

    handleCardMove(cardType, cardId, newCategoryId) {
        // If same category, do nothing
        if (this.props.match.params.id == newCategoryId) {
            return;
        }

        if (cardType === draggableTypes.FLASHCARD) {
            // Send move to server
            fetch(`${constants.serverOrigin}/flashcards/${cardId}`, {
                method: "PATCH",
                cache: "no-cache",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify([
                    { propName: "category", value: newCategoryId }
                ])
            });

            // Remove on client
            this.setState(oldState => ({
                category: {
                    ...oldState.category,
                    flashcards: oldState.category.flashcards.filter(flashcard => flashcard.id !== cardId)
                }
            }));
        } else if (cardType === draggableTypes.SUBCATEGORY) {
            // Send move to server
            fetch(`${constants.serverOrigin}/categories/${cardId}`, {
                method: "PATCH",
                cache: "no-cache",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify([
                    { propName: "parent", value: newCategoryId }
                ])
            });

            // Remove on client
            this.setState(oldState => ({
                category: {
                    ...oldState.category,
                    subcategories: oldState.category.subcategories.filter(subcategory => subcategory.id !== cardId)
                }
            }));
        }
    }

    handleCardDelete(cardType, clientIndex) {
        let listName;
        // Send move to server
        if (cardType === "flashcard") {
            const flashcardId = this.state.category.flashcards[clientIndex].id;
            fetch(`${constants.serverOrigin}/flashcards/${flashcardId}`, {
                method: "DELETE",
            });

            listName = "flashcards";
        } else if (cardType === "subcategory") {
            const categoryId = this.state.category.subcategories[clientIndex].id;
            fetch(`${constants.serverOrigin}/categories/${categoryId}`, {
                method: "DELETE",
            });

            listName = "subcategories";
        }

        // Remove on client
        this.setState((oldState) => {
            let cardsBefore = oldState.category[listName].slice(0, clientIndex);
            let cardsAfter = oldState.category[listName].slice(clientIndex + 1);

            return {
                categories: {
                    [listName]: [...cardsBefore, ...cardsAfter]
                }
            };
        });
    }

    renderFlashcards() {
        if (!this.state.category.flashcards) return null;

        return this.state.category.flashcards.map((flashcard, clientIndex) => (
            <Flashcard
                key={flashcard.id}
                id={flashcard.id}
                front={flashcard.front}
                back={flashcard.back}
                isReversible={flashcard.is_reversible}
                tags={flashcard.tags}
                colour={this.state.category.colour}
                handleEdit={(key, newValue, operationType = null) => this.handleCardEdit("flashcard", clientIndex, key, newValue, operationType)}
                handleSaveEdit={editData => this.handleCardSaveEdit("flashcard", clientIndex, editData)}
                handleDelete={() => this.handleCardDelete("flashcard", clientIndex)}
            />
        ));
    }

    renderSubcategories() {
        if (!this.state.category.subcategories) return null;

        return this.state.category.subcategories.map((subcategory, clientIndex) => (
            <Subcategory
                key={subcategory.id}
                id={subcategory.id}
                name={subcategory.name}
                colour={subcategory.colour}
                handleCardMove={(itemType, cardId, newCategoryId) => this.handleCardMove(itemType, cardId, newCategoryId)}
                handleEdit={(key, newValue, operationType = null) => this.handleCardEdit("subcategory", clientIndex, key, newValue, operationType)}
                handleSaveEdit={editData => this.handleCardSaveEdit("subcategory", clientIndex, editData)}
                handleDelete={() => this.handleCardDelete("subcategory", clientIndex)}
                handleNavigate={url => this.navigate(url)}
            />
        ));
    }

    renderAddElement() {
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
            <>
                {
                    this.state.category &&
                    <Breadcrumb
                        currentCategory={this.state.category}
                        handleCardMove={(itemType, cardId, newCategoryId) => this.handleCardMove(itemType, cardId, newCategoryId)}
                        handleNavigate={(url, categoryData) => this.navigate(url, categoryData)}
                    />
                }
                <div className={"category " + (this.state.loadedData ? "category-loaded" : "category-loading")} >
                    <div className="card-display">
                        {
                            this.state.loadedData ?
                                <>
                                    {this.renderSubcategories()}
                                    {this.renderFlashcards()}
                                </>
                                : <LoadingIndicator />
                        }
                    </div>
                    {this.renderAddElement()}
                    <AddButton handleClick={(nextForm) => this.setState({ currentForm: nextForm })} />
                </div>
            </>
        );
    }
}