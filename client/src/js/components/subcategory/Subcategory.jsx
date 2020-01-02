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
                    handleEdit={(key, newValue) => this.props.handleEdit(key, newValue)}
                    handleSaveEdit={(prop, newValue) => {
                        this.props.handleSaveEdit({ propName: prop, value: newValue });
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
                    locked={this.props.locked}
                    handleChangeView={newView => this.setState({ view: newView })}
                    handleCardMove={this.props.handleCardMove}
                    handleNavigate={this.props.handleNavigate}
                    handleLock={lockState => {
                        this.props.handleEdit("locked", lockState);
                        this.props.handleSaveEdit({propName: "locked", value: lockState});
                    }}
                />
            );
        }
    }
}


