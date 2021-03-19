import SystemEnum from "../SystemEnum.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "font-variant";

export default class FontVariant extends SystemEnum {

  static NORMAL = new FontVariant("NORMAL");
  static SMALL_CAPS = new FontVariant("SMALL_CAPS");
  static INITIAL = new FontVariant("INITIAL");
  
  static values() {
    return [
      FontVariant.NORMAL,
      FontVariant.SMALL_CAPS,
      FontVariant.INITIAL
    ];
  }
  
  static valueOf(name) {
    return SystemEnum.valueOf(name, FontVariant.values());
  }
  
  static fromJson(name) {
    return FontVariant.valueOf(name);
  }
  
  constructor(name) {
    super(name);
  }
  
  typeName() {
    return TYPE_NAME;
  }
  
}

SystemObject.register(TYPE_NAME, FontVariant.fromJson);