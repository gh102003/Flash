import React from "react";
import { Helmet } from "react-helmet";

import * as util from "../util";
import { draggableTypes } from "../constants";
import { Flashcard } from "./flashcard/Flashcard.jsx";
import { Subcategory } from "./subcategory/Subcategory.jsx";
import { AddCardForm } from "./AddCardForm.jsx";
import { AddCategoryForm } from "./AddCategoryForm.jsx";
import { AddButton } from "./AddButton.jsx";
import { NetworkIndicator } from "./NetworkIndicator.jsx";
import { Breadcrumb } from "./breadcrumb/Breadcrumb.jsx";

export class Category extends React.Component {

    constructor(props) {
        super(props);
        this.state = { currentForm: null };
    }

    componentDidMount() {
        this.getFromServer(this.props.match.params.id)
            .then(response => {
                let { id, name, colour, parent, flashcards, children: subcategories, user, locked } = response.category;
                util.shuffle(flashcards);

                this.setState({ loadedData: true, category: { id, name, colour, parent, flashcards, subcategories, user, locked } });
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
                        let { id, name, colour, parent, flashcards, children: subcategories, user, locked } = response.category;
                        util.shuffle(flashcards);
                        this.setState({ loadedData: true, category: { id, name, colour, parent, flashcards, subcategories, user, locked } });
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
     * Called when mounting or changing category and when cards are changed.
     * If the action is not authorised, props.handleInvalidAuthToken is called
     * 
     * @returns a promise
     */
    async getFromServer(categoryId) {
        const response = await util.authenticatedFetch(`categories/${categoryId}`, {
            method: "GET"
        });
        const responseData = await response.json();

        if (response.status === 401) {
            // Delete auth token and log out if it is invalid
            const invalidToken = responseData.message != null && responseData.message.includes("token");
            this.props.handleInvalidAuthToken(invalidToken);
            console.error("Auth failed. This could be due to token expiration or to lack of permissions.");
        } else {
            return responseData;
        }
    }

    afterAddFormSubmit() {
        this.setState({ currentForm: null });
        this.getFromServer(this.props.match.params.id)
            .then(response => {
                let { id, name, colour, parent, flashcards, children: subcategories, locked } = response.category;
                util.shuffle(flashcards);
                this.setState({ category: { id, name, colour, parent, flashcards, subcategories, locked } });
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
        util.authenticatedFetch(`${listNameServer}/${cardId}`, {
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
            util.authenticatedFetch(`flashcards/${cardId}`, {
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
            util.authenticatedFetch(`categories/${cardId}`, {
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
            util.authenticatedFetch(`flashcards/${flashcardId}`, {
                method: "DELETE",
            });

            listName = "flashcards";
        } else if (cardType === "subcategory") {
            const categoryId = this.state.category.subcategories[clientIndex].id;
            util.authenticatedFetch(`categories/${categoryId}`, {
                method: "DELETE",
            });

            listName = "subcategories";
        }

        // Remove on client
        this.setState(oldState => {
            const cardsBefore = oldState.category[listName].slice(0, clientIndex);
            const cardsAfter = oldState.category[listName].slice(clientIndex + 1);

            return {
                category: {
                    ...oldState.category,
                    [listName]: [...cardsBefore, ...cardsAfter]
                }
            };
        });
    }

    renderFlashcards() {
        if (!this.state.category.flashcards) return null;

        return this.state.category.flashcards.map((flashcard, clientIndex) => (
            <Flashcard
                // Next and prev for modal
                view={flashcard.view}
                handleChangeView={newView => this.handleCardEdit("flashcard", clientIndex, "view", newView)}
                handleSwitch={deltaIndex => {
                    let indexToUpdate = clientIndex + deltaIndex;

                    // Loop around
                    if (indexToUpdate < 0) {
                        indexToUpdate = this.state.category.flashcards.length - 1;
                    }
                    if (indexToUpdate >= this.state.category.flashcards.length) {
                        indexToUpdate = 0;
                    }

                    this.handleCardEdit("flashcard", clientIndex, "view", "normal");
                    this.handleCardEdit("flashcard", indexToUpdate, "view", "modal");
                }}

                key={flashcard.id}
                id={flashcard.id}
                front={flashcard.front}
                back={flashcard.back}
                isReversible={flashcard.isReversible}
                tags={flashcard.tags}
                locked={!!this.state.category} // Either true or false
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
                locked={subcategory.locked}
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
                    // Fallback if not loaded yet
                    category={this.state.category || { id: this.state.category }}>
                </AddCardForm>
            );
        } else if (this.state.currentForm === "addCategory") {
            return (
                <AddCategoryForm
                    afterSubmit={() => this.afterAddFormSubmit()}
                    handleCancel={() => this.setState({ currentForm: null })}
                    parent={this.state.category || { id: this.state.category }}>
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
                    <>
                        <Helmet>
                            <title>{this.state.category.name} | Flash</title>
                            <meta property="og:title" content={this.state.category.name} />
                        </Helmet>
                        <Breadcrumb
                            currentCategory={this.state.category}
                            handleCardMove={(itemType, cardId, newCategoryId) => this.handleCardMove(itemType, cardId, newCategoryId)}
                            handleNavigate={(url, categoryData) => this.navigate(url, categoryData)}
                        />
                    </>
                }
                <div className={"category " + (this.state.loadedData ? "category-loaded" : "category-loading")} >
                    <div className="card-display">
                        {
                            this.state.loadedData ?
                                <>
                                    {this.renderSubcategories()}
                                    {this.renderFlashcards()}
                                </>
                                : <NetworkIndicator />
                        }
                    </div>
                    {this.renderAddElement()}
                    <AddButton handleClick={nextForm => this.setState({ currentForm: nextForm })} />
                </div>
            </>
        );
    }
}