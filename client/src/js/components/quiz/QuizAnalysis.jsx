import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

import * as util from "../../util";

export const QuizAnalysis = props => {

    const location = useLocation();
    const params = useParams();

    const [quizzes, setQuizzes] = useState(null);

    useEffect(() => {
        util.authenticatedFetch(`quiz/quizzes/category/${params.categoryId}`)
            .then(res => res.json())
            .then(data => data.quizzes)
            //     // prepare quizzes by calculating score
            //     data.quizzes.map(quiz => (
            //         {
            //             ...quiz,
            //             score: quiz.questions.reduce((prev, question) => prev + question.correct, 0)
            //         }
            //     ))
            // )
            .then(setQuizzes);
    }, [location]);

    return (
        <div className="quiz-analysis">
            <div className="quiz-analysis-setup">
                <h2>Quiz Analysis</h2>
                {/* ... date slider, warning about inaccuracy due to category changes (if category not locked) ... */}
            </div>
            <div className="scores-graph">
                {quizzes &&
                    <ResponsiveContainer height={400} width="100%">
                        <LineChart /*width={400}*/ data={quizzes}>
                            <XAxis
                                type="number"
                                dataKey={quiz => new Date(quiz.questions[0].timestamp).getTime()}
                                domain={["auto", Date.now()]}
                                tickFormatter={tick => new Date(tick).toLocaleDateString()}
                            />
                            <YAxis
                                type="number"
                            />
                            <Tooltip
                                labelFormatter={label => new Date(label).toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                                animationDuration={300}
                            />
                            <Line
                                type="monotone"
                                dataKey={quiz => quiz.questions.reduce((prev, question) => prev + question.correct, 0)}
                                stroke="#dc143c"
                                strokeWidth={3}
                                unit=" points"
                                dot={{ r: 5 }}
                                animationDuration={500}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                }
            </div>
        </div>
    );
};
