import React from "react";
import moment from "moment";

/**
 * Class that TimelineChartHeader and TimelineChart inherit from.
 * Contains properties and functions used to calculate dates,
 * ranges, spacing, etc.
**/

export default class TimelineChart extends React.Component {

    constructor (props) {
        super(props);
        this.scale = this.scale.bind(this);
    }

    /**
     * Returns an array containing timestamps representing the start 00:00:00
     * of all days contained in the current range
     *
     * @return {Array} - array containing timestamps
     */
    get days () {
        const minMoment = moment(this.range.min);
        const days = [];
        const currentMoment = minMoment;
        for (let i = 0; i < this.totalDays; i++) {
            days.push(currentMoment.valueOf());
            currentMoment.add(1, "day");
        }
        return days;
    }

    /**
     *  Returns start and end timestamps for current range
     *
     * @return {Object} - an object containing min and max range values
     */
    get range () {
        const minTime = moment().startOf("day").subtract(this.props.timeLookback, "days").valueOf();
        const maxTime = moment().startOf("day").add(this.props.timeLookahead, "days").valueOf();
        return {
            min: minTime,
            max: maxTime
        };
    }

    /**
     * Returns timestamps for each Sunday 00:00:00 in the filter range
     * @return {Array} timestamps
     */
    get sundays () {
        const sunday = 0;
        return this.days.filter((day) => {
            if (moment(day).weekday() === sunday) {
                return true;
            }
        });
    }

    /**
     * Returns the number of days in the chart's current range
     *
     * @return {Number} - the number of days
     */
    get totalDays () {
        return moment.duration(this.range.max - this.range.min).asDays();
    }

    /**
     * Returns a number scaled from 0 - 100 percent (plus and minus padding)
     *
     * @param {Number} number - the value to be scaled
     * @return {Number} - the scaled number
     */
    scale (number) {
        const padding = this.props.chartOptions.horizontalPadding;
        const fromRange = this.range;
        const toRange = {min: 0 + padding, max: 100 - padding};
        const fromDiff = fromRange.max - fromRange.min;
        const toDiff = toRange.max - toRange.min;
        return (((number - fromRange.min) * toDiff) / fromDiff) + toRange.min;
    }
}
