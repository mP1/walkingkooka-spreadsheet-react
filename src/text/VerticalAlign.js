import SystemEnum from "../SystemEnum.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "vertical-align";

export default class VerticalAlign extends SystemEnum {

  static TOP = new VerticalAlign("TOP");
  static MIDDLE = new VerticalAlign("MIDDLE");
  static BOTTOM = new VerticalAlign("BOTTOM");
  
  static values() {
    return [
      VerticalAlign.TOP,
      VerticalAlign.MIDDLE,
      VerticalAlign.BOTTOM
    ];
  }
  
  static valueOf(name) {
    return SystemEnum.valueOf(name, VerticalAlign.values());
  }
  
  static fromJson(name) {
    return VerticalAlign.valueOf(name);
  }
  
  constructor(name) {
    super(name);
  }
  
  typeName() {
    return TYPE_NAME;
  }
  
}

SystemObject.register(TYPE_NAME, VerticalAlign.fromJson);