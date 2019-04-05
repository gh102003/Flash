import React from "react";
import { Link } from "react-router-dom";
import { DropTarget } from "react-dnd";

import * as util from "../../util";
import * as constants from "../../constants";

// Unpack linkedlist style object recursively
export function BreadcrumbCategory(props) {

    // If lowest-depth (rightmost), display category colour
    let backgroundColor = null;
    let color = null;
    if (props.depth < 1) {
        backgroundColor = util.colourFromInteger(props.category.colour);
        color = util.contrastingColourFromInteger(props.category.colour);
    }
    let style = { zIndex: props.depth, backgroundColor, color };

    let className = "breadcrumb-category";
    if (props.isDraggingOver) {
        className += " dnd-hover";
    }

    return (
        <>
            {props.category.parent && <BreadcrumbCategoryDropTarget handleFlashcardDrop={props.handleFlashcardDrop} category={props.category.parent} depth={props.depth + 1} />}
            <Link to={`/category/${props.category.id}`} className={className} style={style}>
                {props.connectDropTarget(<span>
                    {props.category.name}
                </span>)}
            </Link>
        </>
    );
}

const breadcrumbCategoryDropTargetSpec = {
    drop: (props, monitor) => {
        props.handleFlashcardDrop(monitor.getItem().id, props.category.id);
    }
};

// Builds up extra props
function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isDraggingOver: monitor.isOver()
    };
}

export var BreadcrumbCategoryDropTarget = DropTarget(constants.draggableTypes.FLASHCARD, breadcrumbCategoryDropTargetSpec, collect)(BreadcrumbCategory);
