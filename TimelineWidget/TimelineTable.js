import {StatusTag, Table} from "common/components";
import React from "react";

/**
 * Class representing the table portion of the widget
 */

export default class TimelineTable extends React.Component {

    /**
     * @return {String} - style the table rows to have the height set in chartOptions
     */
    get style () {
        return {
            height: this.props.chartOptions.rowHeight
        };
    }

    /**
     * @return {Array} - react elements representing the table rows
     */
    get activitySummaryItems () {
        const path = mt.url.getTenantedPath();
        const isDemo = this.props.isDemo;
        return this.props.activitySummary.map(cg => {
            const id = isDemo ? "" : cg.id;
            return (
                <div key={cg.id} className="timeline-table-row" style={this.style}>
                    <div className="timeline-table-cell timeline-priority align-c">
                        {cg.is_archived ?
                            <span className="text-gray font-small-caps">archived</span>
                            : cg.priority}
                    </div>
                    <div className="timeline-table-cell timeline-name">
                        <b className="fluid-ellipsis" title={cg.name}><a className="dark-gray highlight" href={`${path}experience/${id}`}>{cg.name}</a></b>
                    </div>
                    <div className="timeline-table-cell timeline-status">
                        <StatusTag type={cg.status} />
                    </div>
                </div>
            );
        });
    }

    render () {
        if (!this.props.activitySummary) {
            return false;
        }
        return (
            <div className="timeline-table">
                {this.activitySummaryItems}
            </div>
        );
    }

}
