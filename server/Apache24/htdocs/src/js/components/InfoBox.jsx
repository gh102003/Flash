import React from "react";
import {version} from "../constants.js";

export function InfoBox(props) {
    return (
        <div className="modal-background" onClick={() => props.handleClose()}>
            <div className="info-box" onClick={(event) => event.stopPropagation()}>
                <div className="info-box-header">
                    <h2>Flash v{version}</h2>
                    by George Howarth
                    <i className="material-icons button-close" onClick={() => props.handleClose()}>close</i>
                </div>
                <div className="info-box-body">
                    <p>Create, manage and practise with your own flashcards!</p>
                    <p>Tips:</p>
                    <ul>
                        <li>Hover over the + button to add a new category</li>
                        <li>Click the pen icon to edit a card</li>
                        <li>Bookmark a category for quick access</li>
                        <li>Drag a flashcard or category to move it</li>
                        <li>The breadcrumb can also be clicked or dropped into</li>
                        <li>Click the graph icon on a category to take a quiz</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}