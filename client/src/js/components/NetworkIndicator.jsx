import React from "react";
import "../../css/network-indicator.scss";

export const NetworkIndicator = () => (
    navigator.onLine ? <LoadingIndicator /> : <OfflineIndicator />
);

const LoadingIndicator = () => (
    <div className="network-indicator loading">
        Loading
    </div>
);

const OfflineIndicator = () => (
    <div className="network-indicator offline">
        <i className="material-icons">warning</i>No internet connection
    </div>
);