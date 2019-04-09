import React from "react";

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
        }
        else {
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
        return (<div className="modal-background">
            <form className="add-card-form add-form" id="add-card-form" onSubmit={(e) => this._handleSubmit(e)}>
                <label>
                    Front:
                    <input autoFocus name="front" type="text" value={this.state.front} onChange={(e) => this._handleChange(e)} />
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
                    <input type="button" value="Cancel" onClick={this.props.handleCancel}></input>
                </div>
            </form>
        </div>);
    }
}
