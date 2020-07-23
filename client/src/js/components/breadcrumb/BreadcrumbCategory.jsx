import React, { useEffect, useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDrop } from "react-dnd";
import { GlobalHotKeys } from "react-hotkeys";

import { ShareCategoryModal } from "../ShareCategoryModal.jsx";

import * as util from "../../util";
import * as constants from "../../constants";
import { draggableTypes } from "../../constants";
import { clientOrigin, serverOrigin } from "../../envConstants";
import { UserContext } from "../../contexts/UserContext";

// Unpack linkedlist style object recursively
export const BreadcrumbCategory = props => {

    const [isSharing, setIsSharing] = useState(false);
    const [switchWorkspaceId, setSwitchWorkspaceId] = useState("/");

    const currentUser = useContext(UserContext).currentUser;
    const moderatorLoggedIn = !!(currentUser) && currentUser.roles && currentUser.roles.includes("moderator");
    const editable = props.category.locked === false || moderatorLoggedIn;

    const [collectedDropProps, drop] = useDrop({
        accept: [draggableTypes.FLASHCARD, draggableTypes.SUBCATEGORY],
        drop: item => {
            props.handleCardMove(item.type, item.id, props.category.id);
        },
        canDrop: () => editable,
        collect: monitor => ({
            isDraggingOver: monitor.isOver()
        })
    });

    if (!props || !props.category.colour) throw new Error("BreadcrumbCategory must be supplied with a valid category");

    let style = { zIndex: isSharing ? 1000 : props.depth };
    let activeStyle = {
        backgroundColor: util.colourFromInteger(props.category.colour),
        color: util.contrastingColourFromInteger(props.category.colour)
    };

    // If lowest-depth (rightmost), display category colour
    if (props.depth === 0) {
        style = { ...style, ...activeStyle };
    }

    let className = "breadcrumb-category";
    if (collectedDropProps.isDraggingOver) {
        className += " dnd-hover";
    }
    if (isSharing) {
        className += " sharing";
    }

    const parentBreadcrumb = props.category.parent &&
        (<BreadcrumbCategory
            handleCardMove={props.handleCardMove}
            category={props.category.parent}
            depth={props.depth + 1}
            handleNavigate={props.handleNavigate}
        />);

    // Fetch ids for workspace switch
    useEffect(() => {
        // Fetch request aborting
        const abortController = new AbortController();
        const abortControllerSignal = abortController.signal;

        if (!parentBreadcrumb) {
            if (props.category.user) {
                // Get public workspace
                fetch(`${serverOrigin}/categories`, { signal: abortControllerSignal })
                    .then(response => response.json())
                    .then(response => {
                        setSwitchWorkspaceId(response.categories[0].id);
                    });
            } else {
                // Get personal workspace
                util.authenticatedFetch(`categories`, { signal: abortControllerSignal })
                    .then(response => response.json())
                    .then(response => {
                        setSwitchWorkspaceId(response.categories[0].id);
                    });
            }
        }

        // Abort requests on unmount
        return () => abortController.abort();
    }, [props.category.user]); // only when the user has actually changed

    const history = useHistory();

    return (
        <>
            {
                parentBreadcrumb ||
                (currentUser ?
                    <>
                        <GlobalHotKeys keyMap={constants.keyMap} handlers={{
                            SWITCH_WORKSPACE: () => history.push("/category/" + switchWorkspaceId)
                        }} />
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
                    </>
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

            {isSharing && <ShareCategoryModal category={props.category} handleClose={() => setIsSharing(false)} />}

            {drop(
                <a className={className} style={style} onClick={() => {
                    if (props.depth === 0) {
                        setIsSharing(true);
                        // if (navigator.share) {
                        //     navigator.share({
                        //         title: `Flash: ${props.category.name}`,
                        //         text: `View '${props.category.name}' on Flash`,
                        //         url: `${clientOrigin}/category/${props.category.id}`

                        //     }).then(() => console.log("Shared successfully"));
                        // } else {
                        //     console.log("Web Share API is not available");
                        // }
                    } else {
                        props.handleNavigate(`/category/${props.category.id}`);
                    }
                }}>
                    {props.category.locked === true && <i className="material-icons icon-locked">lock</i>}
                    {props.category.name}
                    {props.depth === 0 /*&& navigator.share*/ &&
                        <i className="material-icons icon-share">share</i>
                    }
                    {props.depth === 1 && // Hotkey for going to parent category
                        <GlobalHotKeys keyMap={constants.keyMap} handlers={{
                            BACK_UP_TO_PARENT: () => props.handleNavigate(`/category/${props.category.id}`)
                        }} />
                    }
                </a>)
            }
        </>
    );
};