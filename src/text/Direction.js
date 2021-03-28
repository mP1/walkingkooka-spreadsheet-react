import SystemEnum from "../SystemEnum.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "direction";

export default class Direction extends SystemEnum {

  static LTR = new Direction("LTR");
  static RTL = new Direction("RTL");
  
  static values() {
    return [
      Direction.LTR,
      Direction.RTL
    ];
  }
  
  static valueOf(name) {
    return SystemEnum.valueOf(name, Direction.values());
  }
  
  static fromJson(name) {
    return Direction.valueOf(name);
  }
  
  constructor(name) {
    super(name);
  }
  
  typeName() {
    return TYPE_NAME;
  }
  
}

SystemObject.register(TYPE_NAME, Direction.fromJson);
