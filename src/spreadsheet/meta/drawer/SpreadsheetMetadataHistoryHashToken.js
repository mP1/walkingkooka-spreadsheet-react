/**
 * Base class for any metadata history hash token.
 */
import SpreadsheetHistoryHashToken from "../../history/SpreadsheetHistoryHashToken.js";
import SystemObject from "../../../SystemObject.js";

export default class SpreadsheetMetadataHistoryHashToken extends SpreadsheetHistoryHashToken {

    metadataDrawerWidget(metadataDrawerWidget, metadata) {
        SystemObject.throwUnsupportedOperation();
    }
}