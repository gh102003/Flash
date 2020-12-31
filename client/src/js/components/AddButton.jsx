import React, { useState, useCallback } from "react";
import { useSpring, useSprings, animated } from "react-spring";

export const AddButton = props => {
    const [activated, setActivated] = useState(false);

    const deactivate = useCallback(() => {
        console.log("deactivate");
        setSprings(i => ({ opacity: 0, transform: "translateY(2em) scale(0.9)", delay: (addButtons.length - 1 - i) * 50 }));
        setActivated(false);
    });

    const addButtons = [
        <div key="0" className="add-flashcard-button" onClick={() => {
            deactivate();
            props.handleClick("addCard");
        }}>
            <i className="material-icons">article</i>Add Flashcard
        </div>,
        <div key="1" className="add-subcategory-button" onClick={() => {
            deactivate();
            props.handleClick("addCategory");
        }}>
            <i className="material-icons">folder</i>Add Category
        </div>
    ];

    const backgroundProps = useSpring({
        opacity: activated ? 1 : 0,
        config: { tension: 250, friction: 26, clamp: true }
    });

    const [springs, setSprings] = useSprings(addButtons.length, _ => ({
        opacity: 0,
        transform: "translateY(2em) scale(0.9)",
        transformOrigin: "bottom left",
        config: { tension: 250, friction: 26, clamp: true }
    }));

    return (
        <div className={activated ? "add-wrapper add-wrapper-activated" : "add-wrapper"}>
            <div className="add-card-button" onClick={() => {
                if (activated) {
                    setSprings(i => ({ opacity: 0, transform: "translateY(2em) scale(0.9)", delay: (addButtons.length - 1 - i) * 50 }));
                } else {
                    setSprings(i => ({ opacity: 1, transform: "translateY(0em) scale(1)", delay: i * 50 }));
                }

                setActivated(!activated);
            }}>
                +
            </div>
            <animated.div
                className="add-buttons-background"
                onClick={deactivate}
                style={{
                    ...backgroundProps,
                    visibility: backgroundProps.opacity.interpolate(o => o === 0 ? "hidden" : "visible")
                }} />
            <div className="add-buttons">
                {springs.map((props, index) =>
                    <animated.div key={addButtons[index].key} style={props}>
                        {addButtons[index]}
                    </animated.div>
                )}
            </div>
        </div>
    );
};
