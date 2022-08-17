import SystemObject from "../../SystemObject.js";

export default class SpreadsheetHistoryHashToken extends SystemObject {

    historyHashPath() {
        SystemObject.throwUnsupportedOperation();
    }

    toJSON() {
        return this.toString();
    }

    toString() {
        return this.historyHashPath();
    }
}