import SystemEnum from "../SystemEnum.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "text-decoration";

export default class TextDecoration extends SystemEnum {

  static UNDERLINE = new TextDecoration("UNDERLINE");
  static OVERLINE = new TextDecoration("OVERLINE");
  static LINE_THROUGH = new TextDecoration("LINE_THROUGH");
  
  static values() {
    return [
      TextDecoration.UNDERLINE,
      TextDecoration.OVERLINE,
      TextDecoration.LINE_THROUGH
    ];
  }
  
  static valueOf(name) {
    return SystemEnum.valueOf(name, TextDecoration.values());
  }
  
  static fromJson(name) {
    return TextDecoration.valueOf(name);
  }
  
  constructor(name) {
    super(name);
  }
  
  typeName() {
    return TYPE_NAME;
  }
  
}

SystemObject.register(TYPE_NAME, TextDecoration.fromJson);
