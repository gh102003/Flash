import React, { useState, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

import * as constants from "../../constants.js";
import { Tag } from "../modalBox/tagManager/Tag.jsx";

export const FlashcardNormal = props => {

    // Drag and drop
    const [collectedDragProps, drag] = useDrag({
        item: {
            type: constants.draggableTypes.FLASHCARD,
            id: props.id
        },
        canDrag: () => props.editable,
        collect: monitor => ({
            isDragging: monitor.isDragging()
        })
    });
    const [collectedDropProps, drop] = useDrop({
        accept: constants.draggableTypes.TAG,
        canDrop: item => {
            if (!props.editable) return false;
            if (props.tags.some(tag => tag.id === item.id)) return false; // If the tag is already on this flashcard, no dragging allowed
            return true;
        },
        drop: item => {
            return props.handleTagAdd(item);
        }
    });

    let className = "card flashcard card-normal";
    if (collectedDragProps.isDragging) {
        className += " dnd-dragging";
    }

    const [tagsScrollIntervalId, setTagsScrollIntervalId] = useState();
    const lastMouseX = useRef(); // Use a ref instead of state to make the value update the setTimeout callback

    // Ref for custom tag scrolling behaviour
    var tagsRef = useRef();
    const customScrollTags = function (tagsRefCurrent) {
        const divRect = tagsRefCurrent.getBoundingClientRect();
        const mouseX = lastMouseX.current - divRect.left; // x position within the element

        if (mouseX < 20) {
            tagsRefCurrent.scrollLeft -= 1;
        } else if (mouseX > divRect.width - 20) {
            tagsRefCurrent.scrollLeft += 1;
        }
    };

    // Font size can be manipulated by ems in CSS media queries as well as here
    const textSize = Math.min(1, 1 - 0.0036 * props.text.length);

    return drop(drag(
        <div className={className} style={props.styles} onClick={event => {
            event.stopPropagation();
            props.handleFlip();
        }}>
            {/* Buttons */}
            <div className="flashcard-button" onClick={event => {
                event.stopPropagation();
                props.handleChangeView("edit");
            }}>
                <i className="material-icons">edit</i>
            </div>
            <div className="flashcard-button" onClick={event => {
                event.stopPropagation();
                props.handleChangeView("modal");
            }}>
                <i className="material-icons" >zoom_out_map</i>
            </div>

            <span style={{fontSize: textSize + "em"}}>{props.text}</span>

            <div
                className="tags"
                ref={tagsRef}
                onMouseEnter={() => setTagsScrollIntervalId(setInterval(() => customScrollTags(tagsRef.current), 12))}
                onMouseLeave={() => clearInterval(tagsScrollIntervalId)}
                onMouseMove={event => lastMouseX.current = event.clientX}
            >
                {props.tags.map(tag => (
                    <Tag name={tag.name}
                        colour={tag.colour}
                        key={tag.id}
                        id={tag.id}
                        handleDelete={() => props.handleTagDelete(tag)}
                    />
                ))}
            </div>
        </div >
    ));
};