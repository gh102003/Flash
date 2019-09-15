import React from "react";
import { BlockPicker } from "react-color";
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
                    parent: this.props.parentId
                }
            })
        }).then(() => {
            this.props.afterSubmit();
        });
        event.preventDefault();
    }
    render() {
        let enableSubmit = true;
        if (!this.state.name) enableSubmit = false;
        if (!this.state.colour) enableSubmit = false;

        return (
            <div className="modal-background" onClick={this.props.handleCancel}>
                <form className="add-category-form add-form" id="add-category-form" onSubmit={(e) => this.handleSubmit(e)} onClick={event => event.stopPropagation()}>
                    <label>
                        Name:
                        <input autoFocus name="name" type="text" value={this.state.name} onChange={(e) => this.handleChange(e)} />
                    </label>
                    <div className="colour-picker">
                        <BlockPicker
                            triangle="hide"
                            color={this.state.colour}
                            colors={constants.categoryColours}
                            onChangeComplete={color => this.setState({ colour: color.hex })}
                        />
                    </div>
                    <div className="controls">
                        <input type="submit" value="Add category" disabled={!enableSubmit}/>
                        <button type="button" onClick={this.props.handleCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        );
    }
}
