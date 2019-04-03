import React from "react";

import "../../css/breadcrumb.css";

export class Breadcrumb extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
        this._getParentsFromServer(this.props.categoryId).then(() => this.setState({ loadedData: true }));
    }

    componentWillReceiveProps(nextProps) {
        // Check for a change in location, indicating that the page has been navigated
        if (this.props.categoryId !== nextProps.categoryId) {
            this.setState({ loadedData: false });
            this._getParentsFromServer(nextProps.categoryId).then(() => this.setState({ loadedData: true }));
        }
    }
    _getParentsFromServer(categoryId) {
        return new Promise((resolve) => {
            fetch(`/cgi-bin/get_parent_categories.py?id=${categoryId}`, {
                method: "GET",
                cache: "no-cache"
            }).then(response => {
                return response.json();
            }).then(response => {
                this.setState({ currentCategory: response });
                resolve();
            });
        });
    }
    render() {
        return (
            <div className="breadcrumb">
                { this.state.loadedData && <BreadcrumbCategory category={this.state.currentCategory}/>}
            </div>
        );
    }
}

// Unpack linkedlist style object recursively
function BreadcrumbCategory(props) {
    return (
        <>
            {
                props.category.parent && 
                <>
                    <BreadcrumbCategory category={props.category.parent}/>
                    &gt;
                </>
            }
            <div className="breadcrumb-category">{props.category.name}</div>
        </>
    );
}