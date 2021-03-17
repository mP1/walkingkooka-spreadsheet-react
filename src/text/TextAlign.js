import SystemEnum from "../SystemEnum.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "text-align";

export default class TextAlign extends SystemEnum {

  static LEFT = new TextAlign("LEFT");
  static RIGHT = new TextAlign("RIGHT");
  static CENTER = new TextAlign("CENTER");
  static JUSTIFY = new TextAlign("JUSTIFY");
  
  static values() {
    return [
      TextAlign.LEFT,
      TextAlign.RIGHT,
      TextAlign.CENTER,
      TextAlign.JUSTIFY
    ];
  }
  
  static valueOf(name) {
    return SystemEnum.valueOf(name, TextAlign.values());
  }
  
  static fromJson(name) {
    return TextAlign.valueOf(name);
  }
  
  constructor(name) {
    super(name);
  }
  
  typeName() {
    return TYPE_NAME;
  }
  
}

SystemObject.register(TYPE_NAME, TextAlign.fromJson);
