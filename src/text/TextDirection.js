import SystemEnum from "../SystemEnum.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "text-direction";

export default class TextDirection extends SystemEnum {

  static LTR = new TextDirection("LTR");
  static RTL = new TextDirection("RTL");
  
  static values() {
    return [
      TextDirection.LTR,
      TextDirection.RTL
    ];
  }
  
  static valueOf(name) {
    return SystemEnum.valueOf(name, TextDirection.values());
  }
  
  static fromJson(name) {
    return TextDirection.valueOf(name);
  }
  
  constructor(name) {
    super(name);
  }
  
  typeName() {
    return TYPE_NAME;
  }
  
}

SystemObject.register(TYPE_NAME, TextDirection.fromJson);
