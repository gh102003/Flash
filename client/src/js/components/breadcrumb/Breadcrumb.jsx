import React from "react";

import { BreadcrumbCategory } from "./BreadcrumbCategory.jsx";

import "../../../css/breadcrumb.css";

export const Breadcrumb = props => (
    <div className="breadcrumb">
        {
            <BreadcrumbCategory
                category={props.currentCategory}
                handleCardMove={props.handleCardMove}
                handleNavigate={props.handleNavigate}
                depth={0}
            />
        }
    </div>
);