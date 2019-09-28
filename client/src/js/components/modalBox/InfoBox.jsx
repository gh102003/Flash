import React from "react";
import { version } from "../../constants";

export function InfoBox(props) {
    return (
        <div className="modal-background" onClick={props.handleClose}>
            <div className="modal info-box" onClick={(event) => event.stopPropagation()}>
                <div className="modal-header">
                    <h2>Flash v{version}{version.split(".")[0] < 1 && "-alpha"}</h2>
                    by George Howarth
                    <i className="material-icons button-close" onClick={props.handleClose}>close</i>
                </div>
                <div className="modal-body">
                    <p>Create, manage and practise with your own flashcards!</p>
                    <p>Tips:</p>
                    <ul>
                        <li>Hover over the + button to add a new category</li>
                        <li>Click the pen icon to edit a card</li>
                        <li>Bookmark a category for quick access</li>
                        <li>Drag a flashcard or category to move it</li>
                        <li>The breadcrumb can also be clicked or dropped into</li>
                        <li>Click the graph icon on a category to take a quiz</li>
                        <li>Drag a tag out of the tag manager to add it to a flashcard</li>
                        <li>Create your own account for private flashcards</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}