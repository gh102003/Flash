import React from "react";
import { Link } from "react-router-dom";
import { DropTarget } from "react-dnd";

import * as util from "../util";
import * as constants from "../constants.js";

export class Subcategory extends React.Component {
    render() {
        let backgroundColor = util.colourFromInteger(this.props.colour);
        let color = util.contrastingColourFromInteger(this.props.colour);
        return this.props.connectDropTarget(
            <div>
                <Link
                    to={`/category/${this.props.id}`} 
                    className={this.props.isOver ? "card subcategory dnd-hover" : "card subcategory"} 
                    style={{ backgroundColor, color }} 
                    draggable="false"
                >
                    {this.props.name}
                </Link>
            </div>
        );
    }
}

// DropTarget specification - actions for drag events
const subcategoryDropTargetSpec = {
    drop: (props, monitor) => {
        props.handleFlashcardDrop(monitor.getItem().id, props.id);
    }
};

// Builds up extra props
function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    };
}

export var SubcategoryDropTarget = DropTarget(constants.draggableTypes.FLASHCARD, subcategoryDropTargetSpec, collect)(Subcategory);


