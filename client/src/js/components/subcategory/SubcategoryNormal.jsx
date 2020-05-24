import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useDrag, useDrop } from "react-dnd";

import { Katex } from "../Katex.jsx";
import { UserContext } from "../../contexts/UserContext.js";
import { draggableTypes } from "../../constants.js";

export const SubcategoryNormal = props => {

    const currentUser = useContext(UserContext).currentUser;
    const moderatorLoggedIn = !!(currentUser) && currentUser.roles && currentUser.roles.includes("moderator");
    const editable = props.locked === false || moderatorLoggedIn;

    const [collectedDragProps, drag] = useDrag({
        item: {
            type: draggableTypes.SUBCATEGORY,
            id: props.id
        },
        canDrag: () => editable,
        collect: monitor => ({
            isDragging: monitor.isDragging()
        })
    });

    const [collectedDropProps, drop] = useDrop({
        accept: [draggableTypes.FLASHCARD, draggableTypes.SUBCATEGORY],
        drop: item => {
            props.handleCardMove(item.type, item.id, props.id);
        },
        canDrop: item => {
            if (!editable) return false;
            if (item.type === draggableTypes.SUBCATEGORY) {
                // Don't let it drop into itself
                return item.id !== props.id;
            }
            return true;
        },
        collect: monitor => ({
            isDropOver: monitor.isOver()
        })
    });

    let className = "card subcategory card-normal";
    if (editable && collectedDragProps.isDragging) {
        className += " dnd-dragging";
    } else if (editable && collectedDropProps.isDropOver) {
        className += " dnd-drop-hover";
    }

    let lockClassName = "subcategory-lock";
    if (props.locked === true) {
        lockClassName += " locked";
        if (moderatorLoggedIn) {
            lockClassName += " hoverable";
        }
    } else if (props.locked === "inherited") {
        lockClassName += " inherited";
    } else {
        lockClassName += " unlocked hoverable";
    }

    let lockTooltip;
    if (props.locked === true) {
        lockTooltip = "This category is locked, so only moderators can edit it and the things inside it";
    } else if (props.locked === "inherited") {
        lockTooltip = "An ancestor is locked so this category is locked as well";
    } else {
        lockTooltip = "Lock to stop everyone except moderators editing or unlocking it";
    }

    // Font size can be manipulated by ems in CSS media queries as well as here
    const textSize = Math.min(1, 1 - 0.005 * (props.name.length - 5));

    return drop(drag(
        <div
            className={className}
            style={props.styles}
            draggable="false"
            onClick={() => props.handleNavigate(props.id)}
        >
            {editable && <div className="flashcard-button" onClick={event => {
                event.stopPropagation();
                props.handleChangeView("edit");
            }}>

                <i className="material-icons">edit</i>
            </div>}
            <Link className="flashcard-button" to={`/quiz/category/${props.id}`} onClick={event => event.stopPropagation()}>
                <i className="material-icons">assessment</i>
            </Link>
            <span style={{ fontSize: textSize + "em" }}>
                {props.name}
            </span>
            {   // Don't show lock for categories in private workspaces unless they are already locked
                (props.user === null || props.locked) && <span className={lockClassName}>
                    <i
                        className="material-icons"
                        title={lockTooltip}
                        onClick={event => {
                            event.stopPropagation();
                            if (props.locked === false) {
                                props.handleLock(true);
                            } else if (props.locked === true && moderatorLoggedIn) {
                                props.handleLock(false);
                            }
                        }}
                    >{props.locked === false ? "lock_open" : "lock"}</i>
                </span>
            }
        </div >
    ));
};