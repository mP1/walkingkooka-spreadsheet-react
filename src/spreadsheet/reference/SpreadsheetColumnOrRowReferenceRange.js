import SpreadsheetSelection from "./SpreadsheetSelection.js";

/**
 * Base class for both column or row ranges.
 */
export default class SpreadsheetColumnOrRowReferenceRange extends SpreadsheetSelection {

    constructor(begin, end) {
        super();
        this.beginValue = begin;
        this.endValue = end;
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
}