import SystemEnum from "../SystemEnum.js";
import SystemObject from "../SystemObject.js";
import ExpressionNumber from "./ExpressionNumber.js";

const TYPE_NAME = "expression-number-kind";

export default class ExpressionNumberKind extends SystemEnum {

  static BIG_DECIMAL = new ExpressionNumberKind("BIG_DECIMAL");
  static DOUBLE = new ExpressionNumberKind("DOUBLE");
  
  static values() {
    return [
      ExpressionNumberKind.BIG_DECIMAL,
      ExpressionNumberKind.DOUBLE
    ];
  }
  
  static valueOf(name) {
    return SystemEnum.valueOf(name, ExpressionNumberKind.values());
  }
  
  static fromJson(name) {
    return ExpressionNumberKind.valueOf(name);
  }
  
  constructor(name) {
    super(name);
  }
  
  typeName() {
    return TYPE_NAME;
  }
  
}

SystemObject.register(TYPE_NAME, ExpressionNumberKind.fromJson);
ExpressionNumber.fromJson("0"); // force registering of ExpressionNumber
