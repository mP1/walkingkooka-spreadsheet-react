/**
 * Base class for any settings history hash token.
 */
import SpreadsheetHistoryHashToken from "../../history/SpreadsheetHistoryHashToken.js";
import SystemObject from "../../../SystemObject.js";

export default class SpreadsheetSettingsHistoryHashToken extends SpreadsheetHistoryHashToken {

    settingsWidgetExecute(settingsWidget, previousSettings) {
        SystemObject.throwUnsupportedOperation();
    }
}