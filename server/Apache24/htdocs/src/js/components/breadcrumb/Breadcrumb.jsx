import React from "react";

import { BreadcrumbCategoryDropTarget } from "./BreadcrumbCategory.jsx";

import "../../../css/breadcrumb.css";

export class Breadcrumb extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this._getParentsFromServer(this.props.categoryId);
    }

    componentDidUpdate(lastProps) {
        // Check for a change in location, indicating that the page has been navigated
        if (this.props.categoryId !== lastProps.categoryId) {
            this.setState({ loadedData: false });
            this._getParentsFromServer(this.props.categoryId);
        }
    }
    _getParentsFromServer(categoryId) {
        fetch(`/cgi-bin/get_parent_categories.py?id=${categoryId}`, {
            method: "GET",
            cache: "no-cache"
        }).then(response => {
            return response.json();
        }).then(response => {
            this.setState({ currentCategory: response });
        });
    }
    render() {
        return (
            <div className="breadcrumb">
                {this.state.currentCategory && 
                    <BreadcrumbCategoryDropTarget 
                        category={this.state.currentCategory} 
                        handleCardMove={this.props.handleCardMove} 
                        depth={0} 
                    />
                }
            </div>
        );
    }
}