import React, { useEffect, useRef } from "react";
import katex from "katex";
import renderMathInElement from "katex-auto-render";

export const Katex = props => {

    const domRef = useRef(null);

    useEffect(() => {
        domRef.current && renderMathInElement(domRef.current, {
            delimiters: [
                { left: "`", right: "`", display: false },
            ],
            throwOnError: false,
            errorColor: props.errorColour || "#aa0000"
        });
    }, [props.children]);

    return (
        <span className="text-with-katex" ref={domRef}>{props.children}</span>
    );
};
