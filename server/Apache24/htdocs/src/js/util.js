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

// Black or white, depending on the darkness of the colour
export function contrastingColourFromInteger(backgroundColor) {
    let red = backgroundColor >>> 16; // Shift bits right
    let green = (backgroundColor >>> 8) & 0b11111111; // Shift bits right, then use AND to filter out red
    let blue = backgroundColor & 0b11111111; // Filter out red and green

    let luma = (0.21 * red) + (0.71 * green) + (0.08 * blue); // Measure of percieved lightness, out of 255

    if ((luma / 255) < 0.4) {
        return "#FFFFFF";
    } else {
        return "#000000";
    }
}