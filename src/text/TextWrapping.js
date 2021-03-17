import SystemEnum from "../SystemEnum.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "text-wrapping";

export default class TextWrapping extends SystemEnum {

  static OVERFLOW = new TextWrapping("OVERFLOW");
  static WRAP = new TextWrapping("WRAP");
  static CLIP = new TextWrapping("CLIP");
  
  static values() {
    return [
      TextWrapping.OVERFLOW,
      TextWrapping.WRAP,
      TextWrapping.CLIP
    ];
  }
  
  static valueOf(name) {
    return SystemEnum.valueOf(name, TextWrapping.values());
  }
  
  static fromJson(name) {
    return TextWrapping.valueOf(name);
  }
  
  constructor(name) {
    super(name);
  }
  
  typeName() {
    return TYPE_NAME;
  }
  
}

SystemObject.register(TYPE_NAME, TextWrapping.fromJson);
