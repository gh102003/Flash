import React from "react";
import { useHistory } from "react-router";

import { getColourForRating } from "../../util";

export const CourseSection = props => {

    const history = useHistory();

    // Calculate average rating of all topics
    const ratedTopics = props.section.topics
        .filter(topic => typeof topic.rating === "number"); // Remove topics with no rating
    const average = ratedTopics.length > 0 ? ratedTopics.reduce((prev, current) => prev + current.rating, 0) / ratedTopics.length : null;

    return <div className="course-section" tabIndex="0" onClick={() => history.push(`/prioritise/course/${props.course.id}/section/${props.section.id}`)}>
        <h3>{props.section.name}</h3>
        <span className="rating" title="Average of all topics" style={{ backgroundColor: getColourForRating(average) }}></span>
        {props.section.topics && props.section.topics.length > 0 && <>
            <h4>Topics</h4>
            <ul className="topics-list">
                {props.section.topics.map((topic, index) => (
                    <li key={index}>{topic.name}</li>
                ))}
            </ul>
        </>}
    </div>;
};