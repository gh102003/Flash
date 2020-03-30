import React from "react";
import { TwitterPicker } from "react-color";
import { GlobalHotKeys } from "react-hotkeys";

import * as util from "../util";
import * as constants from "../constants";

export class AddCategoryForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = { name: "", colour: constants.categoryColours[0] };
    }
    handleChange(event) {
        let key = event.target.name;
        let value = event.target.value;
        this.setState({ [key]: value });
    }
    handleSubmit(event) {
        util.authenticatedFetch("categories", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                category: {
                    name: this.state.name,
                    colour: util.colourToInteger(this.state.colour),
                    parent: this.props.parent.id
                }
            })
        }).then(() => {
            this.props.afterSubmit();
        });
        event.preventDefault();
    }
    render() {
        const usernamesVisibleTo = this.props.parent.user ? "Only you" : "Everyone";

        // Validation
        let enableSubmit = true;
        if (!this.state.name) enableSubmit = false;
        if (!this.state.colour) enableSubmit = false;

        return (
            <div className="modal-background" onClick={this.props.handleCancel}>
                <GlobalHotKeys keyMap={constants.keyMap} handlers={{
                    CLOSE_MODAL_BOX: this.props.handleCancel
                }} />
                <div className="modal add add-category" onClick={event => event.stopPropagation()}>
                    <div className="modal-header">
                        <h2>Add Category</h2>
                        <i className="material-icons button-close" onClick={this.props.handleCancel}>close</i>
                    </div>
                    <div className="modal-body">
                        <form className="add-category-form add-form" id="add-category-form" onSubmit={e => this.handleSubmit(e)} onClick={event => event.stopPropagation()}>
                            <label htmlFor="input-name">Name:</label>
                            <input autoFocus id="input-name" name="name" type="text" autoComplete="off" size="30" value={this.state.name} onChange={e => this.handleChange(e)} />
                            <div className="colour-picker">
                                <TwitterPicker
                                    color={this.state.colour}
                                    width={240}
                                    triangle="hide"
                                    colors={constants.categoryColours}
                                    onChangeComplete={color => this.setState({ colour: color.hex })}
                                />
                            </div>
                            <div className="usernames-visible-to">{usernamesVisibleTo} will be able to see and edit this</div>
                            <div className="controls">
                                <input type="submit" value="Add category" disabled={!enableSubmit} />
                                <button type="button" onClick={this.props.handleCancel}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
