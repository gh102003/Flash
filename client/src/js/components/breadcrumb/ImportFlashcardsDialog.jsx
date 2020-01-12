import React, { useState } from "react";

import "../../../css/import-flashcards.css";
import * as util from "../../util";

export const ImportFlashcardsDialog = props => {

    const [importData, setImportData] = useState("");
    const [isReversible, setIsReversible] = useState(false);

    const submitEnabled = !!importData;

    const handleSubmit = event => {
        event.preventDefault();

        const flashcards = importData
            .split("\n")
            .map(line => line.split("\t"))
            .map(tokens => ({
                front: tokens[0],
                back: tokens[1],
                category: props.category.id,
                isReversible
            }));

        console.log("Imported flashcards:", flashcards);

        util.authenticatedFetch("flashcards", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ flashcards })
        });
        props.afterSubmit();
        props.handleClose();
    };

    return (
        <div className="import-flashcards-dialog">
            Import flashcards from a list or spreadsheet.
            From Quizlet, click the three dots, &lsquo;export&rsquo;, then copy and paste the text here.
            All the cards will be created in the current category ({props.category.name}).
            <form onSubmit={handleSubmit}>
                <textarea name="import-data" placeholder="Paste data here" value={importData} onChange={event => setImportData(event.target.value)} cols="30" rows="10"></textarea>
                <label>
                    <input type="checkbox" checked={isReversible} onChange={event => setIsReversible(event.target.checked)} />
                    Reversible
                </label>
                <div className="controls">
                    <input type="submit" value="Import" disabled={!submitEnabled} />
                    <button onClick={() => props.handleClose()}>Cancel</button>
                </div>
            </form>
        </div>
    );
};