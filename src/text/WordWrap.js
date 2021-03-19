import SystemEnum from "../SystemEnum.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "word-wrap";

export default class WordWrap extends SystemEnum {

  static NORMAL = new WordWrap("NORMAL");
  static BREAK_WORD = new WordWrap("BREAK_WORD");
  
  static values() {
    return [
      WordWrap.NORMAL,
      WordWrap.BREAK_WORD
    ];
  }
  
  static valueOf(name) {
    return SystemEnum.valueOf(name, WordWrap.values());
  }
  
  static fromJson(name) {
    return WordWrap.valueOf(name);
  }
  
  constructor(name) {
    super(name);
  }
  
  typeName() {
    return TYPE_NAME;
  }
  
}

SystemObject.register(TYPE_NAME, WordWrap.fromJson);