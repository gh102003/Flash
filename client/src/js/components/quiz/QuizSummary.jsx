import React, { useMemo, useCallback } from "react";
import "../../../css/quiz-summary.scss";

export const QuizSummary = props => {

    /**
     * @param questions an array of questions like `props.questions`;
     * use filter to pick the questions to count
     * 
     * @returns an object with flashcard indexes (of `props.flashcards`)
     * as keys and integers as values, corresponding the number of times
     * the flashcard was in the questions parameter.
     * 
     * @remarks
     * Cached function with `useCallback` that can be called later
     * (in `return`) without causing a rerender on every update
     */
    const countFlashcardsInQuestions = useCallback(questions => {
        const flashcards = {};
        questions.forEach(q => {
            flashcards[q.flashcardIndex] = (flashcards[q.flashcardIndex] || 0) + 1;
        });
        return flashcards;
    }, [props.questions]);

    const incorrectFlashcards = countFlashcardsInQuestions(props.questions.filter(q => q.correct === false));

    // Create an array of objects like {flashcardIndex, correct: number, incorrect: number, skipped: number}
    const flashcardPerformance = props.flashcards.map(flashcard => ({
        flashcardIndex: flashcard.index,
        correct: 0,
        incorrect: 0,
        skipped: 0
    }));

    props.questions.forEach(question => {
        flashcardPerformance
    });

    return (
        <div className="quiz-summary">
            <h3>Summary</h3>
            <p>Score: {props.score}</p>
            <p>Time: {props.time / 1000} seconds</p>
            <p>Average speed: {props.score / (props.time / 60000)} per minute</p>
            <p>Correct: {props.questions.filter(q => q.correct).length}</p>
            <p>Wrong: {props.questions.filter(q => q.correct === false).length}</p>
            <p>Skipped: {props.questions.filter(q => q.correct === null).length}</p>
            <p>Ones to practise:</p>
            <ul>
                {
                    Object.entries(incorrectFlashcards)
                        .filter(([flashcardIndex, timesIncorrect]) => timesIncorrect >= 2)
                        .sort((a, b) => b[1] - a[1])
                        .map(([flashcardIndex, timesIncorrect]) =>
                            <li key={flashcardIndex}>
                                <p>{props.flashcards[flashcardIndex].front}</p>
                                <p>{props.flashcards[flashcardIndex].back}</p>
                                <p>(wrong {timesIncorrect} times)</p>
                            </li>
                        )
                }
            </ul>
            {/* <p>Questions:</p> */}
            {/* <ul style={{ fontSize: "0.7em" }}>
                {props.questions.map(question =>
                    <li key={question.timestamp}>{JSON.stringify(question)}</li>
                )}
            </ul> */}
        </div>
    );
};