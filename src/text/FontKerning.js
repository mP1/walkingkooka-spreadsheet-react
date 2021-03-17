import SystemEnum from "../SystemEnum.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "font-kerning";

export default class FontKerning extends SystemEnum {

  static AUTO = new FontKerning("AUTO");
  static NORMAL = new FontKerning("NORMAL");
  static NONE = new FontKerning("NONE");
  
  static values() {
    return [
      FontKerning.AUTO,
      FontKerning.NORMAL,
      FontKerning.NONE
    ];
  }
  
  static valueOf(name) {
    return SystemEnum.valueOf(name, FontKerning.values());
  }
  
  static fromJson(name) {
    return FontKerning.valueOf(name);
  }
  
  constructor(name) {
    super(name);
  }
  
  typeName() {
    return TYPE_NAME;
  }
  
}

SystemObject.register(TYPE_NAME, FontKerning.fromJson);
