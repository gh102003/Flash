import React, { useState, useEffect, useContext } from "react";
import { Route, useHistory, useRouteMatch, Switch } from "react-router";

import "../../../css/prioritise.scss";
import * as envConstants from "../../envConstants";
import { UserContext } from "../../contexts/UserContext";
import { Course } from "./Course.jsx";
import { Section } from "./Section.jsx";
import { NetworkIndicator } from "../NetworkIndicator.jsx";
import { LoginPrompt } from "../LoginPrompt.jsx";

export const Prioritise = props => {

    const history = useHistory();
    const { path, url } = useRouteMatch();

    const userContext = useContext(UserContext);
    const [showLoginPrompt, setShowLoginPrompt] = useState(!userContext.currentUser);

    const [courses, setCourses] = useState([]);
    useEffect(() => {
        fetch(`${envConstants.serverOrigin}/prioritise/courses`)
            .then(response => response.json())
            .then(response => setCourses(response.courses));
    }, []);

    return <div className="prioritise">
        {showLoginPrompt &&
            <LoginPrompt handleClose={() => setShowLoginPrompt(false)}>
                To mark topics with priorities, you need to be logged in to a Flash account. Without an account,
                you&apos;ll only be able to look at the topics.
            </LoginPrompt>
        }
        <Switch>
            <Route path={path + "/course/:courseId"} exact render={({ match }) => (
                <Course courseId={match.params.courseId} />
            )} />
            <Route path={path + "/course/:courseId/section/:sectionId"} render={({ match }) => {
                const course = courses.filter(course => course.id === match.params.courseId)[0];
                return <Section course={course} sectionId={match.params.sectionId} />;
            }} />
            <Route>
                <div className="courses">
                    {courses.length > 0 ? <>
                        {courses.map((course, index) => (
                            <div key={index} tabIndex="0" className="course-card" onClick={() => history.push(`/prioritise/course/${course.id}`)}>
                                <img src={course.imageUrl} />
                                <div className="course-info">
                                    <h3>{course.title}</h3>
                                    <p>{course.subtitle}</p>
                                    <a className="link" href={course.specificationUrl} target="_blank" rel="noopener noreferrer">View Specification</a>
                                </div>
                            </div>
                        ))}
                        <div className="coming-soon">
                            <p>
                                More courses coming soon!
                            </p>
                        </div>
                    </> : <NetworkIndicator />
                    }
                </div>
            </Route>
        </Switch>
    </div>;

};