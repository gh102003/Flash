import React, { useState } from "react";
import "../../../css/tutorial-card.scss";
import { TutorialPage } from "./TutorialPage.jsx";

const pages = [
    <TutorialPage key="0">
        <h3>Tutorial</h3>
        <p>Find out how to use Flash Learn!</p>
    </TutorialPage>,
    <TutorialPage key="1">
        <h3>Flashcards</h3>
        <p>Flashcards have two sides. Create them with the + button down below.</p>
    </TutorialPage>,
    <TutorialPage key="2">
        <h3>Categories</h3>
        <p>You can organise flashcards by dragging them into categories. Only moderators can edit locked categories.</p>
    </TutorialPage>,
    <TutorialPage key="3">
        <h3>Account</h3>
        <p>Press <i className="material-icons">person</i> to login and create cards only you can see. Get Flash Gold for even more brilliant features.</p>
    </TutorialPage>,
    <TutorialPage key="4">
        <h3>Workspaces</h3>
        <p>When logged in, you can switch between the public workspace and your own personal workspace.</p>
    </TutorialPage>,
    <TutorialPage key="5">
        <h3>Quiz</h3>
        <p>Hover over or tap a category to take a quick quiz. Get Flash Gold to track your progress.</p>
    </TutorialPage>,
];

export const TutorialCard = () => {

    const [currentPage, setCurrentPage] = useState(0);

    return (
        <div className="card tutorial-card">
            <button className="tutorial-nav-button" disabled={currentPage < 1} onClick={() => setCurrentPage(currentPage - 1)}>
                <i className="material-icons" title="Previous">navigate_before</i>
            </button>

            {pages[currentPage]}

            <div role="navigation" className="tutorial-page-indicators">
                {pages.map((_, index) =>
                    <div
                        key={index}
                        className={index === currentPage ? "tutorial-page-indicator tutorial-page-indicator-selected" : "tutorial-page-indicator"}
                        aria-current={index === currentPage}
                    />
                )}
            </div>

            <button className="tutorial-nav-button" disabled={currentPage >= pages.length - 1} onClick={() => setCurrentPage(currentPage + 1)}>
                <i className="material-icons" title="Next">navigate_next</i>
            </button>
        </div>
    );
};