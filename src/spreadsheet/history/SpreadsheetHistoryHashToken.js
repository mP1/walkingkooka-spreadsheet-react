import SystemObject from "../../SystemObject.js";

export default class SpreadsheetHistoryHashToken extends SystemObject {

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