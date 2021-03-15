import ExpressionNumber from "./ExpressionNumber.js";
import SystemEnum from "../SystemEnum.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "expression-number-kind";

export default class ExpressionNumberKind extends SystemEnum {

    static BIG_DECIMAL = new ExpressionNumberKind("BIG_DECIMAL", "Big Decimal");
    static DOUBLE = new ExpressionNumberKind("DOUBLE", "Double");

    static valueOf(name) {
        return SystemEnum.valueOf(name, ExpressionNumberKind.values());
    }

    static values() {
        return [
            ExpressionNumberKind.BIG_DECIMAL,
            ExpressionNumberKind.DOUBLE,
        ];
    }

    static fromJson(name) {
        return ExpressionNumberKind.valueOf(name);
    }

    constructor(name, label) {
        super(name, label);
    }

    typeName() {
        return TYPE_NAME;
    }
}

SystemObject.register(TYPE_NAME, ExpressionNumberKind.fromJson);
ExpressionNumber.fromJson("0"); // force registering of ExpressionNumber