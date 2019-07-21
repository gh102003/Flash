import React from "react";
import {version} from "../../constants";

export function TagManager(props) {
    return (
        <div className="modal-background" onClick={props.handleClose}>
            <div className="modal tag-manager" onClick={event => event.stopPropagation()}>
                <div className="modal-header">
                    <h2>Tag Manager</h2>
                    <i className="material-icons button-close" onClick={props.handleClose}>close</i>
                </div>
                <div className="modal-body">
                    
                </div>
            </div>
        </div>
    );
}