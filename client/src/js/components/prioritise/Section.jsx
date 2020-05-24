import React, { useState, useEffect, useContext } from "react";
import { Link, NavLink, Switch, Route, useRouteMatch, useLocation } from "react-router-dom";
import { useTransition, animated } from "react-spring";

import { Katex } from "../Katex.jsx";
import { Topic } from "./Topic.jsx";
import { UserContext } from "../../contexts/UserContext";
import { NetworkIndicator } from "../NetworkIndicator.jsx";
import { authenticatedFetch, getColourForRating } from "../../util";

export const Section = props => {

    const userContext = useContext(UserContext);
    const { path, url } = useRouteMatch();

    const [section, setSection] = useState([]);
    useEffect(() => {
        authenticatedFetch(`prioritise/sections/${props.sectionId}`)
            .then(response => response.json())
            .then(response => setSection(response));
    }, []);

    // React Spring manages passing location(s) to the Route
    const currentLocation = useLocation();
    const transitions = useTransition(currentLocation, location => location.pathname, {
        from: { opacity: 0, transform: "translateY(-50%) scale(0.8)" },
        enter: { opacity: 1, transform: "translateY(0%) scale(1)" },
        leave: { opacity: 0, transform: "translateY(50%) scale(0.8)" },
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
            {section.topics && section.topics.map((topic, index) => (
                <NavLink
                    to={`${url}/topic/${topic.id}`}
                    key={topic.id}
                    className="section-topic"
                    activeClassName="section-topic-active"
                >
                    <h3>{topic.name}</h3>
                    <div
                        className={userContext.currentUser ? "rating" : "rating rating-disabled"}
                        style={{ backgroundColor: getColourForRating(topic.rating) }}
                        title={userContext.currentUser ? "Click to rate" : "Login to rate"}
                        onClick={async event => {
                            event.preventDefault();

                            if (!userContext.currentUser) {
                                return;
                            }

                            const newRating = topic.rating !== null ? (topic.rating + 1) % 3 : 0;
                            // Update on client
                            setSection({
                                ...section,
                                topics: Object.assign([...section.topics], {
                                    [index]: { ...topic, rating: newRating }
                                })
                            });
                            // Update on server
                            const res = await authenticatedFetch(`prioritise/topics/${topic.id}/rating`, {
                                method: "PATCH",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({ rating: newRating })
                            });
                        }}
                    />

                    <p><Katex>{topic.description}</Katex></p>
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