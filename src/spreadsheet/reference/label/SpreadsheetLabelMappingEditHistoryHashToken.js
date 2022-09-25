import Equality from "../../../Equality.js";
import SpreadsheetLabelMappingHistoryHashToken from "./SpreadsheetLabelMappingHistoryHashToken.js";

/**
 * A history hash token that represents a label mapping save including the reference or target of the mapping.
 */
export default class SpreadsheetLabelMappingEditHistoryHashToken extends SpreadsheetLabelMappingHistoryHashToken {

    spreadsheetLabelMappingWidgetExecute(widget, previousLabel) {
        const label = this.label();

        // only load the label if the label changed.
        if(!Equality.safeEquals(previousLabel, label)){
            widget.loadLabelMapping(label);
        }

        return null;
    }
}