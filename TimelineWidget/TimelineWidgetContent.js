import { Button, ButtonGroup, Icon} from "common/components";
import classNames from "classnames";
import ExperiencesSummary from "./ExperiencesSummary";
import React from "react";
import TimelineChart from "./TimelineChart";
import TimelineChartHeader from "./TimelineChartHeader";
import TimelineTable from "./TimelineTable";
import TimelineTableHeader from "./TimelineTableHeader";
import _ from "lodash";

/**
 * Class representing the content of the widget, including
 * the table, timeline, and their respecitve fixed headers
**/

export default class TimelineWidgetContent extends React.Component {

    /**
     * unfortunately we must keep track of a single bit of state,
     * which represents the width of scrollbars that may be present
     * in some browsers, in order to ensure that the fixed chart header
     * matches the width of the chart itself
     */
    state = {
        scrollbarWidth: 0
    };

    /**
     * generates the summary that appears to the left of the widget
     *
     * @return {ReactComponent} - the summary component
     */
    get summaryContent () {
        const {
            activeExperienceCount,
            activeNontestExperienceCount,
            activeTestExperienceCount,
            scheduledExperienceCount,
            timeLookback,
            timeLookahead,
            totalExperienceCount
        } = this.props;
        return (
            <ExperiencesSummary
                activeExperienceCount={activeExperienceCount}
                activeNontestExperienceCount={activeNontestExperienceCount}
                activeTestExperienceCount={activeTestExperienceCount}
                scheduledExperienceCount={scheduledExperienceCount}
                timeLookback={timeLookback}
                timeLookahead={timeLookahead}
                totalExperienceCount={totalExperienceCount}
            />
        );
    }

    /**
     * returns the widget's table and chart, and their respective headers
     * the complexity of the markup results from the fixed headers for both the table and the chart
     * @return {ReactElement} - markup containing the widget's component parts
     */
    get timelineContent () {
        // for some browsers, we need to compensate the header width for the presense of the scrollbar in the chart
        const headerStyle = {paddingRight: this.state.scrollbarWidth};
        const {chartOptions, activitySummary, isDemo, timeLookback, timeLookahead} = this.props;
        return (
            <div>
                <div
                    className="grid squash"
                    style={headerStyle}
                    ref={(el) => {
                        this.headerDOM = el;
                    }}
                >
                    <div className="grid-col-5">
                        <TimelineTableHeader />
                    </div>
                    <div className="grid-col-7">
                        <TimelineChartHeader
                            activitySummary={activitySummary}
                            chartOptions={chartOptions}
                            timeLookback={timeLookback}
                            timeLookahead={timeLookahead}
                        />
                    </div>
                </div>
                <div
                    className="card timeline-scroll"
                    ref={(el) => {
                        this.chartDOM = el;
                    }}
                >
                    <div className="grid squash">
                        <div className="grid-col-5">
                            <TimelineTable
                                activitySummary={activitySummary}
                                chartOptions={chartOptions}
                                isDemo={isDemo}
                            />
                        </div>
                        <div className="grid-col-7">
                            <TimelineChart
                                ref={(el) => {
                                    this.chartDOM = el;
                                }}
                                chartOptions={this.props.chartOptions}
                                activitySummary={activitySummary}
                                timeLookback={timeLookback}
                                timeLookahead={timeLookahead}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount () {
        this.setScrollbarWidth();
    }

    componentDidUpdate () {
        this.setScrollbarWidth();
    }

    /**
     * for some browsers, we need to shrink the header width for the presense of the scrollbar in the chart.
     * DOM interaction is necessary, but you can't win 'em all!
     */
    setScrollbarWidth () {
        const scrollbarWidth = this.headerDOM.clientWidth - this.chartDOM.clientWidth - 1;
        if (this.state.scrollbarWidth != scrollbarWidth) {
            this.setState({scrollbarWidth});
        }
    }

    render () {
        return (
            <div className="grid timeline-widget margin-bottom-xl">
                <div className="grid-col-2 experiences-summary-container">
                    {this.summaryContent}
                </div>
                <div className="grid-col-10">
                    {this.timelineContent}
                    <div className="timeline-fade">
                        <div className="timeline-fade-overlay"></div>
                    </div>
                </div>
            </div>
        );
    }

}
