import React from "react";
import { CourseSection } from "./CourseSection.jsx";

export const Course = props => {

    return <div className="course">
        <div className="course-info">
            <h2>{props.course.title}</h2>
            <p className="subtitle">{props.course.subtitle}</p>
            <a className="link" href={props.course.specificationUrl} target="_blank" rel="noopener noreferrer">View Specification</a>
        </div>
        <div className="sections">
            {props.course.sections.map((section, index) => (
                <CourseSection key={index} section={section} course={props.course} />
            ))}
        </div>
    </div>;
};