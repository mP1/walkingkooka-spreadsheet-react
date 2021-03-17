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
    return SystemEnum.valueOf(name, BorderCollapse.values());
  }
  
  static fromJson(name) {
    return BorderCollapse.valueOf(name);
  }
  
  constructor(name) {
    super(name);
  }
  
  typeName() {
    return TYPE_NAME;
  }
  
}

SystemObject.register(TYPE_NAME, BorderCollapse.fromJson);
