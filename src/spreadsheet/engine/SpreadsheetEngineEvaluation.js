import SystemEnum from "../../SystemEnum.js";

export default class SpreadsheetEngineEvaluation extends SystemEnum {

    static valueOf(text) {
        if(!text){
            throw new Error("Missing text");
        }
        if(typeof text !== "string"){
            throw new Error("Expected string text got " + text);
        }

        const values = SpreadsheetEngineEvaluation.values();

        for(var i = 0; i < values.length; i++) {
            const possible = values[i];
            if(possible.value === text){
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

    static CLEAR_VALUE_ERROR_SKIP_EVALUATE = new SpreadsheetEngineEvaluation("CLEAR_VALUE_ERROR_SKIP_EVALUATE", "Clear value error skip evaludate");
    static SKIP_EVALUATE = new SpreadsheetEngineEvaluation("SKIP_EVALUATE", "Skip Evaludate");
    static FORCE_RECOMPUTE = new SpreadsheetEngineEvaluation("FORCE_RECOMPUTE", "Force recompute");
    static COMPUTE_IF_NECESSARY = new SpreadsheetEngineEvaluation("COMPUTE_IF_NECESSARY", "Compute if necessary");

    constructor(value, label) {
        super();
        this.value = value;
        this.labelValue = label;
        Object.freeze(this);
    }

    label() {
        return this.labelValue;
    }

    toString() {
        return this.value.toLowerCase().replace(/_/g, '-');
    }
}