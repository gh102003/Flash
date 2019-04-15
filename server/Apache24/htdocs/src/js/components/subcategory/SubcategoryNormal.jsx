import React from "react";
import { Link } from "react-router-dom";
import { DropTarget, DragSource } from "react-dnd";

import { draggableTypes } from "../../constants.js";

export var SubcategoryNormal = props => {

    let className = "card subcategory card-normal";
    if (props.isDragging) {
        className += " dnd-dragging";
    } else if (props.isDropOver) {
        className += " dnd-drop-hover";
    }

    return props.connectDropTarget(props.connectDragSource(
        <div>
            <Link
                to={`/category/${props.id}`}
                className={className}
                style={props.styles}
                draggable="false"
            >
                <div className="flashcard-button" onClick={event => {
                    event.preventDefault();
                    props.handleChangeView("edit");
                }}>
                    <i className="material-icons">edit</i>
                </div>
                <div className="flashcard-button">
                    <i className="material-icons">assessment</i>
                </div>
                {props.name}
            </Link>
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