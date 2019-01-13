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

class Page extends React.Component {
    constructor(props) {
        super(props);
    }

    handleAddButtonClick() {
        console.log("clicked");
    }

    render() {
        return (
            <BrowserRouter>
                <Route render={({ location }) => ( // Get location for transition
                    <TransitionGroup>
                        <CSSTransition key={location.key} classNames="category" timeout={1000}>
                            <Switch location={location}>
                                <Route path="*/category/:id" component={Category} />
                                <Redirect from="/" to="/category/1" exact/>
                            </Switch>
                        </CSSTransition>
                    </TransitionGroup>
                )}>
                </Route>
            </BrowserRouter>
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

    afterAddCardFormSubmit() {
        this.setState({ currentForm: null });
        this.getFromServer(this.props.match.params.id);
    }

    _renderCards() {
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
            addElement = <AddCardForm
                afterSubmit={() => this.afterAddCardFormSubmit()}
                handleCancel={() => this.setState({ currentForm: null })}
                categoryId={this.props.match.params.id}>
            </AddCardForm>;
        } else {
            addElement = <AddButton handleClick={() => this.setState({ currentForm: "addCard" })} />;
        }
        return (
            <div className={this.state.loadedData ? "category-loaded" : ""} >
                <div className="card-display">{this._renderSubcategories()}{this._renderCards()}</div>
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
            <div className="add-card-button" onClick={this.props.handleClick}>
                +
                <div className="add-subcategory-button">
                    Add Category
                </div>
            </div>
        );
    }
}

class AddCardForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = { front: "", back: "", isReversible: false };
    }

    _handleChange(event) {
        let key = event.target.name;
        let value;
        if (event.target.type === "checkbox") {
            value = event.target.checked;
        } else {
            value = event.target.value;
        }
        this.setState({ [key]: value });
    }

    _handleSubmit(event) {
        let formData = new FormData(document.getElementById("add-card-form"));
        formData.set("categoryId", this.props.categoryId);
        fetch("/cgi-bin/add_flashcard.py", {
            method: "POST",
            cache: "no-cache",
            body: formData
        }).then(() => {
            this.props.afterSubmit();
        });

        event.preventDefault();
    }

    render() {
        return (
            <form className="add-card-form" id="add-card-form" onSubmit={(e) => this._handleSubmit(e)}>
                <label>
                    Front:
                    <input name="front" type="text" value={this.state.front} onChange={(e) => this._handleChange(e)} />
                </label>
                <label>
                    Back:
                    <input name="back" type="text" value={this.state.back} onChange={(e) => this._handleChange(e)} />
                </label>
                <label>
                    <input type="checkbox" name="isReversible" checked={this.state.isReversible} onChange={(e) => this._handleChange(e)} />
                    Reversible
                </label>
                <div>
                    <input type="submit" value="Add flashcard" />
                    <input type="button" value="Cancel" onClick={this.props.handleCancel} ></input>
                </div>
            </form>
        );
    }
}

window.onload = function () {
    ReactDOM.render(<Page />, document.getElementById("root"));
};