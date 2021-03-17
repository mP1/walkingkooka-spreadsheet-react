import SystemEnum from "../SystemEnum.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "word-break";

export default class WordBreak extends SystemEnum {

  static NORMAL = new WordBreak("NORMAL");
  static BREAK_ALL = new WordBreak("BREAK_ALL");
  static KEEP_ALL = new WordBreak("KEEP_ALL");
  static BREAK_WORD = new WordBreak("BREAK_WORD");
  
  static values() {
    return [
      WordBreak.NORMAL,
      WordBreak.BREAK_ALL,
      WordBreak.KEEP_ALL,
      WordBreak.BREAK_WORD
    ];
  }
  
  static valueOf(name) {
    return SystemEnum.valueOf(name, WordBreak.values());
  }
  
  static fromJson(name) {
    return WordBreak.valueOf(name);
  }
  
  constructor(name) {
    super(name);
  }
  
  typeName() {
    return TYPE_NAME;
  }
  
}

SystemObject.register(TYPE_NAME, WordBreak.fromJson);
