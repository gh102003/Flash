import React from "react";

export const Section = props => {
    return <div className="section">
        <h2>{props.course.name} / {props.section.name}</h2>
    </div>;
};