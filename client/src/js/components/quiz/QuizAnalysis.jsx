import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Brush } from "recharts";

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
                    <ResponsiveContainer height={600} width="100%">
                        <AreaChart data={quizzes} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                            <defs>
                                <linearGradient id="colourScore" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#dc143c" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#dc143c" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                type="number"
                                dataKey={quiz => new Date(quiz.questions[0].timestamp).getTime()}
                                domain={["auto", Date.now()]}
                                tickFormatter={tick => new Date(tick).toLocaleDateString()}
                                tickLine={{ strokeWidth: 2 }}
                                tick={{ fontSize: 18 }}
                                tickMargin={8}
                                axisLine={{ strokeWidth: 3 }}
                            />
                            <YAxis
                                type="number"
                                tickLine={{ strokeWidth: 2 }}
                                tick={{ fontSize: 18 }}
                                tickMargin={8}
                                axisLine={{ strokeWidth: 3 }}
                            />
                            <Tooltip
                                labelFormatter={label => new Date(label).toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                                animationDuration={200}
                                contentStyle={{ border: "none", borderRadius: "0.4em", padding: "0.6em 0.7em", boxShadow: "0 5px 10px rgba(0, 0, 0, 0.2)" }}
                            />
                            <Area
                                type="monotone"
                                dataKey={quiz => quiz.questions.reduce((prev, question) => prev + question.correct, 0)}
                                stroke="#dc143c"
                                strokeWidth={4}
                                unit=" points"
                                dot={{ r: 6, fill: "white", fillOpacity: 1 }}
                                animationDuration={500}
                                fill="url(#colourScore)"
                            />
                            <Brush
                                dataKey={quiz => new Date(quiz.questions[0].timestamp).getTime()}
                                tickFormatter={tick => new Date(tick).toLocaleDateString()}
                                travellerWidth={10}
                                height={40}
                                y={558}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                }
            </div>
        </div>
    );
};
