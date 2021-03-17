import SystemEnum from "../SystemEnum.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "text-justify";

export default class TextJustify extends SystemEnum {

  static AUTO = new TextJustify("AUTO");
  static INTER_WORD = new TextJustify("INTER_WORD");
  static INTER_CHARACTER = new TextJustify("INTER_CHARACTER");
  static NONE = new TextJustify("NONE");
  
  static values() {
    return [
      TextJustify.AUTO,
      TextJustify.INTER_WORD,
      TextJustify.INTER_CHARACTER,
      TextJustify.NONE
    ];
  }
  
  static valueOf(name) {
    return SystemEnum.valueOf(name, TextJustify.values());
  }
  
  static fromJson(name) {
    return TextJustify.valueOf(name);
  }
  
  constructor(name) {
    super(name);
  }
  
  typeName() {
    return TYPE_NAME;
  }
  
}

SystemObject.register(TYPE_NAME, TextJustify.fromJson);
