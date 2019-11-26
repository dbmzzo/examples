import classNames from "classnames";
import React from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

/**
 * possible values for the color property
 */
const COLORS = [
    "black",
    "blue",
    "green",
    "red",
    "timeline-green",
    "white"
];

const CIRCLE_RADIUS = 100;
const STROKE_WIDTH = 15;

export default class CircularTimer extends React.Component {

    static displayName = "CircularTimer";

    state = {
        progress: 0
    };

    // we'll keep track of our requestAnimationFrame id here
    // so we can cancel it when unmouting the component
    reqAnim = null;

    // keep track of whether the component is mounted
    // and do so outside of state to avoid race conditions
    mounted = false;

    static defaultProps = {
        background: true,
        color: "timeline-green",
        duration: 60000,
        start: false,
        loop: false,
        outline: true,
        transition: false,
        width: 22,
    };

    static propTypes = {
        background: React.PropTypes.bool,
        color: React.PropTypes.oneOf(COLORS),
        duration: React.PropTypes.number,
        onComplete: React.PropTypes.func,
        outline: React.PropTypes.bool,
        transition: React.PropTypes.bool,
        width: React.PropTypes.number
    };

    /**
     * get the SVG markup for the background of the timer object
     * this needs to be a separate SVG object because of a Safari rendering bug
     *
     * @return {object} - the background react fragment
     */
    get background () {
        return (
            <svg className={this.timerClass} width={this.props.width} viewBox={this.viewBox}>
                <circle
                    className="circular-timer-background"
                    cx={CIRCLE_RADIUS}
                    cy={CIRCLE_RADIUS}
                    r={CIRCLE_RADIUS}
                    strokeWidth={STROKE_WIDTH}
                />
            </svg>
        );
    }

    /**
     * get the class names for the container object,
     * including the "bounce" and "running" classes
     * which add a "bounce" transition when the timer
     * starts or restarts
     *
     * @return {string} - the classNames string
     */
    get containerClass () {
        return classNames(
            this.props.className,
            "circular-timer-container",
        );
    }

    /**
     * get the current style object for the timer's container,
     * consisting of width and height, which are the same since
     * the timer is circular
     *
     * @return {object} - style properties
     */
    get containerStyle () {
        return {
            width: this.props.width,
            height: this.props.width
        };
    }

    /**
     * get the elapsed time since the timer was started
     *
     * @return {number} - elapsed time in milliseconds
     */
    get elapsedTime () {
        return this.state.startTime ? Date.now() - this.state.startTime : 0;
    }

    /**
     *
     * classes for elements that have transition applied
     *
     */
    get transitionClass () {
        const running = this.progress > 0 && this.progress < 1;
        return classNames(
            this.timerClass,
            {"bounce": this.props.transition},
            {"running": running}
        );
    }

    get viewBox () {
        return `0 0 ${CIRCLE_RADIUS * 2} ${CIRCLE_RADIUS * 2}`;
    }

    /**
     * get the SVG markup for the outline of the timer object
     * this needs to be a separate SVG object because of a Safari rendering bug
     *
     * @return {object} - the outline react fragment
     */
    get outline () {
        const running = this.progress > 0 && this.progress < 1;
        const classes = classNames(
            {"bounce": this.props.transition},
            {"running": running},
            this.timerClass
        );
        return (
            <svg className={classes} width={this.props.width} viewBox={this.viewBox}>
                <circle
                    className="circular-timer-outline"
                    cx={CIRCLE_RADIUS}
                    cy={CIRCLE_RADIUS}
                    r={CIRCLE_RADIUS - (STROKE_WIDTH / 2)}
                    strokeWidth={STROKE_WIDTH}
                />
            </svg>
        );
    }

    /**
     * get the current progress of the timer
     *
     * @return {number} - the progress of the timer from 0 to 1
     */
    get progress () {
        return this.state.startTime ? this.elapsedTime / this.props.duration : 0;
    }

    /**
     * get the SVG markup for the center of the timer
     *
     * @return {object} - the timer react fragment
     */
    get timer () {
        const running = this.progress > 0 && this.progress < 1;
        const classes = classNames(
            {"bounce": this.props.transition},
            {"running": running},
            this.timerClass
        );
        return (
            <svg className={classes} width={this.props.width} viewBox={this.viewBox}>
                <path
                    className="circular-timer-fill"
                    d={this.timerPath}
                    transform={`translate(${CIRCLE_RADIUS},${CIRCLE_RADIUS})`}
                />
            </svg>
        );
    }

    /**
     * get the class names for the timer, primarily to determine color
     *
     * @return {string} - the class names string
     */
    get timerClass () {
        return classNames("circular-timer", this.props.color);
    }

    /**
     * get the SVG path data string for drawing the inside of the timer
     *
     * @return {string} - the path data string
     */
    get timerPath () {
        const radius = CIRCLE_RADIUS;
        const angle = this.progress * 360;
        const rad = (angle * Math.PI / 180);
        const x = Math.sin(rad) * -radius;
        const y = Math.cos(rad) * -radius;
        const mid = (angle < 180) ? 1 : 0;
        return `M 0 0 v -${radius} A ${radius} ${radius} 1 ${mid} 1 ${x} ${y} z`;
    }

    /**
     * start the timer if we have a start
     * if we don't, just draw the timer without
     * starting it
     */
    componentDidMount () {
        this.mounted = true;
        if (this.props.start) {
            this.startTimer();
        } else {
            // FIXME setState in componentDidMount a bad practice, fix it!
            this.setState({progress: this.progress});   // eslint-disable-line
        }
    }

    componentWillUnmount () {
        this.mounted = false;
        window.cancelAnimationFrame(this.reqAnim);
    }

    // if we're passed a new start, restart the timer
    componentWillReceiveProps (nextProps) {
        if (nextProps.start !== this.props.start) {
            this.setState({startTime: null, progress: 0});
            this.startTimer();
        }
    }

    /**
     * start the timer
     * set the start time to now, and trigger updating
     */
    startTimer () {
        this.setState({startTime: Date.now()});
        this.reqAnim = window.requestAnimationFrame(this.updateTimer.bind(this));
    }

    /**
     * stop timer
     * set the start time to null, and draw the stopped state
     */
    stopTimer () {
        this.setState({startTime: null});
        if (this.props.loop) {
            this.startTimer();
        }
    }

    /**
     * update the current visual state of the timer
     * if progress is 1 (complete), stop the timer
     */
    updateTimer () {
        if (!this.mounted) {
            return;
        }
        if (this.progress < 1) {
            this.setState({progress: this.progress});
            this.reqAnim = window.requestAnimationFrame(this.updateTimer.bind(this));
        } else {
            if (this.props.onComplete) {
                this.props.onComplete();
            }
            this.stopTimer();
        }
    }

    // double svg elements are required to avoid Safari rendering bug
    render () {
        const outline = this.props.outline ? this.outline : null;
        const background = this.props.background ? this.background : null;
        return (
            <div className={this.containerClass} style={this.containerStyle}>
                {outline}
                {this.timer}
                {background}
            </div>
        );
    }

}
