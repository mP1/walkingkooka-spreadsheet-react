import ExpressionNumber from "./ExpressionNumber.js";
import SystemEnum from "../SystemEnum.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "expression-number-kind";

export default class ExpressionNumberKind extends SystemEnum {

    static BIG_DECIMAL = new ExpressionNumberKind("BIG_DECIMAL", "Big Decimal");
    static DOUBLE = new ExpressionNumberKind("DOUBLE", "Double");

    static fromJson(name) {
        return ExpressionNumberKind.of(name);
    }

    static of(name) {
        if(!name){
            throw new Error("Missing name");
        }

        switch(name) {
            case "BIG_DECIMAL":
                return ExpressionNumberKind.BIG_DECIMAL;
            case "DOUBLE":
                return ExpressionNumberKind.DOUBLE;
            default:
                throw new Error("Unknown name: " + name);
        }
    }

    constructor(name, label) {
        super();
        this.name = name;
        this.labelValue = label;
    }

    label() {
        return this.labelValue;
    }

    equals(other) {
        return this === other;
    }

    toJson() {
        return this.name;
    }

    typeName() {
        return TYPE_NAME;
    }

    toString() {
        return this.name;
    }
}

SystemObject.register(TYPE_NAME, ExpressionNumberKind.fromJson);
ExpressionNumber.fromJson("0"); // force registering of ExpressionNumber