import React from 'react';

export default class SpreadsheetNotificationWidget extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log("componentDidUpdate state.notification: ", "new", this.state.notification, "prevState", prevState.notification);
    }

    render() {
        const notification = this.state.notification;
        return notification ? notification.render(this.onClose.bind(this)) : null;
    }

    onClose() {
        this.setState({
            notification: null,
        });
    }
}