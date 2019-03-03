import React from "react";
import * as util from "../util";

export class Flashcard extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.isReversible && Math.random() > 0.5) {
            this.state = { side: "back" };
        }
        else {
            this.state = { side: "front" };
        }
        this.state.view = "normal";
    }
    _flip() {
        if (this.state.side === "front") {
            this.setState({ side: "back" });
        }
        else if (this.state.side === "back") {
            this.setState({ side: "front" });
        }
    }
    render() {
        let className = `card flashcard flashcard-${this.state.view} `;
        if (this.state.side === "back") {
            className += " flashcard-flipped"; // Currently unused, TODO: review
        }
        let backgroundColor = util.colourFromInteger(this.props.colour);
        let color = util.contrastingColourFromInteger(this.props.colour);
        let text = this.props[this.state.side];
        if (this.state.view === "modal") {
            return (<div className="modal-background" onClick={() => this.setState({ view: "normal" })}>
                <div className={className} style={{ backgroundColor, color }} onClick={(event) => {
                    event.stopPropagation(); // Prevent parent from recieving click
                    return this._flip();
                }}>
                    {text}
                    <div className="flashcard-button" onClick={(event) => {
                        event.stopPropagation();
                        return this.setState({ view: "normal" });
                    }}>
                        <i className="material-icons">close</i>
                    </div>
                </div>
            </div>);
        }
        else {
            return (<div className={className} style={{ backgroundColor, color }} onClick={(event) => {
                event.stopPropagation();
                return this._flip();
            }}>
                {text}
                <div className="flashcard-button">
                    <i className="material-icons">edit</i>
                </div>
                <div className="flashcard-button" onClick={(event) => {
                    event.stopPropagation();
                    return this.setState({ view: "modal" });
                }}>
                    <i className="material-icons">zoom_out_map</i>
                </div>
            </div>);
        }
    }
}
