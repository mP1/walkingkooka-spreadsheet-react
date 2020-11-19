export default class SpreadsheetEngineEvaluation {

    static valueOf(text) {
        if (!text) {
            throw new Error("Missing text");
        }
        if (typeof text !== "string") {
            throw new Error("Expected string text got " + text);
        }

        const values = SpreadsheetEngineEvaluation.values();

        for (var i = 0; i < values.length; i++) {
            const possible = values[i];
            if (possible.value === text) {
                return possible;
            }
        }
        throw new Error("Unknown enum got " + text);
    }

    static values() {
        return [
            SpreadsheetEngineEvaluation.CLEAR_VALUE_ERROR_SKIP_EVALUATE,
            SpreadsheetEngineEvaluation.SKIP_EVALUATE,
            SpreadsheetEngineEvaluation.FORCE_RECOMPUTE,
            SpreadsheetEngineEvaluation.COMPUTE_IF_NECESSARY
        ];
    }

    static CLEAR_VALUE_ERROR_SKIP_EVALUATE = new SpreadsheetEngineEvaluation("CLEAR_VALUE_ERROR_SKIP_EVALUATE");
    static SKIP_EVALUATE = new SpreadsheetEngineEvaluation("SKIP_EVALUATE");
    static FORCE_RECOMPUTE = new SpreadsheetEngineEvaluation("FORCE_RECOMPUTE");
    static COMPUTE_IF_NECESSARY = new SpreadsheetEngineEvaluation("COMPUTE_IF_NECESSARY");

    constructor(value) {
        this.value = value;
        Object.freeze(this);
    }

    toString() {
        return this.value;
    }
}