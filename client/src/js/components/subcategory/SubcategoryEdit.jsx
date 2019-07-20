import React, { useState } from "react";
import { BlockPicker } from "react-color";
import AutosizeInput from "react-input-autosize";
import * as util from "../../util";

import * as constants from "../../constants";

export var SubcategoryEdit = props => {

    const [editDialog, setEditDialog] = useState(0);

    return (
        <div className="card subcategory card-edit"
            style={props.styles}
            onClick={(event) => event.stopPropagation()}
        >
            <div className="flashcard-button" onClick={(event) => {
                event.stopPropagation();
                props.handleSaveEdit("name", props.name);
            }}>
                <i className="material-icons" >done</i>
            </div>

            <div className="flashcard-button" onClick={(event) => {
                event.stopPropagation();
                setEditDialog("colour");
            }}>
                <i className="material-icons" >palette</i>
            </div>

            <div className="flashcard-button" onClick={(event) => {
                event.stopPropagation();
                props.handleDelete();
            }}>
                <i className="material-icons">delete</i>
            </div>


            <AutosizeInput
                type="text"
                autoFocus
                value={props.name}
                style={{ borderBottom: `2px solid ${props.styles.color.replace("1)", "0.6)")}` }} // Transparent version of text colour
                onChange={(e) => props.handleEdit(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                    if (e.keyCode === 13) { // Enter
                        props.handleSaveEdit("name", props.name);
                    }
                }}
            />

            {
                editDialog === "colour" &&
                <div className="edit-dialog edit-dialog-colour">
                    <BlockPicker
                        triangle="top"
                        color={props.styles.colour}
                        colors={constants.categoryColours}
                        onChangeComplete={colour => {
                            setEditDialog(null);
                            let colourValue = util.colourToInteger(colour.hex);
                            props.handleEdit("colour", colourValue);
                            props.handleSaveEdit("colour", colourValue);
                        }}
                    />
                </div>
            }
        </div>
    );
};