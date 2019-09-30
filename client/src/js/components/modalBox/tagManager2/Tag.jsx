import React from "react";
import { Link } from "react-router-dom";

import { useDrag } from "react-dnd";
import * as util from "../../../util";
import * as constants from "../../../constants";

export const Tag = props => {
    // Drag and drop hook
    const [collectedProps, drag, preview] = useDrag({
        // Tag data to be dragged
        item: {
            type: constants.draggableTypes.TAG,
            id: props.id,
            colour: props.colour,
            name: props.name
        },
        collect: monitor => ({
            isDragging: monitor.isDragging()
        }),
        begin: props.onBeginDrag,
        end: props.onEndDrag
    });

    const styles = {
        backgroundColor: util.colourFromInteger(props.colour),
        color: util.contrastingColourFromInteger(props.colour),
    };

    return (drag(
        <div className={collectedProps.isDragging ? "tag dnd-dragging" : "tag"} style={styles}>
            {props.name}
            {/* If a handler for a quiz button is supplied, show it */}
            {props.handleQuizButtonClicked &&
                <Link to={"/quiz/tag/" + props.id} className="tag-button" onClick={props.handleQuizButtonClicked}>
                    <i className="material-icons">assessment</i>
                </Link>
            }
            <i className="material-icons tag-button" onClick={event => {
                event.stopPropagation();
                props.handleDelete();
            }}>close</i>
        </div>, { dropEffect: "copy" })
    );
};