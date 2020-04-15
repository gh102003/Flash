import React, { useState, useEffect } from "react";
import { Route, useHistory, useRouteMatch, Switch } from "react-router";

import "../../../css/prioritise.scss";
import * as envConstants from "../../envConstants";
import { Course } from "./Course.jsx";
import { Section } from "./Section.jsx";
import { NetworkIndicator } from "../NetworkIndicator.jsx";

/*
let courses = [
    {
        title: "Chemistry",
        subtitle: "AQA 9-1 GCSE Chemistry",
        id: "438qu4j",
        image: "https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
        specificationUrl: "https://www.aqa.org.uk/subjects/science/gcse/chemistry-8462",
        sections: [
            {
                name: "1: Periodic Table",
                id: "4i342394",
                topics: []
            },
            {
                name: "2: Structure and Bonding",
                id: "4i33o4k234",
                topics: [
                    {
                        id: "434i23krewr",
                        name: "Covalent Bonding",
                        description: "How atoms share electrons",
                        linkedCategory: "545554sadsd4sad4s4das5d45",
                        links: [
                            { name: "Physics and Maths Tutor", url: "physicsandmathstutor.com/jfdjsfijdsfji" },
                            { name: "BBC Bitesize", url: "bbc.co.uk/bitesize" }
                        ],
                        rating: 2
                    }
                ]
            },
            {
                id: "5e8f069d1c9d440000f11804",
                name: "6: Rate and Extent of Chemical Change",
                course: "5e8f069d1c9d440000f117ff",
                // calculate average rating of all topics
                topics: [
                    {
                        id: "434i2fdsfewr",
                        name: "Rate of Reaction",
                        description: "The amount of reactant used or product formed in a certain unit of time, like g/s, cm3/s and mol/s",
                        linkedCategory: "545554sadsd4sad4s4das5d45",
                        links: [
                            { name: "Physics and Maths Tutor", url: "physicsandmathstutor.com/jfdjsfijdsfji" },
                            { name: "BBC Bitesize", url: "bbc.co.uk/bitesize" }
                        ],
                        rating: 1 // Displayed as a coloured dot; provided by server in an /api/priorities GET request; null for unrated
                    },
                    {
                        id: "434i324krewr",
                        name: "Calulate Rate from Tangent",
                        description: "Draw a tangent and calculate the gradient of it using units like g/s, cm3/s and mol/s",
                        linkedCategory: "545554sadsd4sad4s4das5d45",
                        links: [
                            { name: "Physics and Maths Tutor", url: "physicsandmathstutor.com/jfdjsfijdsfji" },
                            { name: "BBC Bitesize", url: "bbc.co.uk/bitesize" }
                        ],
                        rating: 2 // Displayed as a coloured dot; provided by server in an /api/priorities GET request
                    }
                ]
            },
            {
                name: "7: Organic Chemistry",
                id: "4i3443294id4",
                topics: []
            }


        ]
    },
    {
        title: "Biology",
        subtitle: "AQA 9-1 GCSE Biology",
        id: "5434534",
        image: "https://images.pexels.com/photos/1059161/pexels-photo-1059161.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
        specificationUrl: "https://www.aqa.org.uk/subjects/science/gcse/biology-8461",
        sections: [
            {
                name: "Paper 1",
                sections: [
                    {
                        name: "1: Periodic Table",
                        topics: []
                    }
                ]
            },
            {
                name: "Paper 2",
                sections: [
                    {
                        name: "6: Rate and Extent of Chemical Change",
                        topics: [
                            {
                                name: "Rate of Reaction",
                                description: "The amount of reactant used or product formed in a certain unit of time, like g/s, cm3/s and mol/s",
                                linkedCategory: "545554sadsd4sad4s4das5d45",
                                links: [
                                    { name: "Physics and Maths Tutor", url: "physicsandmathstutor.com/jfdjsfijdsfji" },
                                    { name: "BBC Bitesize", url: "bbc.co.uk/bitesize" }
                                ],
                                rating: 1 // Displayed as a coloured dot; provided by server in an /api/priorities GET request
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        title: "Physics",
        subtitle: "AQA 9-1 GCSE Physics",
        id: "54dxf9",
        image: "https://images.pexels.com/photos/68173/flash-tesla-coil-experiment-faradayscher-cage-68173.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
        specificationUrl: "https://www.aqa.org.uk/subjects/science/gcse/physics-8463",
        sections: [
            {
                name: "Paper 1",
                sections: [
                    {
                        name: "1: Periodic Table",
                        topics: []
                    },
                    {
                        name: "2: Structure and Bonding",
                        topics: []
                    }
                ]
            },
            {
                name: "Paper 2",
                sections: [
                    {
                        name: "6: Rate and Extent of Chemical Change",
                        topics: [
                            {
                                name: "Rate of Reaction",
                                description: "The amount of reactant used or product formed in a certain unit of time, like g/s, cm3/s and mol/s",
                                linkedCategory: "545554sadsd4sad4s4das5d45",
                                links: [
                                    { name: "Physics and Maths Tutor", url: "physicsandmathstutor.com/jfdjsfijdsfji" },
                                    { name: "BBC Bitesize", url: "bbc.co.uk/bitesize" }
                                ],
                                rating: 1 // Displayed as a coloured dot; provided by server in an /api/priorities GET request
                            }
                        ]
                    }
                ]
            }
        ]
    }
];

courses = [...courses, ...courses, ...courses];*/

export const Prioritise = props => {

    const history = useHistory();
    const { path, url } = useRouteMatch();

    const [courses, setCourses] = useState([]);
    useEffect(() => {
        fetch(`${envConstants.serverOrigin}/prioritise/courses`)
            .then(response => response.json())
            .then(response => setCourses(response.courses));
    }, []);

    return <div className="prioritise">
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