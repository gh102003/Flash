import React from "react";
import { DragSource } from "react-dnd";

import * as constants from "../../constants.js";

export class FlashcardNormal extends React.Component {
    render() {
        let className = "card flashcard flashcard-normal";
        if (this.props.isDragging) {
            className += " flashcard-dragging";
        }

        let wrapperFunction = this.props.connectDragSource || (x => x);
    
        return wrapperFunction(
            <div className={className} style={this.props.styles} onClick={(event) => {
                event.stopPropagation();
                this.props.handleFlip();
            }}>
                <div className="flashcard-button" onClick={(event) => {
                    event.stopPropagation();
                    this.props.handleChangeView("edit");
                }}>
                    <i className="material-icons">edit</i>
                </div>
                <div className="flashcard-button" onClick={(event) => {
                    event.stopPropagation();
                    this.props.handleChangeView("modal");
                }}>
                    <i className="material-icons" >zoom_out_map</i>
                </div>
                <span>{this.props.text}</span>
            </div>
        );
    }
}

// DragSource specification - actions for drag events
const flashcardDragSourceSpec = {
    beginDrag: (props, monitor) => ({ id: props.id }) // Passed to dropTarget spec
};

// Builds up extra props
function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging(),
    };
}

export var FlashcardNormalDragSource = DragSource(constants.draggableTypes.FLASHCARD, flashcardDragSourceSpec, collect)(FlashcardNormal);