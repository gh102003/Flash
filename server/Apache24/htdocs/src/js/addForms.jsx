import React from "react";
import { BlockPicker } from "react-color";
import * as util from "./util";

export class AddCardForm extends React.Component {
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
            <div className="modal-background">
                <form className="add-card-form add-form" id="add-card-form" onSubmit={(e) => this._handleSubmit(e)}>
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
            </div>
        );
    }
}

export class AddCategoryForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { name: "", colour: "#FF0000" };
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
        return (
            <div className="modal-background">
                <form className="add-category-form add-form" id="add-category-form" onSubmit={(e) => this._handleSubmit(e)}>
                    <label>
                        Name:
                        <input name="name" type="text" value={this.state.name} onChange={(e) => this._handleChange(e)} />
                    </label>
                    <div className="colour-picker">
                        <BlockPicker
                            triangle="hide"
                            color={this.state.colour}
                            colors={[
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
                            ]}
                            onChangeComplete={(color) => this.setState({ colour: color.hex })} />
                    </div>
                    <div className="controls">
                        <input type="submit" value="Add category" />
                        <input type="button" value="Cancel" onClick={this.props.handleCancel}></input>
                    </div>
                </form>
            </div>

        );
    }
}
