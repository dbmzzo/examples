import React, { Component } from "react";

/**
 * Class representing individual plotlines in the timeline rows
 */

export default class TimelineChartPlotLine extends Component {

    constructor (props) {
        super(props);
        this.onShowToolTip = this.onShowToolTip.bind(this);
        this.onHideToolTip = this.onHideToolTip.bind(this);
    }

    /**
     * @param {Number} x - the horizontal position for the cap
     * @param {Number} y - the vertical position for the cap
     * @return {ReactElement} - SVG circle element representing the cap
     */
    capForPoint (x, y) {
        return x > 0 && x < 100 ? <circle className="cap" cx={`${x}%`} cy={y} r={this.props.endCapRadius} /> : null;
    }

    /**
     * the function to call when the tooltip should hide
     */
    onHideToolTip () {
        this.props.onHideToolTip();
    }

    /**
     * the function to call when the tooltip should appear
     */
    onShowToolTip () {
        this.props.onShowToolTip(this.props);
    }

    render () {
        const {dates, xEnd, yMiddle, xStart} = this.props;
        const endCap = this.props.showEndCaps ? this.capForPoint(xEnd, yMiddle) : null;
        const startCap = this.props.showEndCaps ? this.capForPoint(xStart, yMiddle) : null;
        return (
            <g className="plotline" onMouseEnter={this.onShowToolTip} onMouseLeave={this.onHideToolTip}>
                <line className="line" x1={`${xStart}%`} x2={`${xEnd}%`} y1={yMiddle} y2={yMiddle}></line>
                <line className="line hover" x1={`${xStart}%`} x2={`${xEnd}%`} y1={yMiddle} y2={yMiddle}></line>
                {endCap}
                {startCap}
            </g>
        );
    }
};

