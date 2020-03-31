import React from "react";

export const ToggleDarkTheme = props => {
    return (
        <a className="toggle-dark-theme-icon" href="" title={props.theme === "dark" ? "Switch to light theme" : "Switch to dark theme"} onClick={event => {
            event.preventDefault();
            props.setTheme(props.theme === "dark" ? "light" : "dark");
        }}>
            <i className="material-icons">{props.theme === "dark" ? "brightness_3" : "brightness_7"}</i>
        </a>
    );
};