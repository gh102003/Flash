import React, { useContext } from "react";

import { UserContext } from "../../contexts/UserContext";
import * as constants from "../../constants";
import * as util from "../../util";

import "../../../css/edit-profile-picture.scss";
// eslint-disable-next-line no-undef
require.context("../../../res/profile-pictures/128");

export const ProfilePictureEdit = props => {

    const userContext = useContext(UserContext);

    const hasFlashGold = util.hasFlashGold(userContext.currentUser);

    const renderProfilePicture = profilePicture => (
        <img
            className={profilePicture.flashGoldRequired ? "profile-picture-preview profile-picture-preview-gold" : "profile-picture-preview"}
            key={profilePicture.location}
            src={"/res/profile-pictures/128/" + profilePicture.location + ".png"}
            alt={profilePicture.name + " profile picture"}
            title={profilePicture.name}
            tabIndex="0"
            onClick={event => {
                util.authenticatedFetch(`users/${userContext.currentUser.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify([{
                        propName: "profilePicture",
                        value: profilePicture.location
                    }])
                });
                userContext.changeUser({ ...userContext.currentUser, profilePicture: profilePicture.location });
                props.handleClose();
            }}
        />
    );

    return (
        <div className="edit-dialog edit-dialog-profile-picture">
            <p>Choose your profile picture</p>
            <div className="profile-pictures">
                {constants.profilePictures
                    .filter(profilePicture => !profilePicture.flashGoldRequired)
                    .map(renderProfilePicture)}
            </div>
            {hasFlashGold && <div className="profile-pictures profile-pictures-flash-gold">
                <p>Flash Gold Exclusives</p>
                {constants.profilePictures
                    .filter(profilePicture => profilePicture.flashGoldRequired)
                    .map(renderProfilePicture)}
            </div>}
            {!hasFlashGold && <p className="get-flash-gold-cta">Get Flash Gold for access to exclusive profile pictures</p>}
        </div>
    );
};