// generated by EnumJavaScriptSourceTool at 2022-03-15T20:21:13.462045

import SystemEnum from "../SystemEnum.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "border-collapse";

export default class BorderCollapse extends SystemEnum {
  
  static SEPARATE = new BorderCollapse("SEPARATE");
  static COLLAPSE = new BorderCollapse("COLLAPSE");
  
  static values() {
    return [
      BorderCollapse.SEPARATE,
      BorderCollapse.COLLAPSE
    ];
  }
  
  static valueOf(name) {
    return SystemEnum.valueOf(name, "textStyle", BorderCollapse.values());
  }
  
  static fromJson(name) {
    return BorderCollapse.valueOf(name);
  }
  
  typeName() {
    return TYPE_NAME;
  }
}

SystemObject.register(TYPE_NAME, BorderCollapse.fromJson);
