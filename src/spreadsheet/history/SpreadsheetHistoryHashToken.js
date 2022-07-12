import SystemObject from "../../SystemObject.js";

export default class SpreadsheetHistoryHashToken extends SystemObject {

    spreadsheetViewportWidgetExecute(viewportCell, width, height, viewportWidget) {
        SystemObject.throwUnsupportedOperation();
    }

    toHistoryHashToken() {
        SystemObject.throwUnsupportedOperation();
    }

    toJSON() {
        return this.toString();
    }

    toString() {
        return this.toHistoryHashToken();
    }
}