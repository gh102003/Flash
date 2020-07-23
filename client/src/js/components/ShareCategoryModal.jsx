import React, { useEffect } from "react";
import * as envConstants from "../envConstants";

export const ShareCategoryModal = props => {

    useEffect(() => {
        window.snap.creativekit.initalizeShareButtons(document.getElementsByClassName("snapchat-share-button"));
    }, []);

    const url = `${envConstants.clientOrigin}/category/${props.category.id}`;
    // const url = `https://flashapp.uk.to/category/${props.category.id}`;

    return (
        <div className="modal-background" onClick={props.handleClose}>
            <div className="modal share-category-modal" onClick={event => event.stopPropagation()}>
                <div className="modal-header">
                    <h2>Share Category</h2>
                    <i className="material-icons button-close" onClick={props.handleClose}>close</i>
                </div>
                <div className="modal-body">
                    {props.category.name}
                    <div className="share-buttons">

                        <button onClick={() => {
                            navigator.clipboard.writeText(url)
                                .then(() => console.log("copied"))
                                .catch(() => alert("Couldn't copy link"));
                        }}>
                            Copy link
                        </button>

                        <button className="snapchat-share-button" data-share-url={url}>
                            <img src="https://s3.amazonaws.com/bitmoji-sdk-images/logo-snapchat.svg" alt="" />
                            Snapchat
                        </button>

                        {navigator.share &&
                            <button onClick={() => {
                                navigator.share({
                                    title: `Flash: ${props.category.name}`,
                                    text: `View '${props.category.name}' on Flash`,
                                    url
                                }).then(() => console.log("Shared successfully"));
                            }}>Somewhere else</button>
                        }
                    </div>
                </div>
            </div>
        </div >
    )
};