import React from "react";
import AutosizeInput from "react-input-autosize";

import { QuizTimer } from "./QuizTimer.jsx";
import { QuizFlashcard } from "./QuizFlashcard.jsx";

export class QuizMaster extends React.Component {
    constructor(props) {
        super(props);

        let currentIndex = Math.floor(Math.random() * this.props.flashcards.length);

        var questionSide, answerSide;
        if (this.props.flashcards.length > 0) {
            if (this.props.flashcards[currentIndex].is_reversible && Math.random() > 0.5) {
                [questionSide, answerSide] = ["back", "front"];
            } else {
                [questionSide, answerSide] = ["front", "back"];
            }
        }

        this.state = {
            score: 0,
            currentIndex,
            questionSide,
            answerSide,
            enteredAnswer: ""
        };
    }

    render() {
        if (this.props.flashcards.length > 0) {
            var currentFlashcard = this.props.flashcards[this.state.currentIndex];
        }

        return (
            <div className="quiz-master">
                <div className="quiz-stats">
                    <div className="quiz-stat">
                        Score
                        <div>
                            {this.state.score}
                        </div>
                    </div>
                    <div className="quiz-stat">
                        Time left
                        <QuizTimer length={60000} onFinish={() => this.setState({timerFinished: true})}/>
                    </div>
                </div>
                {
                    currentFlashcard &&
                    <QuizFlashcard text={currentFlashcard[this.state.questionSide]} colour={currentFlashcard.colour}/>
                }
                <div className="quiz-answer-entry">
                    <AutosizeInput
                        type="text"
                        value={this.state.enteredAnswer}
                        onChange={e => {
                            this.setState({enteredAnswer: e.target.value});

                            if (e.target.value === currentFlashcard[this.state.answerSide]) {
                                this.nextFlashcard(1);
                            }
                        }}
                        disabled={this.state.timerFinished ? "disabled": ""}
                        placeholder="Enter your answer"
                        placeholderIsMinWidth
                        autoComplete="off"
                    />
                    {!this.state.timerFinished &&
                        <button onClick={() => this.nextFlashcard(0)}>
                            Skip
                        </button>
                    }
                </div>
            </div>
        );
    }

    nextFlashcard(pointsFromLast) {
        this.setState(oldState => {
            let currentIndex = Math.floor(Math.random() * this.props.flashcards.length);

            var questionSide, answerSide;
            if (this.props.flashcards.length > 0) {
                if (this.props.flashcards[currentIndex].is_reversible && Math.random() > 0.5) {
                    [questionSide, answerSide] = ["back", "front"];
                } else {
                    [questionSide, answerSide] = ["front", "back"];
                }
            }

            return {
                score: oldState.score + pointsFromLast,
                currentIndex,
                questionSide,
                answerSide,
                enteredAnswer: ""
            };
        });
    }
}