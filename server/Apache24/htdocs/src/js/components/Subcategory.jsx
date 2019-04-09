import React from "react";
import { Link } from "react-router-dom";
import { DropTarget, DragSource } from "react-dnd";

import * as util from "../util";
import { draggableTypes } from "../constants.js";

export class Subcategory extends React.Component {
    render() {
        let backgroundColor = util.colourFromInteger(this.props.colour);
        let color = util.contrastingColourFromInteger(this.props.colour);

        let className = "card subcategory";
        if (this.props.isDragging) {
            className += " dnd-dragging";
        } else if (this.props.isDropOver) {
            className += " dnd-drop-hover";
        }

        return this.props.connectDragSource(this.props.connectDropTarget(
            <div>
                <Link
                    to={`/category/${this.props.id}`}
                    className={className}
                    style={{ backgroundColor, color }}
                    draggable="false"
                >
                    {this.props.name}
                </Link>
            </div>
        ));
    }
}

// DropTarget specification - actions for drop events
const dropTargetSpec = {
    drop: (props, monitor) => {
        props.handleCardMove(monitor.getItemType(), monitor.getItem().id, props.id);
    },
    canDrop: (props, monitor) => {
        if (monitor.getItemType() === draggableTypes.SUBCATEGORY) {
            return monitor.getItem().id !== props.id;
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

var dragCollector = (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
});

var SubcategoryDropTarget = DropTarget([draggableTypes.FLASHCARD, draggableTypes.SUBCATEGORY], dropTargetSpec, dropCollector)(Subcategory);
export var SubcategoryDnd = DragSource(draggableTypes.SUBCATEGORY, dragSourceSpec, dragCollector)(SubcategoryDropTarget);


