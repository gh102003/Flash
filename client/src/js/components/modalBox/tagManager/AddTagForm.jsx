import React from "react";
import { TwitterPicker } from "react-color";

import * as constants from "../../../constants";
import * as envConstants from "../../../envConstants";

import * as util from "../../../util";

export class AddTagForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tag: {
                name: "",
                colour: constants.categoryColours[0]
            },
            editDialog: null
        };
    }

    handleSubmit(event) {
        event.preventDefault();

        // Send to server
        fetch(`${envConstants.serverOrigin}/tags/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                tag: {
                    name: this.state.tag.name,
                    colour: util.colourToInteger(this.state.tag.colour)
                }
            })
        }).then(() => {
            // Clear form
            this.setState({
                tag: {
                    name: "",
                    colour: constants.categoryColours[0]
                }
            });

            // Refresh from server
            this.props.afterSubmit();
        });
    }

    render() {
        let enableSubmit = true;
        if (!this.state.tag.name) enableSubmit = false;
        if (!this.state.tag.colour) enableSubmit = false;

        return (
            <form className="add-tag-form" onSubmit={event => this.handleSubmit(event)}>
                <p className="usernames-visible-to">Everyone will be able to see and delete this tag</p>
                <input
                    type="text"
                    placeholder="Create a new tag"
                    name=""
                    size="5"
                    value={this.state.tag.name}
                    onChange={event => {
                        let newName = event.target.value;
                        return this.setState(oldState => ({
                            tag: {
                                ...oldState.tag,
                                name: newName
                            }
                        }));
                    }}
                />

                <div style={{ display: "inline-block", position: "relative" }}>
                    <button type="button" onClick={event => {
                        event.preventDefault();
                        this.setState(oldState => ({ editDialog: oldState.editDialog === "colour" ? null : "colour" }));
                    }}>
                        Choose colour
                        <div className="colour-preview" style={{ backgroundColor: this.state.tag.colour }}></div>
                    </button>
                    {
                        this.state.editDialog === "colour" &&
                        <div className="edit-dialog edit-dialog-colour">
                            <TwitterPicker
                                width={240}
                                triangle="top-right"
                                color={this.state.tag.colour}
                                colors={constants.categoryColours}
                                onChange={colour => {
                                    this.setState(oldState => ({
                                        tag: {
                                            ...oldState.tag,
                                            colour: colour.hex
                                        }
                                    }));
                                }}
                                onChangeComplete={() => this.setState({ editDialog: null })}
                            />
                        </div>

                    }
                </div>

                <input type="submit" value="Add" disabled={!enableSubmit} />
            </form>
        );
    }
}