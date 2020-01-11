import React from "react";

import { BreadcrumbCategory } from "./BreadcrumbCategory.jsx";
import { ImportFlashcardsDialog } from "./ImportFlashcardsDialog.jsx";

import "../../../css/breadcrumb.css";
import { useState } from "react";

export const Breadcrumb = props => {
    const [importDialogOpen, setImportDialogOpen] = useState(false);
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
            <div className="import-flashcards">
                <button className="import-flashcards-button" onClick={() => setImportDialogOpen(!importDialogOpen)}>
                    <i className="material-icons">import_export</i>
                    Import
                </button>
                {importDialogOpen &&
                    <ImportFlashcardsDialog
                        afterSubmit={props.afterFlashcardImport}
                        category={props.currentCategory}
                        handleClose={() => setImportDialogOpen(false)} />
                }
            </div>
        </div>
    );
};