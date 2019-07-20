import React from "react";

export var SubcategoryEdit = props => {
    return (
        <div className="card subcategory card-edit" 
            style={props.styles} 
            onClick={(event) => event.stopPropagation()}
        >
            <div className="flashcard-button" onClick={(event) => {
                event.stopPropagation();
                props.handleSaveEdit();
            }}>
                <i className="material-icons" >done</i>
            </div>
            <div className="flashcard-button" onClick={(event) => {
                event.stopPropagation();
                props.handleDelete();
            }}>
                <i className="material-icons" >delete</i>
            </div>
            <input
                type="text"
                autoFocus
                value={props.name}
                onChange={(e) => props.handleEdit(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                    if (e.keyCode === 13) { // Enter
                        props.handleSaveEdit();
                    }
                }}
            />
        </div>
    );
}