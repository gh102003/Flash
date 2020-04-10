import React, { useState, useEffect } from "react";
import { Link, NavLink, Switch, Route, useRouteMatch, useParams, useLocation } from "react-router-dom";
import { useTransition, animated, config } from "react-spring";

import { Topic } from "./Topic.jsx";
import { NetworkIndicator } from "../NetworkIndicator.jsx";
import * as envConstants from "../../envConstants";

export const Section = props => {

    const { path, url } = useRouteMatch();
    const params = useParams();

    const [section, setSection] = useState([]);
    useEffect(() => {
        fetch(`${envConstants.serverOrigin}/prioritise/sections/${props.sectionId}`)
            .then(response => response.json())
            .then(response => setSection(response));
    }, []);

    const currentLocation = useLocation();
    const transitions = useTransition(currentLocation, location => location.pathname, {
        from: { opacity: 0, transform: "translateY(-100%)" },
        enter: { opacity: 1, transform: "translateY(0%)" },
        leave: { opacity: 0, transform: "translateY(100%)" }
    });

    if (!props.course || !props.sectionId) {
        return <NetworkIndicator />;
    }

    return <div className="section">
        <div className="section-title">
            <h2>
                <Link to={`/prioritise/course/${props.course.id}`}>{props.course.title}</Link>
                {section.name && " / " + section.name}
            </h2>
        </div>
        <div className="topics">
            {section.topics && section.topics.map(topic => (
                <NavLink to={`${url}/topic/${topic.id}`} key={topic.id} className="section-topic" activeClassName="section-topic-active">
                    <h3>{topic.name}</h3>
                </NavLink>
            ))}
        </div>
        <div className="topic-switcher">
            {transitions.map(({ item: location, props, key }) =>
                <animated.div className="topic-wrapper" key={key} style={props}>
                    <Switch location={location}>
                        <Route path={path + "/topic/:topicId"} render={({ match }) =>
                            <Topic topic={section.topics && section.topics.filter(topic => topic.id === match.params.topicId)[0]} />
                        } />
                    </Switch>
                </animated.div>
            )}
        </div>

    </div>;
};