import React from "react";
import { NavLink } from "react-router-dom";
import { DropTarget } from "react-dnd";

import * as util from "../../util";
import { draggableTypes } from "../../constants";

// Unpack linkedlist style object recursively
export const BreadcrumbCategory = props => {

    let style = { zIndex: props.depth };
    let activeStyle = {
        backgroundColor: util.colourFromInteger(props.category.colour),
        color: util.contrastingColourFromInteger(props.category.colour)
    };
    
    // If lowest-depth (rightmost), display category colour
    if (props.depth === 0) {
        style = {...style, ...activeStyle};
    }

    let className = "breadcrumb-category";
    if (props.isDraggingOver) {
        className += " dnd-hover";
    }

    return (
        <>
            {
                props.category.parent &&
                <BreadcrumbCategoryDropTarget handleCardMove={props.handleCardMove} category={props.category.parent} depth={props.depth + 1} handleNavigate={props.handleNavigate} />
            }

            {props.connectDropTarget(
                <a className={className} style={style} onClick={() => {
                    return props.handleNavigate(`/category/${props.category.id}`);
                }}>
                    {props.category.name}
                </a>)
            }
        </>
    );
};

const breadcrumbCategoryDropTargetSpec = {
    drop: (props, monitor) => {
        props.handleCardMove(monitor.getItemType(), monitor.getItem().id, props.category.id);
    }
};

// Builds up extra props
function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isDraggingOver: monitor.isOver()
    };
}

export var BreadcrumbCategoryDropTarget = DropTarget([draggableTypes.FLASHCARD, draggableTypes.SUBCATEGORY], breadcrumbCategoryDropTargetSpec, collect)(BreadcrumbCategory);