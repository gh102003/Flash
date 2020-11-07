import React from "react";

export const QuizGraphPoint = ({ quiz, dateRange, scoreRange }) => {

    const score = quiz.questions.reduce((prev, question) => prev + question.correct, 0);

    console.log(score);

    // FIXME: remove this component and generate a list of points instead - this makes it easier to repeat them, e.g. in a polyline
    const xPos = (new Date(quiz.questions[0].timestamp) - dateRange.min) / (dateRange.max - dateRange.min); // in fraction of time
    const yPos = (score - scoreRange.min) / (scoreRange.max - scoreRange.min); // in fraction of score

    return (
        <ellipse cx={xPos * 1000} cy={yPos * 1000} rx="10" ry="10" fill="red"/>
    );
};
