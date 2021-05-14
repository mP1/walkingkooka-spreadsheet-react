import PropTypes from "prop-types";
import React from 'react';

export default class SpreadsheetNotificationWidget extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
        this.onClose = props.onClose;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log("componentDidUpdate state.notification: ", "new", this.state.notification, "prevState", prevState.notification);
    }

    render() {
        const notification = this.state.notification;
        return notification ? notification.render(this.onClose) : null;
    }
}

SpreadsheetNotificationWidget.propTypes = {
    onClose: PropTypes.func.isRequired,
}