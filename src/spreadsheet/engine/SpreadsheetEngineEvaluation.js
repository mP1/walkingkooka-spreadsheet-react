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

    static CLEAR_VALUE_ERROR_SKIP_EVALUATE = new SpreadsheetEngineEvaluation("CLEAR_VALUE_ERROR_SKIP_EVALUATE");
    static SKIP_EVALUATE = new SpreadsheetEngineEvaluation("SKIP_EVALUATE");
    static FORCE_RECOMPUTE = new SpreadsheetEngineEvaluation("FORCE_RECOMPUTE");
    static COMPUTE_IF_NECESSARY = new SpreadsheetEngineEvaluation("COMPUTE_IF_NECESSARY");

    constructor(name) {
        super(name);
    }
}