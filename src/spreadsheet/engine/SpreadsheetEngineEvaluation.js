import SystemEnum from "../../SystemEnum.js";

export default class SpreadsheetEngineEvaluation extends SystemEnum {

    static valueOf(name) {
        return SystemEnum.valueOf(name, SpreadsheetEngineEvaluation.values());
    }

    static values() {
        return [
            SpreadsheetEngineEvaluation.CLEAR_VALUE_ERROR_SKIP_EVALUATE,
            SpreadsheetEngineEvaluation.SKIP_EVALUATE,
            SpreadsheetEngineEvaluation.FORCE_RECOMPUTE,
            SpreadsheetEngineEvaluation.COMPUTE_IF_NECESSARY
        ];
    }

    static CLEAR_VALUE_ERROR_SKIP_EVALUATE = new SpreadsheetEngineEvaluation("CLEAR_VALUE_ERROR_SKIP_EVALUATE", "Clear value error skip evaluate");
    static SKIP_EVALUATE = new SpreadsheetEngineEvaluation("SKIP_EVALUATE", "Skip Evaluate");
    static FORCE_RECOMPUTE = new SpreadsheetEngineEvaluation("FORCE_RECOMPUTE", "Force recompute");
    static COMPUTE_IF_NECESSARY = new SpreadsheetEngineEvaluation("COMPUTE_IF_NECESSARY", "Compute if necessary");

    constructor(name, label) {
        super(name, label);
    }
}