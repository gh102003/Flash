import * as constants from "./constants";
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
export const authenticatedFetch = async (path, options) =>
    await fetch(
        serverOrigin + "/" + path,
        {
            ...options,
            headers: {
                ...options.headers,
                "Authorization": localStorage.getItem("AuthToken") ? "Bearer " + localStorage.getItem("AuthToken") : ""
            }
        }
    );

export const isLoggedIn = () => localStorage.getItem("AuthToken") != null;

export function getUserFromAuthToken(authToken) {
    const decodedAuthToken = jsonwebtoken.decode(authToken);

    if (!decodedAuthToken) {
        return null;
    }
    else {
        return {
            id: decodedAuthToken.id,
            // emailAddress: decodedAuthToken.emailAddress,
            // username: decodedAuthToken.username,
            loginTimestamp: decodedAuthToken.iat // In Unix time
        };
    }
}