import Equality from "../../Equality.js";
import React from 'react';

export default class SpreadsheetNotificationWidget extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return !Equality.safeEquals(this.state.notification, nextState.notification);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log("componentDidUpdate state.notification: ", "new", this.state.notification, "prevState", prevState.notification);

        const notification = this.state.notification;
        if(null != notification && !Equality.safeEquals(notification, prevState.notification)){
            const level = notification.level();
            const message = notification.text();

            switch(level) {
                case "error":
                    console.error(message);
                    break;
                case "info":
                case "success":
                    console.info(message);
                    break;
                case "warning":
                    console.warn(message);
                    break;
                default:
                    console.error("Unknown level: " + level + ": " + message);
                    break;
            }
        }
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