import React, { useState } from "react";
import { GlobalHotKeys } from "react-hotkeys";
import { useTransition, config } from "react-spring";

import { BreadcrumbCategory } from "./BreadcrumbCategory.jsx";
import { ImportFlashcardsDialog } from "./ImportFlashcardsDialog.jsx";
import * as constants from "../../constants";

import "../../../css/breadcrumb.scss";

export const Breadcrumb = props => {
    const [importDialogOpen, setImportDialogOpen] = useState(false);

    const transitions = useTransition(importDialogOpen, null, {
        from: { opacity: 0, transform: "scale(0.3)" },
        enter: { opacity: 1, transform: "scale(1)" },
        leave: { opacity: 0, transform: "scale(0.3)" },
        config: { tension: 250, friction: 26, clamp: true }
    });

    return (
        <div className="breadcrumb">
            {
                <BreadcrumbCategory
                    category={props.currentCategory}
                    handleCardMove={props.handleCardMove}
                    handleNavigate={props.handleNavigate}
                    depth={0}
                />
            }
            <GlobalHotKeys keyMap={constants.keyMap} handlers={{
                IMPORT_FLASHCARDS: () => (!history.state.state || !history.state.state.background) && setImportDialogOpen(!importDialogOpen)
            }} />
            <div className="import-flashcards">
                <button className="import-flashcards-button" onClick={() => setImportDialogOpen(!importDialogOpen)}>
                    <i className="material-icons">import_export</i>
                    Import
                </button>
                {transitions.map(({ item, key, props: style }) =>
                    item && <ImportFlashcardsDialog
                        key={key}
                        style={style}
                        afterSubmit={props.afterFlashcardImport}
                        category={props.currentCategory}
                        handleClose={() => setImportDialogOpen(false)} />
                )}
            </div>
        </div>
    );
};