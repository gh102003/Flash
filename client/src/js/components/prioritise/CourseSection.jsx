import React from "react";
import { Link, useHistory } from "react-router-dom";

import { getColourForRating } from "../../util";

export const CourseSection = props => {

    const history = useHistory();

    // Calculate average rating of all topics
    const ratedTopics = !props.section.topics ? [] : props.section.topics
        .filter(topic => typeof topic.rating === "number"); // Remove topics with no rating
    const average = ratedTopics.length > 0 ? ratedTopics.reduce((prev, current) => prev + current.rating, 0) / ratedTopics.length : null;

    return <Link className="course-section" to={`/prioritise/course/${props.course.id}/section/${props.section.id}`}>
        <h3>{props.section.name}</h3>
        <span className="rating" title="Average of topics" style={{ backgroundColor: getColourForRating(average) }}></span>
        {props.section.topics && props.section.topics.length > 0 && <>
            <h4>Topics</h4>
            <ul className="topics-list">
                {props.section.topics.map((topic, index) => (
                    <li key={index}>{topic.name}</li>
                ))}
            </ul>
        </>}
    </Link>;
};