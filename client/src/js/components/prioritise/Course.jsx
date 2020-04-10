import React, { useState, useEffect } from "react";
import { CourseSection } from "./CourseSection.jsx";
import { NetworkIndicator } from "../NetworkIndicator.jsx";

import * as envConstants from "../../envConstants";

export const Course = props => {

    const [course, setCourse] = useState();
    useEffect(() => {
        fetch(`${envConstants.serverOrigin}/prioritise/courses/${props.courseId}`)
            .then(response => response.json())
            .then(setCourse);
    }, []);

    if (!course) {
        return <NetworkIndicator />;
    }
    
    return <div className="course">
        <div className="course-info">
            <h2>{course.title}</h2>
            <p className="subtitle">{course.subtitle}</p>
            <a className="link" href={course.specificationUrl} target="_blank" rel="noopener noreferrer">View Specification</a>
        </div>
        <div className="sections">
            {course.sections.map((section, index) => (
                <CourseSection key={index} section={section} course={course} />
            ))}
        </div>
    </div>;
};