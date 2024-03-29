// generated by EnumJavaScriptSourceTool at 2022-09-29T19:48:01.180055

import SystemEnum from "../SystemEnum.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "border-style";

export default class BorderStyle extends SystemEnum {
  
  static NONE = new BorderStyle("NONE");
  static HIDDEN = new BorderStyle("HIDDEN");
  static DOTTED = new BorderStyle("DOTTED");
  static DASHED = new BorderStyle("DASHED");
  static SOLID = new BorderStyle("SOLID");
  static DOUBLE = new BorderStyle("DOUBLE");
  static GROOVE = new BorderStyle("GROOVE");
  static RIDGE = new BorderStyle("RIDGE");
  static INSET = new BorderStyle("INSET");
  static OUTSET = new BorderStyle("OUTSET");
  
  static values() {
    return [
      BorderStyle.NONE,
      BorderStyle.HIDDEN,
      BorderStyle.DOTTED,
      BorderStyle.DASHED,
      BorderStyle.SOLID,
      BorderStyle.DOUBLE,
      BorderStyle.GROOVE,
      BorderStyle.RIDGE,
      BorderStyle.INSET,
      BorderStyle.OUTSET
    ];
  }
  
  static valueOf(name) {
    return SystemEnum.valueOf(name, "BorderStyle", BorderStyle.values());
  }
  
  static fromJson(name) {
    return BorderStyle.valueOf(name);
  }
  
  typeName() {
    return TYPE_NAME;
  }
}

SystemObject.register(TYPE_NAME, BorderStyle.fromJson);
