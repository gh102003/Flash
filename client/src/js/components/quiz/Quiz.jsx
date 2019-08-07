import React from "react";

import { LoadingIndicator } from "../LoadingIndicator.jsx";
import { QuizMaster } from "./QuizMaster.jsx";

import * as constants from "../../constants";
import "../../../css/quiz.css";

export class Quiz extends React.Component {

    constructor(props) {
        super(props);
        this.state = { category: null, isRecursive: false, isLoaded: false };
    }

    componentDidMount() {
        this.loadFlashcards(this.props.match.params.categoryId);
    }

    componentDidUpdate(prevProps, prevState) {
        let updatedLocation = prevProps.match.params.categoryId !== this.props.match.params.categoryId;
        let updatedSettings = prevState.isRecursive !== this.state.isRecursive;

        if (updatedLocation || updatedSettings) {
            this.loadFlashcards(this.props.match.params.categoryId);
        }
    }

    render() {

        return (
            <div className="quiz">
                <div className="quiz-setup">
                    <h2 className="quiz-title">Quiz: {this.state.category == null ? "" : this.state.category.name}</h2>
                    <div className="setting">
                        <input
                            id="isRecursive"
                            type="checkbox"
                            value={this.state.isRecursive}
                            onChange={event => this.setState({ isRecursive: event.target.checked })}
                        />
                        <label htmlFor="isRecursive">Include cards from subcategories</label>
                    </div>
                </div>
                {this.state.isLoaded ?
                    <>
                        <QuizMaster flashcards={this.state.flashcards} />
                    </>
                    : <LoadingIndicator />
                }
            </div>
        );
    }

    /**
     * Unloads a flashcard tree into an array
     * 
     * @param {*} flashcardTree the tree to unload
     * @param {*[]} flashcards flashcards passed into this recursive function
     * @returns {*[]} flashcards to pass along
     */
    processFlashcardTree(flashcardTree, flashcards = []) {
        if (flashcardTree.flashcards == null) {
            return flashcards;
        }

        flashcards = flashcardTree.flashcards.map(flashcard => ({ ...flashcard, colour: flashcardTree.colour }));
        for (let subcategory of flashcardTree.children) {
            flashcards = [...flashcards, ...this.processFlashcardTree(subcategory, flashcards)];
        }

        return flashcards;
    }

    loadFlashcards(categoryId) {
        this.setState({ isLoaded: false });
        if (this.state.isRecursive) {
            fetch(`${constants.serverOrigin}/categories/${categoryId}`, {
                method: "GET"
            })
                .then(response => response.json())
                .then(response => {
                    let { colour, id, name } = response.category;
                    console.log(response);
                    
                    let flashcards = this.processFlashcardTree(response.category);
                    console.log("flashcards:", flashcards);
                    
                    this.setState({ category: { colour, id, name }, flashcards, isLoaded: true });
                });
        } else {
            fetch(`${constants.serverOrigin}/categories/${categoryId}`, {
                method: "GET"
            }).then(response => {
                return response.json();
            }).then(response => {
                let { colour, id, name, flashcards } = response.category;

                flashcards = flashcards.map(flashcard => ({ ...flashcard, colour }));
                this.setState({ category: { colour, id, name }, flashcards, isLoaded: true });
            });
        }
    }
}