import * as constants from "./constants";
import * as envConstants from "./envConstants";
import { serverOrigin, clientOrigin } from "./envConstants";
import jsonwebtoken from "jsonwebtoken";

export function shuffle(array) {
    // Shuffle flashcards
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export function colourFromInteger(integer) {
    return "#" + integer.toString(16).padStart(6, "0");
}

export function colourToInteger(colour) {
    return parseInt(colour.substring(1), 16);
}

/**
 * Find a suitable text colour given a background colour
 * 
 * @param {number} backgroundColor the colour to contrast with
 * @returns either black or white
 */
export function contrastingColourFromInteger(backgroundColor) {
    let red = backgroundColor >>> 16; // Shift bits right
    let green = (backgroundColor >>> 8) & 0b11111111; // Shift bits right, then use AND to filter out red
    let blue = backgroundColor & 0b11111111; // Filter out red and green

    let luma = (0.21 * red) + (0.71 * green) + (0.08 * blue); // Measure of percieved lightness, out of 255

    if ((luma / 255) < 0.42) {
        return "rgba(255, 255, 255, 1)";
    } else {
        return "rgba(0, 0, 0, 1)";
    }
}

/**
 * Sends an authenticated request to the server by reading AuthToken from localStorage
 * 
 * @param {string} path the path to send the request to, excluding the initial /
 * @param {*} options options to be passed to fetch
 */
export const authenticatedFetch = async (path, options) => await fetch(
    serverOrigin + "/" + path,
    {
        ...options,
        headers: {
            ...(options && options.headers),
            "Authorization": localStorage.getItem("AuthToken") ? "Bearer " + localStorage.getItem("AuthToken") : ""
        }
    }
);

export function getUserFromAuthToken(authToken) {
    let decodedAuthToken;
    try {
        decodedAuthToken = jsonwebtoken.decode(authToken);
    } catch (error) {
        return null;
    }

    if (!decodedAuthToken) {
        return null;
    }
    else {
        return {
            id: decodedAuthToken.id,
            loginTimestamp: decodedAuthToken.iat // In Unix time
        };
    }
}

export function hasFlashGold(userData) {
    if (!userData || !userData.subscription || !userData.subscription.stripeSubscription) {
        return false;
    }

    const subscription = userData.subscription.stripeSubscription;

    if (!(subscription.status === "active" || subscription.status === "trialing")) {
        return false;
    }

    if (!subscription.plan.id === envConstants.stripePlan) {
        return false;
    }

    return true;
}

/**
 * Gets the colour for a rating number
 * null = unrated, grey
 * 0 = red
 * 1 = yellow
 * 2 = green
 * @param {Number | null} rating can be a float (due to averages for each course section)
 * @returns a string representing a CSS color using rgb()
 */
export const getColourForRating = rating => {
    if (rating == null) {
        return "rgb(170, 170, 170)";
    }

    let red, green, blue = 0; // individual values out of 255

    red = Math.min(-122 * rating ** 2 + 128 * rating + 254, 255);

    // green = Math.min(20 + rating * 235, 255);
    green = Math.min(-155 * rating ** 2 + 390 * rating + 20, 255);

    return `rgb(${red}, ${green}, ${blue})`;
};

// // Test getColourForRating
// for (let i = 0; i <= 2; i += 0.2) {
//     const colour = getColourForRating(i);
//     console.log(`%c${i.toString().padStart(20)} | ${colour}`, `background-color:${colour}`);
// }