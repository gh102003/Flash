"use strict";

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Link, Route, Switch, Redirect } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import * as util from "./util";
import "../css/stylesheet.css";
import "../css/flashcard.css";
import "../css/subcategory.css";
import "../css/add-card.css";
import { AddCardForm, AddCategoryForm } from "./addForms.jsx";

class Page extends React.Component {
    constructor(props) {
        super(props);
    }

    handleAddButtonClick() {
        console.log("clicked");
    }

    render() {
        return (
            <div>
                <h1 className="app-title">Flash</h1>
                <BrowserRouter>
                    <Route render={({ location }) => ( // Get location for transition
                        <TransitionGroup>
                            <CSSTransition key={location.key} classNames="category" timeout={1000}>
                                <Switch location={location}>
                                    <Route path="*/category/:id" component={Category} />
                                    <Redirect from="/" to="/category/1" exact />
                                </Switch>
                            </CSSTransition>
                        </TransitionGroup>
                    )}>
                    </Route>
                </BrowserRouter>
            </div>
        );
    }
}

class Category extends React.Component {

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
        let flashcardElements = [];

        if (this.state.flashcards != null) {
            for (let flashcard of this.state.flashcards) {
                flashcardElements.push(
                    <Flashcard
                        key={flashcard.id}
                        front={flashcard.front}
                        back={flashcard.back}
                        isReversible={flashcard.is_reversible}
                        colour={this.state.colour}
                    />
                );
            }
        }

        return flashcardElements;
    }

    _renderSubcategories() {
        let subcategoryElements = [];

        if (this.state.subcategories != null) {
            for (let subcategory of this.state.subcategories) {
                subcategoryElements.push(
                    <Subcategory
                        key={subcategory.id}
                        id={subcategory.id}
                        name={subcategory.name}
                        colour={subcategory.colour}
                        handleClick={() => {
                            this.setState({ id: subcategory.id }, () => this.getFromServer());
                        }}
                    />
                );
            }
        }

        return subcategoryElements;
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

class Subcategory extends React.Component {
    render() {
        let backgroundColor = util.colourFromInteger(this.props.colour);
        let color = util.contrastingColourFromInteger(this.props.colour);
        return (
            <Link
                to={`/category/${this.props.id}`}
                className="card subcategory"
                style={{ backgroundColor, color }}
                draggable="false">
                {this.props.name}
            </Link>
        );
    }
}

class Flashcard extends React.Component {
    constructor(props) {
        super(props);

        if (this.props.isReversible && Math.random() > 0.5) {
            this.state = { side: "back" };
        } else {
            this.state = { side: "front" };
        }

        this.state.view = "normal";
    }

    _flip() {
        if (this.state.side === "front") {
            this.setState({ side: "back" });
        } else if (this.state.side === "back") {
            this.setState({ side: "front" });
        }
    }

    render() {
        let className = `card flashcard flashcard-${this.state.view} `;
        if (this.state.side === "back") {
            className += " flashcard-flipped"; // Currently unused, TODO: review
        }

        let backgroundColor = util.colourFromInteger(this.props.colour);
        let color = util.contrastingColourFromInteger(this.props.colour);
        let text = this.props[this.state.side];

        if (this.state.view === "modal") {
            return (
                <div className="modal-background" onClick={() => this.setState({ view: "normal" })}>
                    <div className={className} style={{ backgroundColor, color }} onClick={(event) => {
                        event.stopPropagation(); // Prevent parent from recieving click
                        return this._flip();
                    }}>
                        {text}
                        <div className="flashcard-button" onClick={(event) => {
                            event.stopPropagation();
                            return this.setState({ view: "normal" });
                        }}>
                            <i className="material-icons">close</i>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className={className} style={{ backgroundColor, color }} onClick={(event) => {
                    event.stopPropagation();
                    return this._flip();
                }}>
                    {text}
                    <div className="flashcard-button">
                        <i className="material-icons">edit</i>
                    </div>
                    <div className="flashcard-button" onClick={(event) => {
                        event.stopPropagation();
                        return this.setState({ view: "modal" });
                    }}>
                        <i className="material-icons">zoom_out_map</i>
                    </div>
                </div>
            );
        }
    }
}

class AddButton extends React.Component {

    constructor(props) {
        super(props);

        this.state = { activated: false };
    }

    render() {
        return (
            <div className="add-wrapper">
                <div className="add-card-button" onClick={() => this.props.handleClick("addCard")}>
                    +
                </div>
                <div className="add-subcategory-button-wrapper">
                    <div className="add-subcategory-button" onClick={() => this.props.handleClick("addCategory")}>
                        Add Category
                    </div>
                </div>
            </div>
        );
    }
}

window.onload = function () {
    ReactDOM.render(<Page />, document.getElementById("root"));
};