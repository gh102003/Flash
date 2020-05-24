import React from "react";
import { animated } from "react-spring";

export const MathsFormattingHint = props => {
    return (
        <animated.div style={props.style} className="hint maths-formatting-hint">
            Entering an equation? Type it between two backticks (`) to use&nbsp;
            <a className="link" href="https://en.wikibooks.org/wiki/LaTeX/Mathematics#Symbols" target="_blank" rel="noopener noreferrer">LaTeX formatting</a>.
        </animated.div>
    );
};
