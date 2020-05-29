import React from "react";
import { Link } from "react-router-dom";

import { getColourForRating } from "../../util";

export const CourseSection = props => {

    const maxTopicLines = 5;
    
    let topicLines = Math.min(props.section.topics.length, maxTopicLines);
    // Consider 'and xx more' at the bottom by taking a line away so maxTopicLines is always the max number of bullet points
    if (topicLines > props.section.topics.length) {
        topicLines--;
    }
    const topicLinesHidden = props.section.topics.length - topicLines;

    // Calculate average rating of all topics
    const ratedTopics = (props.section.topics || [])
        .filter(topic => typeof topic.rating === "number"); // Remove topics with no rating

    const average = ratedTopics.length > 0 ? ratedTopics.reduce((prev, current) => prev + current.rating, 0) / ratedTopics.length : null;

    return <Link className="course-section" to={`/prioritise/course/${props.course.id}/section/${props.section.id}`}>
        <h3>{props.section.name}</h3>
        <span className="rating rating-disabled" title="Average of topics" style={{ backgroundColor: getColourForRating(average) }}></span>
        {props.section.topics && props.section.topics.length > 0 && <>
            <h4>Topics</h4>
            <ul className="topics-list">
                {props.section.topics.slice(0, topicLines).map((topic, index) => (
                    <li key={index}>{topic.name}</li>
                ))}
                {topicLinesHidden > 0 &&
                    <li className="topic-lines-hidden">And {topicLinesHidden} more...</li>
                }
            </ul>
        </>}
    </Link>;
};