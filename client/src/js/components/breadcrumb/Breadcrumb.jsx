import React from "react";

import { BreadcrumbCategoryDropTarget } from "./BreadcrumbCategory.jsx";

import "../../../css/breadcrumb.css";

export const Breadcrumb = props => {
    console.log(props.currentCategory);
    
    return (
        <div className="breadcrumb">
            {
                <BreadcrumbCategoryDropTarget
                    category={props.currentCategory}
                    handleCardMove={props.handleCardMove}
                    handleNavigate={props.handleNavigate}
                    depth={0}
                />
            }
        </div>
    );

}