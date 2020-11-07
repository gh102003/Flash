import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

import { QuizGraphPoint } from "./QuizGraphPoint.jsx";

import * as util from "../../util";

export const QuizAnalysis = props => {

    const location = useLocation();
    const params = useParams();

    const [quizzes, setQuizzes] = useState(null);

    useEffect(() => {
        util.authenticatedFetch(`quiz/quizzes/category/${params.categoryId}`)
            .then(res => res.json())
            .then(data => setQuizzes(data.quizzes));
    }, [location]);

    return (
        <div className="quiz-analysis">
            <div className="quiz-analysis-setup">
                <h2>Quiz Analysis</h2>
                {/* ... date slider, warning about inaccuracy due to category changes (if category not locked) ... */}
            </div>
            <div className="graph">
                {quizzes &&
                    <svg height="1000" width="1000" viewBox="0 0 1000 1000" className="scores-graph">
                        <rect x="0" y="0" height="1000" width="1000" fill="#cccccc"/>
                        {quizzes.map(quiz =>
                            <QuizGraphPoint
                                quiz={quiz}
                                dateRange={{
                                    min: new Date("2020-10-26T18:00:00Z"),
                                    max: new Date("2020-11-02T18:00:00Z"),
                                }}
                                scoreRange={{
                                    min: -5,
                                    max: 10
                                }}
                                key={quiz.id}
                            />
                        )}
                    </svg>
                }
            </div>
        </div>
    );
};
