import React, { useContext } from "react";

import { UserContext } from "../../../contexts/UserContext";
import * as constants from "../../../constants";
import * as util from "../../../util";

import "../../../../css/edit-profile-picture.css";
require.context("../../../../res/profile-pictures/128");

export const ProfilePictureEdit = props => {

    const userContext = useContext(UserContext);

    return (
        <div className="edit-dialog edit-dialog-profile-picture">
            <p>Choose your profile picture</p>
            <div className="profile-pictures">
                {constants.profilePictures.map(profilePicture => (
                    <img
                        src={"/res/profile-pictures/128/" + profilePicture + ".png"}
                        alt={profilePicture + " profile picture"}
                        key={profilePicture}
                        title={profilePicture}
                        tabIndex="0"
                        onClick={event => {
                            util.authenticatedFetch(`users/${userContext.currentUser.id}`, {
                                method: "PATCH",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify([{
                                    propName: "profilePicture",
                                    value: profilePicture
                                }])
                            });
                            userContext.changeUser({ ...userContext.currentUser, profilePicture });
                            props.handleClose();
                        }}
                    />
                ))}
            </div>
        </div>
    );
};