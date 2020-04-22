export const version = "2.2.1";

export const googleAnalyticsTrackingId = "UA-164247818-1";

export const sourceCodeLink = "https://github.com/gh102003/Flash";
export const dataProtectionEmail = "mailto:data-protection@flashapp.uk.to";

export const emailAddressRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

export const draggableTypes = {
    FLASHCARD: "flashcard",
    SUBCATEGORY: "subcategory",
    TAG: "tag"
};

export const keyMap = {
    ADD_FLASHCARD: { name: "Add a new flashcard", sequence: "f", action: "keyup" },
    ADD_CATEGORY: { name: "Add a new category", sequence: "c", action: "keyup" },
    IMPORT_FLASHCARDS: { name: "Import flashcards", sequences: ["ctrl+i", "command+i"] },
    TOGGLE_THEME: { name: "Toggle between light and dark theme (Flash Gold required)", sequence: "d" },
    SWITCH_WORKSPACE: { name: "Switch between public and personal workspaces", sequence: "w" },
    OPEN_INFO_MODAL_BOX: { name: "Open the info page", sequence: "i" },
    OPEN_ACCOUNT_MODAL_BOX: { name: "Open the account page", sequence: "a", action: "keyup" },
    OPEN_TAG_MANAGER_MODAL_BOX: { name: "Open the tag manager", sequence: "t" },
    CLOSE_MODAL_BOX: { name: "Close the current dialog", sequence: "esc" },
    BACK_UP_TO_PARENT: { name: "Return to the parent category", sequences: ["ctrl+up", "command+up"]}
};

export const categoryColours = [
    "#D8B086",
    "#eccc68",
    "#ffa502",
    "#ff7f50",
    "#ff6348",
    "#ff4757",
    "#ff6b81",
    "#C359B5",
    "#7C5CBC",
    "#7bed9f",
    "#2ed573",
    "#619B8A",
    "#5352ed",
    "#1e90ff",
    "#dfe4ea",
    "#a4b0be",
    "#57606f",
    "#2f3542"
];

export const profilePictures = [
    { location: "bird-1", name: "bird 1", flashGoldRequired: false },
    { location: "bird-2", name: "bird 2", flashGoldRequired: false },
    { location: "dog-1", name: "dog 1", flashGoldRequired: false },
    { location: "dog-2", name: "dog 2", flashGoldRequired: false },
    { location: "dog-3", name: "dog 3", flashGoldRequired: false },
    { location: "fox", name: "fox", flashGoldRequired: false },
    { location: "giraffe", name: "giraffe", flashGoldRequired: false },
    { location: "jaguar", name: "jaguar", flashGoldRequired: false },
    { location: "lion", name: "lion", flashGoldRequired: false },
    { location: "lizard", name: "lizard", flashGoldRequired: false },
    { location: "robin", name: "robin", flashGoldRequired: false },
    { location: "sea-lion", name: "sea lion", flashGoldRequired: false },

    { location: "portrait-1", name: "portrait 1", flashGoldRequired: true },
    { location: "portrait-2", name: "portrait 2", flashGoldRequired: true },
    { location: "silhouette-1", name: "silhouette 1", flashGoldRequired: true },
    { location: "silhouette-2", name: "silhouette 2", flashGoldRequired: true }
];

export const ratingColours = {
    null: "#555",
    1: "#e22",
    2: "#ee2",
    3: "#2e2"
};