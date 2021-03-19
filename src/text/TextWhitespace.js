import SystemEnum from "../SystemEnum.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "text-whitespace";

export default class TextWhitespace extends SystemEnum {

  static NORMAL = new TextWhitespace("NORMAL");
  static NOWRAP = new TextWhitespace("NOWRAP");
  static PRE = new TextWhitespace("PRE");
  static PRE_LINE = new TextWhitespace("PRE_LINE");
  static PRE_WRAP = new TextWhitespace("PRE_WRAP");
  
  static values() {
    return [
      TextWhitespace.NORMAL,
      TextWhitespace.NOWRAP,
      TextWhitespace.PRE,
      TextWhitespace.PRE_LINE,
      TextWhitespace.PRE_WRAP
    ];
  }
  
  static valueOf(name) {
    return SystemEnum.valueOf(name, TextWhitespace.values());
  }
  
  static fromJson(name) {
    return TextWhitespace.valueOf(name);
  }
  
  constructor(name) {
    super(name);
  }
  
  typeName() {
    return TYPE_NAME;
  }
  
}

SystemObject.register(TYPE_NAME, TextWhitespace.fromJson);