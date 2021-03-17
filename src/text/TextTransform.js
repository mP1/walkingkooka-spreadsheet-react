import SystemEnum from "../SystemEnum.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "text-transform";

export default class TextTransform extends SystemEnum {

  static NONE = new TextTransform("NONE");
  static CAPITALIZE = new TextTransform("CAPITALIZE");
  static UPPERCASE = new TextTransform("UPPERCASE");
  static LOWERCASE = new TextTransform("LOWERCASE");
  
  static values() {
    return [
      TextTransform.NONE,
      TextTransform.CAPITALIZE,
      TextTransform.UPPERCASE,
      TextTransform.LOWERCASE
    ];
  }
  
  static valueOf(name) {
    return SystemEnum.valueOf(name, TextTransform.values());
  }
  
  static fromJson(name) {
    return TextTransform.valueOf(name);
  }
  
  constructor(name) {
    super(name);
  }
  
  typeName() {
    return TYPE_NAME;
  }
  
}

SystemObject.register(TYPE_NAME, TextTransform.fromJson);
