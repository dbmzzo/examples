import CSSTransitionGroup from "react-addons-css-transition-group";
import Chart from "./Chart";
import MetricsConstants from "app/shared/analytics/constants/MetricsConstants";
import moment from "moment";
import React from "react";
import TimelineChartRow from "./TimelineChartRow";
import TimelineChartToolTip from "./TimelineChartToolTip";
import _ from "lodash";
import { dateFromNow } from "common/utils/dateTime";

/**
 * Class representing the chart portion of the widget.
 * Inherits from the generic Chart class along with TimelineChartHeader,
 * so the chart and header are always pulling the same values.
**/

export default class TimelineChart extends Chart {

    constructor (props) {
        super(props);
        this.onShowToolTip = this.onShowToolTip.bind(this);
        this.onHideToolTip = this.onHideToolTip.bind(this);
    }

    state = {
        tooltipData: null,
        showTooltip: false
    };

    static propTypes = {
        activitySummary: React.PropTypes.array.isRequired
    };

    /**
     * @return {ReactElement} SVG element containing constituent parts of the chart
     */
    get chart () {
        return (
            <svg width="100%" height={this.chartHeight}>
                {this.rows}
                {this.weeklyGridlines}
                {this.sessionUpdateLine}
                {this.todayLine}
                {this.shadowRect}
                {this.futureRect}
                {this.fadeRect}
            </svg>
        );
    }

    /**
     * @return {Number} - the pixel height of the current chart
     * based on rowHeight and number of rows
     */
    get chartHeight () {
        const {chartOptions, activitySummary} = this.props;
        return chartOptions.rowHeight * activitySummary.length + 33;
    }

    /**
     * @return {ReactElement} SVG rect overlaying all future dates on the chart
     */
    get futureRect () {
        const today = moment();
        const width = this.range.min + (this.range.max - today);
        const scaledWidth = `${this.scale(width)}%`;
        const scaledToday = `${this.scale(today)}%`;
        return (
            <rect
                className="timeline-future-overlay"
                height="100%"
                width={scaledWidth}
                x={scaledToday}
                y="0%"
            />
        );
    }

    /**
     * @return {ReactElement} - Returns an SVG group containing all TimelineRow components for the chart
     */
    get rows () {
        const rows = this.props.activitySummary.map((activitySummary, key) =>
            <TimelineChartRow
                activitySummary={activitySummary}
                chartOptions={this.props.chartOptions}
                index={key}
                key={key}
                onHideToolTip={this.onHideToolTip}
                onShowToolTip={this.onShowToolTip}
                range={this.range}
                scale={this.scale}
            />
        );
        return <g>{rows}</g>;
    }

    /**
     * @return {ReactElement} SVG rect for chart shadow
     */
    get shadowRect () {
        return (
            <g>
                <rect
                    className="timeline-shadow"
                    height="100%"
                    width="5"
                    x="0%"
                    y="0%"
                />
                <line
                    className="timeline-shadow-border"
                    x1="0%"
                    x2="0%"
                    y1="0%"
                    y2="100%"
                />
            </g>
        );
    }

    get sessionUpdateLine () {
        let sessionUpdateLine = null;
        const sessionUpdateIsoDate = mt.auth.getSessionCutoverTime();
        if (sessionUpdateIsoDate) {
            // check range
            const { timeLookahead, timeLookback } = this.props;
            const sessionUpdateDate = new Date(sessionUpdateIsoDate);
            const selectedMin = dateFromNow(`P${timeLookback}D`, true);
            const selectedMax = dateFromNow(`P${timeLookahead}D`);
            const sessionUpdateInRange = sessionUpdateDate >= selectedMin && sessionUpdateDate <= selectedMax;
            if (sessionUpdateInRange) {
                const scaledSessionUpdateDate = `${this.scale(moment(sessionUpdateDate))}%`;
                sessionUpdateLine = (
                    <line
                        className="timeline-session-update-line"
                        x1={scaledSessionUpdateDate}
                        x2={scaledSessionUpdateDate}
                        y1="0%"
                        y2="100%"
                    />
                );
            }
        }

        return sessionUpdateLine;
    };

    /**
     * @return {ReactElement} SVG horizontal line representing the current time
     */
    get todayLine () {
        const scaledToday = `${this.scale(moment())}%`;
        return (
            <line
                className="timeline-today-line"
                x1={scaledToday}
                x2={scaledToday}
                y1="0%"
                y2="100%"
            />
        );
    }

    /**
     * @return {ReactElement} TimelineToolTip element with current tooltip data
     */
    get toolTip () {
        return (
            <TimelineChartToolTip
                wrapper={this.wrapperDOM}
                data={this.state.tooltipData}
                hidden={!this.state.showTooltip}
            />
        );
    }

    /**
     * @return {ReactElement} - SVG group containing vertical gridlines for each Sunday contained in the chart
     */
    get weeklyGridlines () {
        const lines = this.sundays.map((sunday, key) => {
            const scaledSunday = `${this.scale(sunday)}%`;
            return <line key={key} x1={scaledSunday} x2={scaledSunday} y1="0%" y2="100%" />;
        });
        return <g className="timeline-grid-lines">{lines}</g>;
    }

    /**
     * function called when tooltip should appear
     * @param {Object} info - data for the currently visible tooltip
     */
    onShowToolTip (info) {
        this.setState({tooltipData: info, showTooltip: true});
    }

    /**
     * function to call when tooltip should hide
     */
    onHideToolTip () {
        this.setState({showTooltip: false});
    }

    shouldComponentUpdate (nextProps, nextState) {
         return (!_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState));
    }

    render () {
        return (
            <div
                className="timeline-chart-wrapper"
                ref={(el) => {
                    this.wrapperDOM = el;
                }}
                data-test-id="timeline-chart-data"
            >
                {this.toolTip}
                {this.chart}
            </div>
        );
    }
}
