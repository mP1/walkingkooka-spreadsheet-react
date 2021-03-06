// generated by EnumJavaScriptSourceTool at 2021-04-03T13:17:12.649515

import SystemEnum from "../SystemEnum.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "overflow";

export default class Overflow extends SystemEnum {
  
  static VISIBLE = new Overflow("VISIBLE");
  static HIDDEN = new Overflow("HIDDEN");
  static SCROLL = new Overflow("SCROLL");
  static AUTO = new Overflow("AUTO");
  
  static values() {
    return [
      Overflow.VISIBLE,
      Overflow.HIDDEN,
      Overflow.SCROLL,
      Overflow.AUTO
    ];
  }
  
  static valueOf(name) {
    return SystemEnum.valueOf(name, Overflow.values());
  }
  
  static fromJson(name) {
    return Overflow.valueOf(name);
  }
  
  typeName() {
    return TYPE_NAME;
  }
}

SystemObject.register(TYPE_NAME, Overflow.fromJson);
