import SystemObject from "../../SystemObject.js";

export default class SpreadsheetColumnOrRow extends SystemObject {

    constructor(reference, hidden) {
        super();

        this.referenceValue = reference;
        this.hiddenValue = hidden;
    }

    reference() {
        return this.referenceValue;
    }

    hidden() {
        return this.hiddenValue;
    }

    equals(other) {
        return super.equals(other) &&
            this.reference().equals(other.reference()) &&
            this.hidden() === other.hidden();
    }
}