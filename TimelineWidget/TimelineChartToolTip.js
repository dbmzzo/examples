import classNames from "classnames";
import React, { Component } from "react";
import moment from "moment";

/**
 * Class representing the chart's tooltip - there's a lot of calculation
 * needed to make sure the tooltips are positioned correctly within
 * the chart. Unfortunately, some DOM inspection is necessary.
 */

export default class TimelineChartToolTip extends Component {

    /**
     * we apply a className that will affect whether the tooltip
     * is rendered above or below the plotline, and where the arrow
     * will be placed
     * @return {String} - the classnames for the tooltip element
     */
    get className () {
        const hidden = this.props.hidden;
        const arrowClass = `arrow-${this.xSide}`;
        const sideClass = this.ySide;
        return classNames(
            "timeline-tooltip",
            arrowClass,
            sideClass,
            {hidden}
        );
    }

    /**
     * @return {ReactElement} - span containing the start and end dates for the tooltip
     */
    get datesActive () {
        const start = moment(this.props.data.dates[0]).format("MMM D, YYYY");
        const end = this.props.data.dates[1] === "ongoing" ? "Ongoing" : moment(this.props.data.dates[1]).startOf("day").format("MMM D, YYYY");
        return <span>Active {start} &#8594; {end}</span>;
    }

    /**
     * @return {Number} - the position of the chart within its scroll container
     */
    get scrollPosition () {
        return this.props.wrapper.offsetParent.scrollTop;
    }

    /**
     * calculate the position of the tooltip based on the scroll position of the chart
     * within its container and the horizontal position of the plotline within the row
     *
     * @return {Object} - style attributes for the tooltip
     */
    get style () {
        if (!this.props.data) {
            return null;
        }
        const translateY = this.ySide == "top" ? "translateY(18%)" : "translateY(-118%)";
        const translateX = this.xMiddle == 50 ? "translateX(-50%)" : "";
        const xSide = this.xSide == "right" ? "right" : "left";
        return {
            top: Math.round(this.props.data.yMiddle),
            transform: `${translateY} ${translateX}`,
            [xSide]: `${this.xPosition}%`
        };
    }

    /**
     * @return {Number} - the height of the scroll wrapper
     */
    get wrapperHeight () {
        return this.props.wrapper.offsetHeight;
    }

    /**
     * @return {Number} - the horizontal center of the plotline
     */
    get xMiddle () {
        const data = this.props.data;
        return (data.xStart + data.xEnd) / 2;
    }

    /**
     * @return {Number} - the horizontal position in percent that the tooltip should be positioned
     */
    get xPosition () {
        return this.xMiddle <= 50 ? this.xMiddle - 2 : 98 - this.xMiddle;
    }

    /**
     * @return {String} - string representation of the tooltip's horizontal position
     */
    get xSide () {
        if (this.xMiddle < 50) {
            return "left";
        }
        if (this.xMiddle > 50) {
            return "right";
        }
        return "middle";
    }

    /**
     * @return {String} - string representation of the tooltip's vertical position
     */
    get ySide () {
        const yPosition = this.props.data.yMiddle - this.scrollPosition;
        const wrapperMiddle = this.wrapperHeight / 2;
        return yPosition < wrapperMiddle ? "top" : "bottom";
    }

    render () {
        return this.props.data ? (
            <div className={this.className} style={this.style}>
                <div className="timeline-tooltip-name">
                    {this.props.data.name}
                </div>
                <div className="timeline-tooltip-dates">
                    {this.datesActive}
                </div>
            </div>
        ) : null;
    }
};
