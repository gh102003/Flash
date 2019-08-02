import React from "react";

import * as constants from "../../../constants";
import * as util from "../../../util";
import { LoadingIndicator } from "../../LoadingIndicator.jsx";
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
        return (
            <div className="tags">
                {
                    this.state.tags.map(tag =>
                        <Tag
                            key={tag.id}
                            id={tag.id}
                            name={tag.name}
                            colour={tag.colour}
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
                        {this.state.tags ? this.renderTags() : <LoadingIndicator />}
                        <AddTagForm afterSubmit={() => this.getDataFromServer()} />
                    </div>
                </div>
            </div>
        );
    }
}