import './index.css';
import * as serviceWorker from './serviceWorker';
import Preconditions from "./Preconditions.js";
import React from 'react';
import ReactDOM from 'react-dom';
import SpreadsheetApp from './spreadsheet/SpreadsheetApp.js';
import SpreadsheetHistoryHash from "./spreadsheet/history/SpreadsheetHistoryHash.js";
import SpreadsheetNotificationWidget from "./spreadsheet/notification/SpreadsheetNotificationWidget.js";
import SpreadsheetNotification from "./spreadsheet/notification/SpreadsheetNotification.js";

const notificationWidget = new SpreadsheetNotificationWidget();
const showError = function(message, error) {
    notificationShow(SpreadsheetNotification.error(message));
    console.error(message, error);
}

const notificationShow = function(notification) {
    Preconditions.optionalInstance(notification, SpreadsheetNotification, "notification");
    console.log("notificationShow ", notification);

    notificationWidget.setState(
        {
            notification: notification
        }
    );
}

const location = window.location;
const spreadsheetHistoryHash = new SpreadsheetHistoryHash(
    () => {
        const hash = location.hash;
        return hash.startsWith("#") ? hash.substring(1) : "";
    },
    (hash) => {
        const hashhash = hash ? "#" + hash : "";

        if(location.hash !== hashhash){
            location.hash = hashhash;
        }
    },
    showError
);
window.addEventListener(
    "hashchange",
    spreadsheetHistoryHash.onHistoryChange.bind(spreadsheetHistoryHash),
    false
);

ReactDOM.render(
    <React.StrictMode>
        <SpreadsheetApp history={spreadsheetHistoryHash}
                        notificationShow={notificationShow}
                        showError={showError}/>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
