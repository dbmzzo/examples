import CampaignActivityStore from "../../stores/CampaignActivityStore";
import GuidanceOverlay from "../GuidanceOverlay";
import MetricsActions from "../../actions/MetricsActions";
import MetricsConstants from "../../../shared/analytics/constants/MetricsConstants";
import MilestoneConstants from "app/shared/milestone/constants/MilestoneConstants";
import MilestoneStore from "app/shared/milestone/stores/MilestoneStore";
import React from "react";
import TimelineWidgetContent from "./TimelineWidgetContent";
import _ from "lodash";
import { Button, Icon, LocalLoader } from "common/components";
import { loadingStates } from "common/utils/widgets";

const {
    APPS: { DASHBOARD },
    NAMES: { HAS_ACTIVATED_EXPERIENCE },
    TYPES: { ACCOUNT },
} = MilestoneConstants;

/**
 * Container that wraps and passes props to the constituent
 * parts of the timeline widget.
**/

export default class TimelineWidget extends React.Component {

    constructor (props) {
        super(props);
        this.storeDidChange = this.storeDidChange.bind(this);
    }

    state = {
        isLoading: true,
        prevLookahead: null,
        prevLookback: null,
        hasAcctActivatedExperience: MilestoneStore.hasMilestone(DASHBOARD, HAS_ACTIVATED_EXPERIENCE, ACCOUNT),
    };

    /**
        the chart requires both a timeLookback and timeLookahead parameter
        -----------------------------------------------------------------
        @param timeLookback {Number} - the time in days from the present day to look back
        @param timeLookahead {Number} - the time in days from the present to look ahead

        the chart supports a number of options that affect its appearance
        -----------------------------------------------------------------
        @param endCapRadius {Number} - the radius of circular endcaps that appear at the ends of plot lines
        @param horizontalPadding {Number} - distance (in percent of chart width) to pad the chart contents
        @param labelCount {Number} - the number of date labels that appear in the chart header
        @param labelFormat {String} - the moment.js date format for the header labels
        @param labelTextAnchor {String} - (middle|right|left) the SVG text-anchor to apply to the header labels
        @param rowHeight {Number} - the height in pixels of the timeline rows
        @param showEndCaps {Bool} - whether to render the plot line endcaps
        @param tickHeight {Number} - the height in pixels of the ticks rendered for each day in the table header
        @param tickMajorHeight {Number} the height in pixels of the ticks under labels in the table header
        @param toolTipDateFormat {String} - the moment.js date format for the tooltip dates
     **/

    static propTypes = {
        timeLookback: React.PropTypes.number,
        timeLookahead: React.PropTypes.number,
        endCapRadius: React.PropTypes.number,
        horizontalPadding: React.PropTypes.number,
        labelCount: React.PropTypes.number,
        labelFormat: React.PropTypes.string,
        labelTextAnchor: React.PropTypes.string,
        rowHeight: React.PropTypes.number,
        showEndCaps: React.PropTypes.bool,
        tickHeight: React.PropTypes.number,
        tickMajorHeight: React.PropTypes.number,
        toolTipDateFormat: React.PropTypes.string
    };

    static defaultProps = {
        timeLookback: MetricsConstants.DEFAULT_LOOKBACK,
        timeLookahead: MetricsConstants.DEFAULT_LOOKAHEAD,
        endCapRadius: 5,
        headerHeight: 34,
        horizontalPadding: 5,
        labelCount: 7,
        labelFormat: "MMM D",
        labelTextAnchor: "middle",
        rowHeight: 44,
        showEndCaps: false,
        tickHeight: 5,
        tickMajorHeight: 8,
        toolTipDateFormat: "MMM D, YYYY"
    };

    get guidanceOverlay () {
        return this.state.hasAcctActivatedExperience || mt.auth.getIsSalesAccount() ?
            null :
            <GuidanceOverlay
                title="The Experience Timeline"
            >
                <p>Once you have Experiences up and running, you'll use this space to keep track of what's currently active, what's scheduled to run soon, and what's ended. Keep an eye on the priority order—if you have multiple experiences set to modify the same area on your site, priority determines which experience your visitors see.</p>
                <Button
                    icon={<Icon type="start" />}
                    label="Create Your First Experience in 5 Minutes"
                    target="_blank"
                    transparent={true}
                    type="blue"
                    url="https://support.monetate.com/hc/en-us/articles/201107349-Build-Your-First-Web-Experience-Video-"
                />
            </GuidanceOverlay>;
    }

    /**
     * @return {Bool} - whether the store is loading, but has existing data
     */
    get isReloading () {
        return CampaignActivityStore.isLoading && (!!this.state.prevLookback || !!this.state.prevLookahead);
    }

    /**
     * @return {ReactElement} - span containing text for the loading state
     */
    get loadingLabel () {
        return <span>Cookin&rsquo; up a fresh new<br /> experience timeline&hellip;</span>;
    }

    get timeLookahead () {
        return this.isReloading ? this.state.prevLookahead : this.props.timeLookahead;
    }

    /**
     * @return {Number} - the currently requested lookback in days
     */
    get timeLookback () {
        return this.isReloading ? this.state.prevLookback : this.props.timeLookback;
    }

    get loadingState () {
        const { timeLookback } = this.props;
        const { prevLookback } = this.state;
        return loadingStates(CampaignActivityStore.isLoading, timeLookback, prevLookback);
    }

    /**
     * request experiences in the current lookback and lookahead range
     *
     * @param {Number} timeLookback - the desired lookback period
     * @param {Number} timeLookahead - the desired lookahead period
     */
    requestCampaignActivitySummary (timeLookback, timeLookahead) {
        MetricsActions.requestCampaignActivitySummary({
            days_lookback: timeLookback,
            days_lookahead: timeLookahead
        });
    }

    componentDidMount () {
        CampaignActivityStore.subscribe(this.storeDidChange);
        MilestoneStore.subscribe(this.storeDidChange);
        this.requestCampaignActivitySummary(
            this.props.timeLookback, this.props.timeLookahead);
    }

    componentWillReceiveProps (nextProps) {
        if (!_.isEqual(this.props, nextProps)) {
            this.setState({prevLookback: this.timeLookback, prevLookahead: this.timeLookahead});
            this.requestCampaignActivitySummary(
                 nextProps.timeLookback, nextProps.timeLookahead);
        }
    }

    componentWillUnmount () {
        CampaignActivityStore.unsubscribe(this.storeDidChange);
        MilestoneStore.unsubscribe(this.storeDidChange);
    }

    storeDidChange () {
        this.setState({
            hasAcctActivatedExperience: MilestoneStore.hasMilestone(DASHBOARD, HAS_ACTIVATED_EXPERIENCE, ACCOUNT),
            isLoading: CampaignActivityStore.isLoading,
        });
    }

    render () {
        const {className, ...other} = this.props;
        const {
            activeExperienceCount,
            activeNontestExperienceCount,
            activeTestExperienceCount,
            isDemo,
            isLoading,
            campaignActivitySummary,
            scheduledExperienceCount,
            testExperienceCount,
            totalExperienceCount,
            error
        } = CampaignActivityStore;
        return (
            <div className={`position-relative ${className}`}>
                {this.guidanceOverlay}
                <LocalLoader
                    small
                    bordered
                    error={error}
                    label={this.loadingLabel}
                    {...this.loadingState}
                >
                    <TimelineWidgetContent
                        activeExperienceCount={activeExperienceCount}
                        activeNontestExperienceCount={activeNontestExperienceCount}
                        activeTestExperienceCount={activeTestExperienceCount}
                        activitySummary={campaignActivitySummary}
                        chartOptions={other}
                        isDemo={isDemo}
                        scheduledExperienceCount={scheduledExperienceCount}
                        testExperienceCount={testExperienceCount}
                        timeLookahead={this.timeLookahead}
                        timeLookback={this.timeLookback}
                        totalExperienceCount={totalExperienceCount}
                    />
                </LocalLoader>
            </div>
        );
    }
}
