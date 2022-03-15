// generated by EnumJavaScriptSourceTool at 2022-03-15T20:21:13.475836

import SystemEnum from "../SystemEnum.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "list-style-position";

export default class ListStylePosition extends SystemEnum {
  
  static INSIDE = new ListStylePosition("INSIDE");
  static OUTSIDE = new ListStylePosition("OUTSIDE");
  
  static values() {
    return [
      ListStylePosition.INSIDE,
      ListStylePosition.OUTSIDE
    ];
  }
  
  static valueOf(name) {
    return SystemEnum.valueOf(name, "textStyle", ListStylePosition.values());
  }
  
  static fromJson(name) {
    return ListStylePosition.valueOf(name);
  }
  
  typeName() {
    return TYPE_NAME;
  }
}

SystemObject.register(TYPE_NAME, ListStylePosition.fromJson);
