import React, { useEffect } from "react";
import "../../../css/ads.scss";

export const BottomBannerAd = () => {

    useEffect(() => {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
    }, []);

    return (
        <div className="ad-bottom-banner">
            <ins className="adsbygoogle"
                style={{ display: "block" }}
                // data-ad-format="auto"
                // data-full-width-responsive="true"
                data-ad-client="ca-pub-4432679655476297"
                data-ad-slot="3936794327">
            </ins>
        </div>
    );
};
