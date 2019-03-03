import React from "react";

export class AddButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = { activated: false };
    }
    render() {
        return (<div className="add-wrapper">
            <div className="add-card-button" onClick={() => this.props.handleClick("addCard")}>
                +
            </div>
            <div className="add-subcategory-button-wrapper">
                <div className="add-subcategory-button" onClick={() => this.props.handleClick("addCategory")}>
                    Add Category
                </div>
            </div>
        </div>);
    }
}
