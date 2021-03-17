import SystemEnum from "../SystemEnum.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "hanging-punctuation";

export default class HangingPunctuation extends SystemEnum {

  static NONE = new HangingPunctuation("NONE");
  static FIRST = new HangingPunctuation("FIRST");
  static LAST = new HangingPunctuation("LAST");
  static ALLOW_END = new HangingPunctuation("ALLOW_END");
  static FORCE_END = new HangingPunctuation("FORCE_END");
  
  static values() {
    return [
      HangingPunctuation.NONE,
      HangingPunctuation.FIRST,
      HangingPunctuation.LAST,
      HangingPunctuation.ALLOW_END,
      HangingPunctuation.FORCE_END
    ];
  }
  
  static valueOf(name) {
    return SystemEnum.valueOf(name, HangingPunctuation.values());
  }
  
  static fromJson(name) {
    return HangingPunctuation.valueOf(name);
  }
  
  constructor(name) {
    super(name);
  }
  
  typeName() {
    return TYPE_NAME;
  }
  
}

SystemObject.register(TYPE_NAME, HangingPunctuation.fromJson);
