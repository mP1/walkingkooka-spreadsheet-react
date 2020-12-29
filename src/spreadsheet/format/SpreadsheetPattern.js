/**
 * Has no java equivalent, but rather is a generic holder of any of the patterns. Validation of the actual pattern will
 * have be done with calls to the server.
 */
export default class SpreadsheetPattern {

    static fromJson(pattern) {
        return new SpreadsheetPattern(pattern);
    }

    /**
     * Does not perform any complex analysis of the pattern, such as individual components.
     */
    static parse(pattern) {
        return new SpreadsheetPattern(pattern);
    }

    constructor(pattern) {
        if(!pattern && pattern !== ""){
            throw new Error("Missing pattern");
        }
        if(typeof pattern !== "string"){
            throw new Error("Expected string pattern got " + pattern);
        }

        this.patternValue = pattern;
    }

    pattern() {
        return this.patternValue;
    }

    toJson() {
        return this.pattern();
    }

    equals(other) {
        return this === other ||
            (other instanceof SpreadsheetPattern &&
                this.pattern() === other.pattern())
    }

    toString() {
        return this.toJson();
    }
}