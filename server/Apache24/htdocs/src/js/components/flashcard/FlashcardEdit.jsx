import React from "react";

export class FlashcardEdit extends React.Component {
    render() {
        return (
            <div className="card flashcard flashcard-edit" style={this.props.styles} onClick={(event) => event.stopPropagation()}>
                <div className="flashcard-button" onClick={(event) => {
                    event.stopPropagation();
                    this.props.saveEdit();
                }}>
                    <i className="material-icons" >done</i>
                </div>
                <input
                    type="text"
                    autoFocus
                    value={this.props.text}
                    onChange={(e) => this.props.handleEdit(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                        if (e.keyCode === 13) { // Enter
                            this.props.saveEdit();
                        }
                    }}
                />
            </div>
        );
    }
}