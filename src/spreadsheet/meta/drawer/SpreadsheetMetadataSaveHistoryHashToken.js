import CharSequences from "../../../CharSequences.js";
import Equality from "../../../Equality.js";
import SpreadsheetHistoryHashTokens from "../../history/SpreadsheetHistoryHashTokens.js";
import SpreadsheetMetadataDrawerWidgetHistoryHashTokens from "./SpreadsheetMetadataDrawerWidgetHistoryHashTokens.js";
import SpreadsheetMetadataHistoryHashToken from "./SpreadsheetMetadataHistoryHashToken.js";

/**
 * Saves the metadata or text style property with a new value, which may be null if the property should be removed.
 */
export default class SpreadsheetMetadataSaveHistoryHashToken extends SpreadsheetMetadataHistoryHashToken {

    constructor(property, value) {
        super();

        if(!SpreadsheetMetadataDrawerWidgetHistoryHashTokens.isToken(property)){
            throw new Error("Unknown metadata property " + CharSequences.quoteAndEscape(property));
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
            SpreadsheetHistoryHashTokens.METADATA +
            "/" +
            this.property() +
            "/" +
            (value ? encodeURIComponent(value) : "");
    }

    metadataDrawerWidget(metadataDrawerWidget, metadata) {
        metadataDrawerWidget.patchSpreadsheetMetadataProperty(
            this.property(),
            this.value()
        );

        const tokens = SpreadsheetHistoryHashTokens.emptyTokens();
        tokens[SpreadsheetHistoryHashTokens.METADATA] = metadata;
        metadataDrawerWidget.historyMergeAndPush(tokens);
    }

    equals(other) {
        return super.equals(other) &&
            this.property() === other.property() &&
            Equality.safeEquals(this.value(), other.value());
    }
}