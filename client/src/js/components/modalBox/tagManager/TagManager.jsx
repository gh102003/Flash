import React from "react";

import * as constants from "../../../constants";
import { NetworkIndicator } from "../../NetworkIndicator.jsx";
import { AddTagForm } from "./AddTagForm.jsx";
import { Tag } from "./Tag.jsx";

export class TagManager extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tags: null,
            editDialog: null,
            draggingTag: false
        };
    }

    componentDidMount() {
        this.getDataFromServer();
    }

    getDataFromServer() {
        fetch(`${constants.serverOrigin}/tags`, {
            method: "GET"
        })
            .then(data => data.json())
            .then(data => {
                this.setState({ tags: data.tags });
            });
    }

    renderTags() {
        // If the list of tags is empty
        if (this.state.tags.length < 1) {
            return (<div className="tags">No tags have been created yet</div>);
        }

        return (
            <div className="tags">
                {
                    this.state.tags.map(tag =>
                        <Tag
                            key={tag.id}
                            id={tag.id}
                            name={tag.name}
                            colour={tag.colour}
                            handleQuizButtonClicked={this.props.handleClose}
                            handleDelete={() => {
                                fetch(`${constants.serverOrigin}/tags/${tag.id}`, {
                                    method: "DELETE"
                                }).then(() => this.getDataFromServer());
                            }}
                            onBeginDrag={() => {
                                setTimeout(() => this.setState({ draggingTag: true }), 200); // delay needed before background set to invisible
                            }}
                            onEndDrag={() => this.setState({ draggingTag: false })}
                        />)
                }
            </div>
        );
    }

    render() {
        let className = "modal-background";
        if (this.state.draggingTag) {
            className += " drop-through";
        }

        return (
            <div className={className} onClick={this.props.handleClose}>
                <div className="modal tag-manager" onClick={event => event.stopPropagation()}>
                    <div className="modal-header">
                        <h2>Tag Manager</h2>
                        <i className="material-icons button-close" onClick={this.props.handleClose}>close</i>
                    </div>
                    <div className="modal-body">
                        Here are all of the tags you have created. To add one to a card, 
                        drag it out of this box. Or, you can test yourself with a short quiz.
                        {this.state.tags !== null ? this.renderTags() : <NetworkIndicator />}
                        <AddTagForm afterSubmit={() => this.getDataFromServer()} />
                    </div>
                </div>
            </div>
        );
    }
}