// generated by EnumJavaScriptSourceTool at 2022-03-15T20:21:12.976385

import SystemEnum from "../SystemEnum.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "rounding-mode";

export default class RoundingMode extends SystemEnum {
  
  static UP = new RoundingMode("UP");
  static DOWN = new RoundingMode("DOWN");
  static CEILING = new RoundingMode("CEILING");
  static FLOOR = new RoundingMode("FLOOR");
  static HALF_UP = new RoundingMode("HALF_UP");
  static HALF_DOWN = new RoundingMode("HALF_DOWN");
  static HALF_EVEN = new RoundingMode("HALF_EVEN");
  static UNNECESSARY = new RoundingMode("UNNECESSARY");
  
  static values() {
    return [
      RoundingMode.UP,
      RoundingMode.DOWN,
      RoundingMode.CEILING,
      RoundingMode.FLOOR,
      RoundingMode.HALF_UP,
      RoundingMode.HALF_DOWN,
      RoundingMode.HALF_EVEN,
      RoundingMode.UNNECESSARY
    ];
  }
  
  static valueOf(name) {
    return SystemEnum.valueOf(name, "RoundingMode", RoundingMode.values());
  }
  
  static fromJson(name) {
    return RoundingMode.valueOf(name);
  }
  
  typeName() {
    return TYPE_NAME;
  }
}

SystemObject.register(TYPE_NAME, RoundingMode.fromJson);
