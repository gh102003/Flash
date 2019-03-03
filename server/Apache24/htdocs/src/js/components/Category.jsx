import React from "react";

import * as util from "../util";
import { Flashcard } from "./Flashcard.jsx";
import { Subcategory } from "./Subcategory.jsx";
import { AddCardForm } from "./AddCardForm.jsx";
import { AddCategoryForm } from "./AddCategoryForm.jsx";
import { AddButton } from "./AddButton.jsx";

export class Category extends React.Component {

    constructor(props) {
        super(props);
        this.state = { currentForm: null };
    }

    async componentWillMount() {
        await this.getFromServer(this.props.match.params.id);
        this.state.loadedData = true;
    }

    async componentWillReceiveProps(nextProps) {
        // Check for a change in location, indicating that the page has been navigated
        if (this.props.location !== nextProps.location) {
            this.setState({ loadedData: false });
            await this.getFromServer(nextProps.match.params.id);
            this.setState({ loadedData: true });
        }
    }

    getFromServer(categoryId) {
        fetch(`/cgi-bin/get_category.py?id=${categoryId}`, {
            method: "GET",
            cache: "no-cache"
        }).then(response => {
            return response.json();
        }).then(response => {
            let { id, name, colour, parent_id, flashcards, subcategories } = response;
            util.shuffle(flashcards);
            this.setState({ id, name, colour, parent_id, flashcards, subcategories });
        });
    }

    afterAddFormSubmit() {
        this.setState({ currentForm: null });
        this.getFromServer(this.props.match.params.id);
    }

    _renderFlashcards() {
        if (!this.state.flashcards) return null;

        return this.state.flashcards.map((flashcard) => (
            <Flashcard
                key={flashcard.id}
                front={flashcard.front}
                back={flashcard.back}
                isReversible={flashcard.is_reversible}
                colour={this.state.colour}
            />
        ));
    }

    _renderSubcategories() {
        if (!this.state.subcategories) return null;
        
        return this.state.subcategories.map((subcategory) => (
            <Subcategory
                key={subcategory.id}
                id={subcategory.id}
                name={subcategory.name}
                colour={subcategory.colour}
            />
        ));
    }

    render() {
        let addElement;
        if (this.state.currentForm === "addCard") {
            addElement = (
                <AddCardForm
                    afterSubmit={() => this.afterAddFormSubmit()}
                    handleCancel={() => this.setState({ currentForm: null })}
                    categoryId={this.props.match.params.id}>
                </AddCardForm>
            );
        } else if (this.state.currentForm === "addCategory") {
            addElement = (
                <AddCategoryForm
                    afterSubmit={() => this.afterAddFormSubmit()}
                    handleCancel={() => this.setState({ currentForm: null })}
                    parentId={this.props.match.params.id}>
                </AddCategoryForm>
            );
        } else {
            addElement = <AddButton handleClick={(nextForm) => this.setState({ currentForm: nextForm })} />;
        }
        return (
            <div className={this.state.loadedData ? "category-loaded" : ""} >
                <div className="card-display">{this._renderSubcategories()}{this._renderFlashcards()}</div>
                {addElement}
            </div>
        );
    }
}
