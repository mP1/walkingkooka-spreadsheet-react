import SpreadsheetSelection from "./SpreadsheetSelection.js";

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
    
    toJson() {
        const begin = this.begin();
        const end = this.end();
        return begin.equals(end) ?
            begin.toJson() :
            begin.toJson() + ":" + end.toJson();
    }

    setAnchorConditional(anchor) {
        return this.setAnchor(anchor);
    }

    selectEnter(giveFormulaFocus) {
        // ENTER currently is a NOP but will change to perhaps popup a menu
    }

    selectOptionText() {
        return this.toString();
    }
}