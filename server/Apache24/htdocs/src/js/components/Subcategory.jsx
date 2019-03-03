import React from "react";
import { Link } from "react-router-dom";

import * as util from "../util";

export class Subcategory extends React.Component {
    render() {
        let backgroundColor = util.colourFromInteger(this.props.colour);
        let color = util.contrastingColourFromInteger(this.props.colour);
        return (
            <Link to={`/category/${this.props.id}`} className="card subcategory" style={{ backgroundColor, color }} draggable="false">
                {this.props.name}
            </Link>
        );
    }
}
