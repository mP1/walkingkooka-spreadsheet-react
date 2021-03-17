import SystemEnum from "../SystemEnum.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "font-stretch";

export default class FontStretch extends SystemEnum {

  static ULTRA_CONDENSED = new FontStretch("ULTRA_CONDENSED");
  static EXTRA_CONDENSED = new FontStretch("EXTRA_CONDENSED");
  static CONDENSED = new FontStretch("CONDENSED");
  static SEMI_CONDENSED = new FontStretch("SEMI_CONDENSED");
  static NORMAL = new FontStretch("NORMAL");
  static SEMI_EXPANDED = new FontStretch("SEMI_EXPANDED");
  static EXPANDED = new FontStretch("EXPANDED");
  static EXTRA_EXPANDED = new FontStretch("EXTRA_EXPANDED");
  static ULTRA_EXPANDED = new FontStretch("ULTRA_EXPANDED");
  
  static values() {
    return [
      FontStretch.ULTRA_CONDENSED,
      FontStretch.EXTRA_CONDENSED,
      FontStretch.CONDENSED,
      FontStretch.SEMI_CONDENSED,
      FontStretch.NORMAL,
      FontStretch.SEMI_EXPANDED,
      FontStretch.EXPANDED,
      FontStretch.EXTRA_EXPANDED,
      FontStretch.ULTRA_EXPANDED
    ];
  }
  
  static valueOf(name) {
    return SystemEnum.valueOf(name, FontStretch.values());
  }
  
  static fromJson(name) {
    return FontStretch.valueOf(name);
  }
  
  constructor(name) {
    super(name);
  }
  
  typeName() {
    return TYPE_NAME;
  }
  
}

SystemObject.register(TYPE_NAME, FontStretch.fromJson);
