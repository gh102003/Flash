import React, { useRef } from "react";
import { useHistory } from "react-router-dom";

import "../../../css/mode-selector.scss";
import { Mode } from "./Mode.jsx";

export const ModeSelector = () => {
    return (
        <div className="mode-selector">
            <div className="choose-mode">
                <Mode path="/prioritise">
                    <h3>Prioritise</h3>
                    <p>
                        Sort your priorities for your crucial courses by ticking off what you know and what&apos;s still left to learn.
                    </p>
                    <svg viewBox="0 0 290 180">
                        <rect className="background" width="100%" height="100%" fill="white" rx="3" />

                        {/* List */}
                        <rect x="5" y="5" width="145" height="30" fill="#D1DADF" rx="3" />
                        <rect x="5" y="40" width="145" height="30" fill="#D1DADF" rx="3" />
                        <rect x="5" y="75" width="145" height="30" fill="#D1DADF" rx="3" />
                        <rect x="5" y="110" width="145" height="30" fill="#D1DADF" rx="3" />
                        <rect x="5" y="145" width="145" height="30" fill="#D1DADF" rx="3" />

                        {/* Dots */}
                        <circle cx="135" cy="20" r="5" fill="yellow" />
                        <circle cx="135" cy="55" r="5" fill="red" />
                        <circle cx="135" cy="90" r="5" fill="red" />
                        <circle cx="135" cy="125" r="5" fill="green" />
                        <circle cx="135" cy="160" r="5" fill="yellow" />

                        {/* Details */}
                        <rect x="155" y="5" width="130" height="170" fill="#D1DADF" rx="5" />
                        <rect x="165" y="15" width="67" height="15" fill="#777" />
                        <rect x="165" y="34" width="110" height="5" fill="#999" />
                        <rect x="165" y="42" width="85" height="5" fill="#999" />
                        {/* Cards */}
                        <rect x="165" y="70" width="50" height="37" fill="#dc143c" rx="5" />
                        <rect x="220" y="70" width="50" height="37" fill="#dc143c" rx="5" />
                        {/* Links */}
                        <rect x="165" y="136" width="51" height="5" fill="#6D9FFA" />
                        <rect x="165" y="144" width="42" height="5" fill="#6D9FFA" />
                        <rect x="165" y="152" width="67" height="5" fill="#6D9FFA" />
                        <rect x="165" y="160" width="64" height="5" fill="#6D9FFA" />
                    </svg>
                </Mode>
                <Mode path="/category">
                    <h3>Learn</h3>
                    <p>
                        Use spaced repetition to get the facts into your head with the classic Flash experience.
                    </p>
                    <svg viewBox="0 0 290 180">
                        <rect className="background" width="100%" height="100%" fill="white" rx="3" />
                        {/* Cards */}
                        <rect x="13" y="13" width="60" height="40" fill="#B84DAA" rx="5" />
                        <rect x="10" y="10" width="60" height="40" fill="#C359B5" rx="5" />
                        <rect x="7" y="7" width="60" height="40" fill="#D964C0" rx="5" />

                        <rect x="83" y="13" width="60" height="40" fill="#528C7B" rx="5" />
                        <rect x="80" y="10" width="60" height="40" fill="#619B8A" rx="5" />
                        <rect x="77" y="7" width="60" height="40" fill="#6FAA99" rx="5" />

                        <rect x="150" y="10" width="60" height="40" fill="#dc143c" rx="5" />
                        <rect x="220" y="10" width="60" height="40" fill="#dc143c" rx="5" />
                        <rect x="10" y="60" width="60" height="40" fill="#dc143c" rx="5" />
                        <rect x="80" y="60" width="60" height="40" fill="#dc143c" rx="5" />
                    </svg>
                </Mode>
            </div>
        </div>
    );
};
