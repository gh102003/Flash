import React from "react";


import * as util from "../../util";

import { SubcategoryNormalDnd } from "./SubcategoryNormal.jsx";
import { SubcategoryEdit } from "./SubcategoryEdit.jsx";

export class Subcategory extends React.Component {
    constructor(props) {
        super(props);
        this.state = { view: "normal" };
    }

    render() {
        let backgroundColor = util.colourFromInteger(this.props.colour);
        let color = util.contrastingColourFromInteger(this.props.colour);
        let styles = { backgroundColor, color };

        if (this.state.view === "edit") {
            return (
                <SubcategoryEdit
                    name={this.props.name}
                    styles={styles}
                    handleEdit={(newValue) => this.props.handleEdit(newValue)}
                    handleSaveEdit={() => {
                        this.props.handleSaveEdit(this.props.name);
                        this.setState({ view: "normal" });
                    }}
                    handleDelete={() => this.props.handleDelete()}
                />
            );
        } else {
            return (
                <SubcategoryNormalDnd
                    id={this.props.id}
                    styles={styles}
                    name={this.props.name}
                    handleChangeView={newView => this.setState({ view: newView })}
                    handleCardMove={this.props.handleCardMove}
                />
            );
        }
    }
}


