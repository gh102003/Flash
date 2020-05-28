import React from "react";
import { NetworkIndicator } from "../NetworkIndicator.jsx";
import { Katex } from "../Katex.jsx";

export const Topic = props => {

    if (!props.topic) {
        return <NetworkIndicator />;
    }

    return <div className="topic">
        <h3><Katex>{props.topic.name}</Katex></h3>
        <p><Katex>{props.topic.description}</Katex></p>

        <h4>Links</h4>
        <ul>
            {props.topic.links && props.topic.links.map(link =>
                <li key={link.url}><a className="link" href={link.url}>{link.name}</a></li>
            )}
        </ul>
    </div>;
};