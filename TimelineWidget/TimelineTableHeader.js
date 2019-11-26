import {StatusTag, Table} from "common/components";
import React from "react";

/**
 * Class representing the fixed header of the table portion of the widget
 */

export default class TimelineTableHeader extends React.Component {

    render () {
        return (
            <div className="timeline-table-row timeline-table-header">
                <div className="timeline-table-cell timeline-priority align-c">
                    priority
                </div>
                <div className="timeline-table-cell timeline-name fluid-ellipsis">
                    name
                </div>
                <div className="timeline-table-cell timeline-status">
                    status
                </div>
            </div>
        );
    }

}
