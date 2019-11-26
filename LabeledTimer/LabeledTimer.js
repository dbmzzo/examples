import classNames from "classnames";
import CircularTimer from "./CircularTimer";
import React from "react";

/**
 * possible values for the color property
 */
const COLORS = [
    "black",
    "blue",
    "green",
    "red",
    "timeline-green",
];

export default class LabeledTimer extends React.Component {

    static displayName = "LabeledTimer";

    static defaultProps = {
        color: "timeline-green",
        duration: 60000,
        start: false,
        loop: false,
        label: "Live",
        outline: false,
        transition: true
    };

    static propTypes = {
        color: React.PropTypes.oneOf(COLORS),
        duration: React.PropTypes.number,
        onComplete: React.PropTypes.func,
    };

    get className () {
        return classNames(
            "labeled-timer",
            "padding-horizontal-s",
            this.props.color,
            this.props.className
        );
    }

    render () {
        const {color, className, ...timerProps} = this.props;
        return (
            <div className={this.className}>
                <CircularTimer
                    {...timerProps}
                    width={8}
                    color="white"
                />
                <span className="timer-label margin-left-xs white font-weight-bold">
                    {this.props.label}
                </span>
            </div>
        );
    }

}

