import React, { Component } from "react";
import TimelineChartPlotLine from "./TimelineChartPlotLine";
import _ from "lodash";

/**
 * Class representing an individual chart timeline row
 */

export default class TimelineChartRow extends Component {

    /**
     * @return {Number} - y value representing the bottom of the current row in pixels
     */
    get bottom () {
        return this.top + this.props.chartOptions.rowHeight;
    }

    /**
     * @return {Object} - the x, y, width, and height of the row
     */
    get bounds () {
        return {
            x: 0,
            y: this.top,
            width: "100%",
            height: this.height
        };
    }

    /**
     * @return {String} - the className of the row, based on status
     */
    get className () {
        return this.props.activitySummary.status ? `timeline-row ${this.props.activitySummary.status}` : "timeline-row";
    }

    /**
     * SVG shapes do not have a border properties, so we fudge one using a line
     * that needs to be adjusted by half its thickness (.5 pixel) to align with
     * how the border is drawn on the table
     *
     * @return {ReactElement} - SVG line element representing the bottom border of the row
     */
    get divider () {
        return (
            <line
                className="divider"
                x1="0%"
                y1={this.bottom - 0.5}
                x2="100%"
                y2={this.bottom - 0.5}
            />
        );
    }

    /**
     * @return {Number} - the row height in pixels
     */
    get height () {
        return this.props.chartOptions.rowHeight;
    }

    /**
     * @return {Array} - the plot lines for the current experience
     */
    get plotLines () {
        return this.scaledDateRanges.map(([xStart, xEnd], key) =>
            <TimelineChartPlotLine
                key={key}
                dates={this.realDateRanges[key]}
                xEnd={xEnd}
                endCapRadius={this.props.chartOptions.endCapRadius}
                yMiddle={this.yMiddle}
                name={this.props.activitySummary.name}
                onHideToolTip={this.props.onHideToolTip}
                onShowToolTip={this.props.onShowToolTip}
                showEndCaps={this.props.chartOptions.showEndCaps}
                xStart={xStart}
            />
        );
    }

    /**
     * @return {Array} - timestamps for the start and end of the current experience's plotlines
     */
    get realDateRanges () {
        return this.props.activitySummary.active_ranges.map(range =>
            range.map(date => {
                if (date) {
                    return new Date(date).getTime();
                } else {
                    return "ongoing";
                }
            })
        );
    }

    /**
     * @return {ReactElement} - SVG rect element used as a background for the current row
     */
    get backgroundRect () {
        return <rect className="background" {...this.bounds} />;
    }

    /**
     * @return {Array} - scaled values for the start and end of the current experience's plotlines
     */
    get scaledDateRanges () {
        return this.props.activitySummary.active_ranges.map(range =>
            range.map((date) => {
                const point = date ? this.props.scale(new Date(date).getTime()) : 100;
                return point < 0 ? 0 : point;
            })
        );
    }

    /**
     * @return {Number} - y value representing the top of the current row in pixels
     */
    get top () {
        return this.props.chartOptions.rowHeight * this.props.index;
    }

    /**
     * @return {Number} - value representing the vertical center of the current row in pixels
     */
    get yMiddle () {
        return this.top + this.props.chartOptions.rowHeight / 2;
    }

    shouldComponentUpdate (nextProps) {
        return !_.isEqual(this.props, nextProps);
    }

    render () {
        const {chartOptions} = this.props;
        return (
            <g className={this.className}>
                {this.backgroundRect}
                {this.divider}
                {this.plotLines}
            </g>
        );
    }
};
