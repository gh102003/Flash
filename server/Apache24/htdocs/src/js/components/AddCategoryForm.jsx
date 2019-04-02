import React from "react";
import { BlockPicker } from "react-color";
import * as util from "../util";

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
        let formData = new FormData(document.getElementById("add-category-form"));
        formData.set("parentId", this.props.parentId);
        formData.set("colour", util.colourToInteger(this.state.colour));
        fetch("/cgi-bin/add_category.py", {
            method: "POST",
            cache: "no-cache",
            body: formData
        }).then(() => {
            this.props.afterSubmit();
        });
        event.preventDefault();
    }
    render() {
        return (<div className="modal-background">
            <form className="add-category-form add-form" id="add-category-form" onSubmit={(e) => this._handleSubmit(e)}>
                <label>
                    Name:
                    <input name="name" type="text" value={this.state.name} onChange={(e) => this._handleChange(e)} />
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
                    <input type="button" value="Cancel" onClick={this.props.handleCancel}></input>
                </div>
            </form>
        </div>);
    }
}
