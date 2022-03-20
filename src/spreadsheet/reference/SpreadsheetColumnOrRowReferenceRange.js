import SpreadsheetSelection from "./SpreadsheetSelection.js";
import SystemObject from "../../SystemObject.js";

/**
 * Base class for both column or row ranges.
 */
export default class SpreadsheetColumnOrRowReferenceRange extends SpreadsheetSelection {

    constructor(begin, end) {
        super();

        const beginLTE = begin.compareTo(end) <= 0;

        this.beginValue = beginLTE ? begin : end;
        this.endValue = beginLTE ? end : begin;
    }

    begin() {
        return this.beginValue;
    }

    end() {
        return this.endValue;
    }

    /**
     * The number of columns or rows in this range.
     */
    count() {
        return this.end().value() - this.begin().value() + 1;
    }

    // selection........................................................................................................

    isColumnOrRowScalarOrRange() {
        return true;
    }

    // patch.........................................................................................................

    patch(property, value) {
        return this.values()
            .map((element) => element.patch(property, value));
    }

    values() {
        return SystemObject.throwUnsupportedOperation();
    }

    // viewport.........................................................................................................

    viewportContextMenuItems(historyTokens, isColumnHidden, isRowHidden, history) {
        return this.viewportContextMenuItemsColumnOrRow(historyTokens, isColumnHidden, isRowHidden, history);
    }

    setAnchorConditional(anchor) {
        return this.setAnchor(anchor);
    }

    // move the begin and end column or row to the right/down by count.
    viewportInsertBeforePostSuccessSelection(count) {
        const begin = this.begin();
        const end = this.end();

        return this.setEnd(end.addSaturated(count)).setBegin(begin.addSaturated(count));
    }

    /**
     * Return the begin.viewportId().
     */
    viewportId() {
        return this.begin().viewportId();
    }

    // JSON............................................................................................................

    toJson() {
        const begin = this.begin();
        const end = this.end();
        return begin.equals(end) ?
            begin.toJson() :
            begin.toJson() + ":" + end.toJson();
    }

    selectOptionText() {
        return this.toString();
    }
}