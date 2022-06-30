/**
 * Has no java equivalent, but rather is a generic holder of any of the patterns. Validation of the actual pattern will
 * have be done with calls to the server.
 */
import Preconditions from "../../Preconditions.js";
import SystemObject from "../../SystemObject.js";

export default class SpreadsheetPattern extends SystemObject {

    constructor(pattern) {
        super();
        Preconditions.requireText(pattern, "pattern");

        this.patternValue = pattern;
    }

    pattern() {
        return this.patternValue;
    }

    toJson() {
        return this.pattern();
    }

    equals(other) {
        return other instanceof this.constructor &&
                this.pattern() === other.pattern();
    }

    toString() {
        return this.toJson();
    }
}