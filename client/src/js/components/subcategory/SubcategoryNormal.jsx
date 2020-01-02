import React, { useState } from "react";
import { Link } from "react-router-dom";
import { DropTarget, DragSource } from "react-dnd";

import { draggableTypes } from "../../constants.js";

export const SubcategoryNormal = props => {

    let className = "card subcategory card-normal";
    if (props.isDragging) {
        className += " dnd-dragging";
    } else if (props.isDropOver) {
        className += " dnd-drop-hover";
    }

    let lockClassName = "subcategory-lock";
    if (props.locked === true) {
        lockClassName += " locked";
    } else {
        lockClassName += " unlocked";
    }

    // Font size can be manipulated by ems in CSS media queries as well as here
    const textSize = Math.min(1, 1 - 0.005 * (props.name.length - 5));

    return props.connectDropTarget(props.connectDragSource(
        <div
            className={className}
            style={props.styles}
            draggable="false"
            onClick={() => props.handleNavigate(props.id)}
        >
            <div className="flashcard-button" onClick={event => {
                event.stopPropagation();
                props.handleChangeView("edit");
            }}>
                <i className="material-icons">edit</i>
            </div>
            <Link className="flashcard-button" to={`/quiz/category/${props.id}`} onClick={event => event.stopPropagation()}>
                <i className="material-icons">assessment</i>
            </Link>
            <span style={{ fontSize: textSize + "em" }}>
                {props.name}
            </span>
            <span className={lockClassName}>
                <i className="material-icons" onClick={event => {
                    if (props.locked === false) {
                        event.stopPropagation();
                        props.handleLock(true);
                    } else if (props.locked === true) { // TODO: check if moderator
                        event.stopPropagation();
                        props.handleLock(false);
                    }
                }}>lock</i>
            </span>
        </div >
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

const dragCollector = (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
});

const SubcategoryNormalDropTarget = DropTarget([draggableTypes.FLASHCARD, draggableTypes.SUBCATEGORY], dropTargetSpec, dropCollector)(SubcategoryNormal);
export const SubcategoryNormalDnd = DragSource(draggableTypes.SUBCATEGORY, dragSourceSpec, dragCollector)(SubcategoryNormalDropTarget);