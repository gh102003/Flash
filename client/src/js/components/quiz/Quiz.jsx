import React from "react";
import { Helmet } from "react-helmet";

import { NetworkIndicator } from "../NetworkIndicator.jsx";
import { QuizMaster } from "./QuizMaster.jsx";

import * as util from "../../util";
import "../../../css/quiz.scss";

export class Quiz extends React.Component {

    constructor(props) {
        super(props);
        this.state = { category: null, isRecursive: false, isLoaded: false };
    }

    componentDidMount() {
        this.loadFlashcards(this.props.match.params.categoryId);
    }

    componentDidUpdate(prevProps, prevState) {
        let updatedLocation = prevProps.match.params !== this.props.match.params;
        let updatedSettings = prevState.isRecursive !== this.state.isRecursive;

        if (updatedLocation || updatedSettings) {
            this.loadFlashcards(this.props.match.params.categoryId);
        }
    }

    render() {

        let title = "Quiz";
        if (this.props.match.params.categoryId) {
            title = "Category " + title;
        } else if (this.props.match.params.tagId) {
            title = "Tag " + title;
        }
        title = title + ": " + (this.state.category == null ? "" : this.state.category.name);

        return (
            <div className="quiz">
                <Helmet>
                    <title>{title}</title>
                    <meta property="og:title" content={title} />
                </Helmet>
                <div className="quiz-setup">
                    <h2 className="quiz-title">{title}</h2>
                    {this.props.match.params.categoryId && <div className="setting">
                        <input
                            id="isRecursive"
                            type="checkbox"
                            value={this.state.isRecursive}
                            onChange={event => this.setState({ isRecursive: event.target.checked })}
                        />
                        <label htmlFor="isRecursive">Include cards from subcategories</label>
                    </div>}
                </div>
                {this.state.isLoaded ?
                    <>
                        <QuizMaster flashcards={this.state.flashcards} />
                    </>
                    : <div className="quiz-master-loading">
                        <NetworkIndicator />
                    </div>
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

    async loadFlashcards() {
        this.setState({ isLoaded: false });

        let categoryId = this.props.match.params.categoryId;
        let tagId = this.props.match.params.tagId;

        if (categoryId) {
            if (this.state.isRecursive) {
                // FIXME: potential CSRF vulnerabilities
                const response = await util.authenticatedFetch(`categories/${categoryId}?populateChildren=true`, { method: "GET" });
                const responseJson = await response.json();
                let { colour, id, name } = responseJson.category;
                let flashcards = this.processFlashcardTree(responseJson.category);

                this.setState({ category: { colour, id, name }, flashcards, isLoaded: true });
            } else {
                const response = await util.authenticatedFetch(`categories/${categoryId}`, { method: "GET" });
                const responseJson = await response.json();
                let { colour, id, name, flashcards } = responseJson.category;

                flashcards = flashcards.map(flashcard => ({ ...flashcard, colour }));
                this.setState({ category: { colour, id, name }, flashcards, isLoaded: true });
            }
        } else if (tagId) {
            const response = await util.authenticatedFetch(`tags/${tagId}`, { method: "GET" });
            const responseJson = await response.json();
            let { colour, id, name, flashcards } = responseJson;

            flashcards = flashcards.map(flashcard => ({ ...flashcard, colour }));
            this.setState({ category: { colour, id, name }, flashcards, isLoaded: true });
        }

    }
}