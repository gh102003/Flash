import React from "react";

import { LoadingIndicator } from "../LoadingIndicator.jsx";
import { QuizMaster } from "./QuizMaster.jsx";

import "../../../css/quiz.css";

export class Quiz extends React.Component {

    constructor(props) {
        super(props);
        this.state = { category: null, isRecursive: false, isLoaded: false };
    }

    componentDidMount() {
        this._loadFlashcards(this.props.match.params.categoryId);
    }

    componentDidUpdate(prevProps, prevState) {
        let updatedLocation = prevProps.match.params.categoryId !== this.props.match.params.categoryId;
        let updatedSettings = prevState.isRecursive !== this.state.isRecursive;

        if (updatedLocation || updatedSettings) {
            this._loadFlashcards(this.props.match.params.categoryId);
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
                        <QuizMaster flashcards={this.state.flashcards}/>
                    </>
                    : <LoadingIndicator />
                }
            </div>
        );
    }

    _processFlashcardTree(flashcards, flashcardTree) {
        if (flashcardTree.flashcards == null) {
            return flashcards;
        }

        flashcards = flashcardTree.flashcards.map(flashcard => ({...flashcard, colour: flashcardTree.colour}));
        for (let subcategory of flashcardTree.subcategories) {
            flashcards = [...flashcards, ...this._processFlashcardTree(flashcards, subcategory)];
        }

        return flashcards;
    }

    _loadFlashcards(categoryId) {
        this.setState({isLoaded: false});
        if (this.state.isRecursive) {
            fetch(`/cgi-bin/get_child_categories.py?id=${categoryId}`, {
                method: "GET",
                cache: "no-cache"
            }).then(response => {
                return response.json();
            }).then(response => {
                let { colour, id, name, parent_id } = response;
                let flashcards = this._processFlashcardTree([], response);

                this.setState({ category: {colour, id, name, parent_id}, flashcards, isLoaded: true });
            });
        } else {
            fetch(`/cgi-bin/get_category.py?id=${categoryId}`, {
                method: "GET",
                cache: "no-cache"
            }).then(response => {
                return response.json();
            }).then(response => {
                let { colour, id, name, parent_id } = response;
                let flashcards = response.flashcards.map(flashcard => ({...flashcard, colour}));
                this.setState({ category: {colour, id, name, parent_id}, flashcards, isLoaded: true });
            });
        }
    }
}