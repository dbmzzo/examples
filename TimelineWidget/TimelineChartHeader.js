import Chart from "./TimelineChart";
import moment from "moment";
import React from "react";

/**
 * The independent, fixed header for the timeline chart.
 * Inherits from the generic Chart class along with
 * the TimelineChart, so the chart and header
 * are always kept in sync with the same values.
 */
export default class TimelineChartHeader extends Chart {

    /**
     * @return {Array} - array containing the x positions for the
     * start 00:00:00 of all days that will have ticks
     */
    get tickPositions () {
        const days = this.days;
        const labelCount = this.props.chartOptions.labelCount;
        return days.filter((day, key) => {
            const spacing = Math.ceil(days.length / labelCount);
            return key % spacing == 0;
        });
    }

    /**
     * @return {ReactElement} - SVG group containing all ticks for the header
     */
    get ticks () {
        const {tickPositions, days} = this;
        const {chartOptions} = this.props;
        const ticks = days.map((day, key) => {
            const scaledDay = this.scale(day) + "%";
            // does the day havea a label? if so, make it (tickMajorHeight)px tall
            const hasLabel = tickPositions.some(position => position == day);
            const tickHeight = hasLabel ? chartOptions.tickMajorHeight : chartOptions.tickHeight;
            return (
                <line
                    key={day}
                    x1={scaledDay}
                    x2={scaledDay}
                    y1={chartOptions.headerHeight - tickHeight}
                    y2={chartOptions.headerHeight}
                />
            );
        });
        return (<g className="timeline-ticks">{ticks}</g>);
    }

    /**
     * @return {ReactElement} - SVG group containing all labels for the header
    */
    get labels () {
        const {chartOptions} = this.props;
        const labels = this.tickPositions.map((day, key) => {
            const dateString = moment(day).format(chartOptions.labelFormat);
            const scaledDay = this.scale(day) + "%";
            return (
                <text
                    key={day}
                    textAnchor={chartOptions.labelTextAnchor}
                    className="label"
                    x={scaledDay}
                    y={(chartOptions.headerHeight / 2) + 2}
                >
                    {dateString}
                </text>
            );
        });
        return (<g className="timeline-labels">{labels}</g>);
    }

    /**
     * @return {ReactElement} - SVG element representing the "now" flag that points to the now line
    */
    get nowFlag () {
        // 100 is the total % of the chart width, used to determine what percent of
        // the total width the flag is positioned from the right side of the chart
        const style = {
            right: `${100 - this.scale(moment())}%`
        };
        return (
            <svg className="timeline-now-flag" style={style} width="37px" height="14px" viewBox="0 0 37 14">
                <g>
                    <path d="M28.9911502,0 C29.5483226,0 30.3189651,0.318965077 30.7097195,0.709719494 L37,7 L30.7097195,13.2902805 C30.3177522,13.6822478 29.5586968,14 28.9911502,14 L2.49958117,14 C1.11910061,14 0,12.8779869 0,11.4970806 L0,2.50291944 C0,1.1205952 1.12753916,0 2.49958117,0 L28.9911502,0 Z"></path>
                    <text id="now"><tspan x="5.5" y="10">now</tspan></text>
                </g>
            </svg>
        );
    }

    render () {
        const {chartOptions} = this.props;
        return (
            <div className="timeline-header">
                {this.nowFlag}
                <svg width="100%" height={this.props.chartOptions.headerHeight}>
                    <g>
                        <rect x="0" y="0" width="100%" height={chartOptions.headerHeight} />
                        <g className="ticks">
                            {this.ticks}
                        </g>
                        <g className="labels">
                            {this.labels}
                        </g>
                    </g>
                </svg>
            </div>
        );
    }
};
