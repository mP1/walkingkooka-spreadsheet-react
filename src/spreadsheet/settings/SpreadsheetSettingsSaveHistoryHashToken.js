import CharSequences from "../../CharSequences.js";
import Equality from "../../Equality.js";
import SpreadsheetHistoryHashTokens from "../history/SpreadsheetHistoryHashTokens.js";
import SpreadsheetSettingsHistoryHashToken from "./SpreadsheetSettingsHistoryHashToken.js";
import SpreadsheetSettingsWidgetHistoryHashTokens from "./SpreadsheetSettingsWidgetHistoryHashTokens.js";

/**
 * Saves the metadata or text style property with a new value, which may be null if the property should be removed.
 */
export default class SpreadsheetSettingsSaveHistoryHashToken extends SpreadsheetSettingsHistoryHashToken {

    constructor(property, value) {
        super();

        if(!SpreadsheetSettingsWidgetHistoryHashTokens.isToken(property)){
            throw new Error("Unknown settings property " + CharSequences.quoteAndEscape(property));
        }

        this.propertyValue = property;
        this.valueValue = value;
    }

    item() {
        return null;
    }

    property() {
        return this.propertyValue;
    }

    /**
     * The value which may be null if the property was cleared or removed.
     */
    value() {
        return this.valueValue;
    }

    historyHashPath() {
        const value = this.value();

        return "/" +
            SpreadsheetHistoryHashTokens.SETTINGS +
            "/" +
            this.property() +
            "/" +
            (value ? encodeURIComponent(value) : "");
    }

    settingsWidgetExecute(settingsWidget, previousSettings) {
        settingsWidget.patchSpreadsheetMetadata(
            this.property(),
            this.value()
        );

        const tokens = SpreadsheetHistoryHashTokens.emptyTokens();
        tokens[SpreadsheetHistoryHashTokens.SETTINGS] = previousSettings;
        settingsWidget.historyParseMergeAndPush(tokens);
    }

    equals(other) {
        return super.equals(other) &&
            this.property() === other.property() &&
            Equality.safeEquals(this.value(), other.value());
    }
}