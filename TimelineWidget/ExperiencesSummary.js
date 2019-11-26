import { NumberFormatter, Pluralizer } from "common/components";
import MetricsConstants from "../../../shared/analytics/constants/MetricsConstants";
import React from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

// The combined time for all summary parts to slide in (defined in _timeline-widget.scss).
const TRANSITION_IN_DURATION = 850;

/**
 *  Displays summary experience metrics (total, active, scheduled).
 */
export default class ExperiencesSummary extends React.Component {

    static defaultProps = {
        activeExperienceCount: 0,
        activeNontestExperienceCount: 0,
        activeTestExperienceCount: 0,
        scheduledExperienceCount: 0,
        timeLookahead: MetricsConstants.DEFAULT_LOOKAHEAD,
        timeLookback: MetricsConstants.DEFAULT_LOOKBACK,
        totalExperienceCount: 0
    };

    get activeExperiences () {
        const {
            activeExperienceCount,
            activeTestExperienceCount,
            activeNontestExperienceCount
        } = this.props;
        return (
            <div key="active-experiences" className="active-experiences align-c margin-bottom-xl">
                <div className="piped-legend margin-bottom-xs">
                    <div className="xlarge green figure">
                        <NumberFormatter number={activeExperienceCount} format="human" />
                    </div>
                    <div className="label">Active Now</div>
                </div>
                <div className="fineprint">
                    <b>{activeTestExperienceCount}</b> test&nbsp;
                    <Pluralizer quantity={activeTestExperienceCount} unit="experience" /> and<br />
                    <b>{activeNontestExperienceCount}</b> non-test&nbsp;
                    <Pluralizer quantity={activeNontestExperienceCount} unit="experience" />.
                </div>
            </div>
        );
    }

    get scheduledExperiences () {
        const {scheduledExperienceCount, timeLookahead} = this.props;
        return (
            <div key="scheduled-experiences" className="scheduled-experiences align-c">
                <div className="piped-legend margin-bottom-xs">
                    <div className="xlarge yellow figure">
                        <NumberFormatter number={scheduledExperienceCount} format="human" />
                    </div>
                    <div className="label">Scheduled</div>
                </div>
                <div className="fineprint" data-test-id={`${timeLookahead.toString()}-lookahead-label`}>
                    in the <b>next {timeLookahead} <Pluralizer quantity={timeLookahead} unit="day" /></b>.
                </div>
            </div>
        );
    }

    get totalExperiences () {
        const {totalExperienceCount, timeLookback} = this.props;
        return (
            <div key="total-experiences" className="total-experiences align-c margin-bottom-xl">
                <div className="piped-legend margin-bottom-xs">
                    <div className="xlarge blue figure">
                        <NumberFormatter number={totalExperienceCount} format="human" />
                    </div>
                    <div className="label">Total</div>
                </div>
                <div className="fineprint" data-test-id={`${timeLookback.toString()}-lookback-label`}>
                    Experiences active over the&nbsp;
                    <b>past {timeLookback} <Pluralizer quantity={timeLookback} unit="day" /></b>.
                </div>
            </div>
        );
    }

    render () {

        const {
            activeExperienceCount,
            activeNontestExperienceCount,
            activeTestExperienceCount,
            scheduledExperienceCount,
            timeLookahead,
            timeLookback,
            totalExperienceCount
        } = this.props;

        return (
            <div className="experiences-summary">
                <ReactCSSTransitionGroup
                    transitionName="slide"
                    transitionEnter={false}
                    transitionLeave={false}
                    transitionAppearTimeout={TRANSITION_IN_DURATION}
                    transitionAppear={true}
                >
                    {this.totalExperiences}
                    {this.activeExperiences}
                    {this.scheduledExperiences}
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}
