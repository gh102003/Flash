import React from "react";
import AutosizeInput from "react-input-autosize";

export class FlashcardEdit extends React.Component {
    render() {
        return (
            <div className="card flashcard card-edit" style={this.props.styles} onClick={(event) => event.stopPropagation()}>
                <div className="flashcard-button" onClick={event => {
                    event.stopPropagation();
                    this.props.handleSaveEdit();
                }}>
                    <i className="material-icons" >done</i>
                </div>
                <div className="flashcard-button" onClick={event => {
                    event.stopPropagation();
                    this.props.handleDelete();
                }}>
                    <i className="material-icons" >delete</i>
                </div>
                <AutosizeInput
                    type="text"
                    autoFocus
                    value={this.props.text}
                    minWidth="80"
                    style={{borderBottom: `2px solid ${this.props.styles.color.replace("1)", "0.6)")}`}} // Transparent version of text colour
                    onChange={(e) => this.props.handleEdit(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                        if (e.keyCode === 13) { // Enter
                            this.props.handleSaveEdit();
                        }
                    }}
                />
            </div>
        );
    }
}