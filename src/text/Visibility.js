import SystemEnum from "../SystemEnum.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "visibility";

export default class Visibility extends SystemEnum {

  static VISIBLE = new Visibility("VISIBLE");
  static HIDDEN = new Visibility("HIDDEN");
  static COLLAPSE = new Visibility("COLLAPSE");
  
  static values() {
    return [
      Visibility.VISIBLE,
      Visibility.HIDDEN,
      Visibility.COLLAPSE
    ];
  }
  
  static valueOf(name) {
    return SystemEnum.valueOf(name, Visibility.values());
  }
  
  static fromJson(name) {
    return Visibility.valueOf(name);
  }
  
  constructor(name) {
    super(name);
  }
  
  typeName() {
    return TYPE_NAME;
  }
  
}

SystemObject.register(TYPE_NAME, Visibility.fromJson);
