import React, { useState, useContext } from "react";
import * as util from "../../util";

import { UserContext } from "../../contexts/UserContext";
import { SubcategoryNormal } from "./SubcategoryNormal.jsx";
import { SubcategoryEdit } from "./SubcategoryEdit.jsx";

export const Subcategory = props => {

    const [view, setView] = useState("normal");

    let backgroundColor = util.colourFromInteger(props.colour);
    let color = util.contrastingColourFromInteger(props.colour);
    let styles = { backgroundColor, color };

    if (view === "edit") {
        return (

            <SubcategoryEdit
                name={props.name}
                styles={styles}
                handleEdit={(key, newValue) => props.handleEdit(key, newValue)}
                handleSaveEdit={(prop, newValue) => {
                    props.handleSaveEdit({ propName: prop, value: newValue });
                    setView("normal");
                }}
                handleDelete={() => props.handleDelete()}
            />
        );
    } else {
        return (
            <SubcategoryNormal
                id={props.id}
                styles={styles}
                name={props.name}
                locked={props.locked}
                handleChangeView={newView => setView(newView)}
                handleCardMove={props.handleCardMove}
                handleNavigate={props.handleNavigate}
                handleLock={lockState => {
                    props.handleEdit("locked", lockState);
                    props.handleSaveEdit({ propName: "locked", value: lockState });
                }}
            />
        );
    }
};
