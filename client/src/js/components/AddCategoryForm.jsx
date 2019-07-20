import React from "react";
import { BlockPicker } from "react-color";
import * as util from "../util";
import * as constants from "../constants";

export class AddCategoryForm extends React.Component {
    constructor(props) {
        super(props);
        
        this._colors = [
            "#D8B086",
            "#eccc68",
            "#ffa502",
            "#ff7f50",
            "#ff6348",
            "#ff4757",
            "#ff6b81",
            "#C359B5",
            "#7C5CBC",
            "#7bed9f",
            "#2ed573",
            "#619B8A",
            "#5352ed",
            "#1e90ff",
            "#dfe4ea",
            "#a4b0be",
            "#57606f",
            "#2f3542"
        ];

        this.state = { name: "", colour: this._colors[0] };
    }
    _handleChange(event) {
        let key = event.target.name;
        let value = event.target.value;
        this.setState({ [key]: value });
    }
    _handleSubmit(event) {
        fetch(`${constants.serverOrigin}/categories/`, {
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
        return (
            <div className="modal-background" onClick={this.props.handleCancel}>
                <form className="add-category-form add-form" id="add-category-form" onSubmit={(e) => this._handleSubmit(e)} onClick={event => event.stopPropagation()}>
                    <label>
                        Name:
                        <input autoFocus name="name" type="text" value={this.state.name} onChange={(e) => this._handleChange(e)} />
                    </label>
                    <div className="colour-picker">
                        <BlockPicker 
                            triangle="hide" 
                            color={this.state.colour} 
                            colors={this._colors} 
                            onChangeComplete={(color) => this.setState({ colour: color.hex })} 
                        />
                    </div>
                    <div className="controls">
                        <input type="submit" value="Add category" />
                        <button onClick={this.props.handleCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        );
    }
}
