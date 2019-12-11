import React from "react";
import { NavLink } from "react-router-dom";
import { DropTarget } from "react-dnd";

import * as util from "../../util";
import { clientOrigin, draggableTypes } from "../../constants";

// Unpack linkedlist style object recursively
export const BreadcrumbCategory = props => {

    if (!props || !props.category.colour) throw new Error("BreadcrumbCategory must be supplied with a valid category");

    let style = { zIndex: props.depth };
    let activeStyle = {
        backgroundColor: util.colourFromInteger(props.category.colour),
        color: util.contrastingColourFromInteger(props.category.colour)
    };

    // If lowest-depth (rightmost), display category colour
    if (props.depth === 0) {
        style = { ...style, ...activeStyle };
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
                    if (props.depth === 0) {
                        if (navigator.share) {
                            navigator.share({
                                title: `Flash: ${props.category.name}`,
                                text: `View ${props.category.name} on Flash`,
                                url: `${clientOrigin}/category/${props.category.id}`

                            }).then(() => console.log("Shared successfully"));
                        } else {
                            console.log("Web Share API is not available");
                        }
                    } else {
                        props.handleNavigate(`/category/${props.category.id}`);
                    }
                }}>
                    {props.category.name}
                    {props.depth === 0 && navigator.share &&
                        <i className="material-icons">share</i>
                    }
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
