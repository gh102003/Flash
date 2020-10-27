import React from "react";
import AutosizeInput from "react-input-autosize";

import { QuizTimer } from "./QuizTimer.jsx";
import { QuizFlashcard } from "./QuizFlashcard.jsx";
import { QuizSummary } from "./QuizSummary.jsx";
import * as util from "../../util";

const pointsForCorrectGuess = 2;
const pointsForWrongGuess = -1;
const pointsForSkip = -2;

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
            enteredAnswer: "",
            questions: [], // Array of objects like { flashcardIndex, correct: (t/f/n), timestamp }
            quizTime: 30000, // How many milliseconds the timer should start at
            timerState: "ready", // Either 'ready', 'running' or 'finished',
            quizId: null // set when quiz is created on the server, just after it has been started
        };
    }

    render() {
        let flashcardComponent;
        const currentFlashcard = this.props.flashcards[this.state.currentIndex];

        if (this.state.timerState === "ready") {
            if (this.props.flashcards.length <= 0) {
                flashcardComponent = (
                    <div className="quiz-empty">
                        No flashcards available
                    </div>
                );
            } else {
                flashcardComponent = (
                    <button
                        className="quiz-start-btn"
                        onClick={async () => {
                            this.setState({ timerState: "running" });

                            // Create quiz on the server
                            const response = await util.authenticatedFetch("quiz/quizzes", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    quiz: {
                                        source: {
                                            type: "Category",
                                            document: this.props.category.id
                                        }
                                    }
                                })
                            });

                            // TODO: delay timer start if the quiz id comes back late
                            const data = await response.json();
                            this.setState({ quizId: data.createdQuiz.id });
                        }}
                    >
                        Click to start
                    </button>
                );
            }
        } else if (this.state.timerState === "running") {
            flashcardComponent = (
                <QuizFlashcard
                    text={currentFlashcard[this.state.questionSide]}
                    colour={currentFlashcard.colour} />
            );
        } else if (this.state.timerState === "finished") {
            flashcardComponent =
                <QuizSummary
                    score={this.state.score}
                    time={this.state.quizTime}
                    questions={this.state.questions}
                    flashcards={this.props.flashcards}
                />;
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
                        <QuizTimer
                            length={this.state.quizTime}
                            onFinish={() => this.setState({ timerState: "finished" })}
                            running={this.state.timerState === "running"}
                        />
                    </div>
                </div>
                {flashcardComponent || null}
                {
                    (this.state.timerState === "running" && this.state.answerSide && this.state.quizId) &&
                    <div className="quiz-answer-entry">
                        <AutosizeInput
                            type="text"
                            value={this.state.enteredAnswer}
                            onChange={e => {
                                this.setState({ enteredAnswer: e.target.value });
                            }}
                            onKeyDown={e => {
                                if (this.state.enteredAnswer && e.keyCode === 13) { // Enter
                                    this.checkGuess();
                                }
                            }}
                            placeholder="Enter your answer"
                            placeholderIsMinWidth
                            autoComplete="off"
                            spellCheck="false"
                            autoCorrect="off"
                            autoCapitalize="off"
                            autoFocus
                        />
                        <button className="btn-guess" disabled={!this.state.enteredAnswer} onClick={() => this.checkGuess()}>
                            Guess
                        </button>
                        <button className="btn-skip" onClick={() => {
                            this.setState(prevState => ({
                                questions: [...prevState.questions, {
                                    flashcardIndex: this.state.currentIndex,
                                    correct: null,
                                    timestamp: Date.now()
                                }],
                                score: prevState.score + pointsForSkip
                            }));
                            this.nextFlashcard();
                        }}>
                            Skip
                        </button>
                    </div>
                }
            </div>
        );
    }

    checkGuess() {
        let correct;
        if (this.state.enteredAnswer.toUpperCase() === this.props.flashcards[this.state.currentIndex][this.state.answerSide].toUpperCase()) {
            correct = true;
            this.nextFlashcard();
        } else {
            correct = false;
        }
        this.setState(prevState => ({
            questions: [...prevState.questions, {
                flashcardIndex: this.state.currentIndex,
                questionSide: this.state.questionSide,
                correct,
                timestamp: Date.now()
            }],
            score: prevState.score + (correct ? pointsForCorrectGuess : pointsForWrongGuess)
        }));
        this.saveQuizQuestion(correct);
    }

    saveQuizQuestion(correct) {
        util.authenticatedFetch("quiz/quizQuestions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                quizQuestion: {
                    quiz: this.state.quizId,
                    timestamp: Date.now(),
                    correct,
                    flashcard: this.props.flashcards[this.state.currentIndex].id,
                    questionSide: this.state.questionSide
                }
            })
        });
    }

    nextFlashcard() {
        this.setState(oldState => {
            let currentIndex;
            do {
                currentIndex = Math.floor(Math.random() * this.props.flashcards.length);
            } while (
                this.props.flashcards.length > 1
                && currentIndex === oldState.currentIndex
            );

            let questionSide, answerSide;
            if (this.props.flashcards.length > 0) {
                if (this.props.flashcards[currentIndex].is_reversible && Math.random() > 0.5) {
                    [questionSide, answerSide] = ["back", "front"];
                } else {
                    [questionSide, answerSide] = ["front", "back"];
                }
            }

            return {
                currentIndex,
                questionSide,
                answerSide,
                enteredAnswer: ""
            };
        });
    }
}