import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { DropTarget, DragSource } from "react-dnd";

import { draggableTypes } from "../../constants.js";

export var SubcategoryNormal = props => {

    // State hook for redirect used instead of a React Router <Link>
    const [redirect, setRedirect] = useState("");

    if (redirect && redirect !== window.location.pathname) {
        return <Redirect push to={redirect}/>;
    }

    let className = "card subcategory card-normal";
    if (props.isDragging) {
        className += " dnd-dragging";
    } else if (props.isDropOver) {
        className += " dnd-drop-hover";
    }

    return props.connectDropTarget(props.connectDragSource(
        <div>
            <div
                to={`/category/${props.id}`}
                className={className}
                style={props.styles}
                draggable="false"
                onClick={() => setRedirect(`/category/${props.id}`)}
            >
                <div className="flashcard-button" onClick={event => {
                    event.preventDefault();
                    props.handleChangeView("edit");
                }}>
                    <i className="material-icons">edit</i>
                </div>
                <Link className="flashcard-button" to={`/category/${props.id}/quiz`}>
                    <i className="material-icons">assessment</i>
                </Link>
                {props.name}
            </div>
        </div>
    ));
};

// DropTarget specification - actions for drop events
const dropTargetSpec = {
    drop: (props, monitor) => {
        props.handleCardMove(monitor.getItemType(), monitor.getItem().id, props.id);
    },
    canDrop: (props, monitor) => {
        if (monitor.getItemType() === draggableTypes.SUBCATEGORY) {
            return monitor.getItem().id !== props.id;
        } else {
            return true;
        }
    }
};

// Builds up extra props
var dropCollector = (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isDropOver: monitor.isOver()
});


// DragSource spec
const dragSourceSpec = {
    beginDrag: props => ({ id: props.id })
};

var dragCollector = (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
});

var SubcategoryNormalDropTarget = DropTarget([draggableTypes.FLASHCARD, draggableTypes.SUBCATEGORY], dropTargetSpec, dropCollector)(SubcategoryNormal);
export var SubcategoryNormalDnd = DragSource(draggableTypes.SUBCATEGORY, dragSourceSpec, dragCollector)(SubcategoryNormalDropTarget);