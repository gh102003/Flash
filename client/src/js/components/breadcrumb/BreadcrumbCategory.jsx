import React from "react";
import { Link } from "react-router-dom";
import { DropTarget } from "react-dnd";

import * as util from "../../util";
import { draggableTypes } from "../../constants";
import { clientOrigin, serverOrigin } from "../../envConstants";

import { useEffect, useState } from "react";

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

    const parentBreadcrumb = props.category.parent &&
        (<BreadcrumbCategoryDropTarget
            handleCardMove={props.handleCardMove}
            category={props.category.parent}
            depth={props.depth + 1}
            handleNavigate={props.handleNavigate}
        />);

    const [switchWorkspaceId, setSwitchWorkspaceId] = useState("/");

    // Fetch ids for workspace switch
    useEffect(() => {
        if (!parentBreadcrumb) {
            if (props.category.user) {
                // Get public workspace
                fetch(`${serverOrigin}/categories`)
                    .then(response => response.json())
                    .then(response => {
                        setSwitchWorkspaceId(response.categories[0].id);
                    });
            } else {
                // Get personal workspace
                util.authenticatedFetch(`categories`, {})
                    .then(response => response.json())
                    .then(response => {
                        setSwitchWorkspaceId(response.categories[0].id);
                    });
            }
        }
    }, [props.category.user]); // only when the user has actually changed

    return (
        <>
            {
                parentBreadcrumb ||
                (util.isLoggedIn() ?
                    <Link
                        className="breadcrumb-workspace"
                        style={{ zIndex: props.depth + 1 }}
                        to={switchWorkspaceId}
                    >
                        {props.category.user ?
                            <i className="material-icons">person</i>
                            :
                            <i className="material-icons">public</i>
                        }
                        <span className="switch-workspace-cta">Switch workspace</span>

                    </Link>
                    :
                    <div className="breadcrumb-workspace" style={{ zIndex: props.depth + 1 }}>
                        {props.category.user ?
                            <i className="material-icons">person</i>
                            :
                            <i className="material-icons">public</i>
                        }
                    </div>
                )
            }

            {props.connectDropTarget(
                <a className={className} style={style} onClick={() => {
                    if (props.depth === 0) {
                        if (navigator.share) {
                            navigator.share({
                                title: `Flash: ${props.category.name}`,
                                text: `View '${props.category.name}' on Flash`,
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
