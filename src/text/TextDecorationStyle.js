import SystemEnum from "../SystemEnum.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "text-decoration-style";

export default class TextDecorationStyle extends SystemEnum {

  static SOLID = new TextDecorationStyle("SOLID");
  static DOUBLE = new TextDecorationStyle("DOUBLE");
  static DOTTED = new TextDecorationStyle("DOTTED");
  static DASHED = new TextDecorationStyle("DASHED");
  static WAVY = new TextDecorationStyle("WAVY");
  
  static values() {
    return [
      TextDecorationStyle.SOLID,
      TextDecorationStyle.DOUBLE,
      TextDecorationStyle.DOTTED,
      TextDecorationStyle.DASHED,
      TextDecorationStyle.WAVY
    ];
  }
  
  static valueOf(name) {
    return SystemEnum.valueOf(name, TextDecorationStyle.values());
  }
  
  static fromJson(name) {
    return TextDecorationStyle.valueOf(name);
  }
  
  constructor(name) {
    super(name);
  }
  
  typeName() {
    return TYPE_NAME;
  }
  
}

SystemObject.register(TYPE_NAME, TextDecorationStyle.fromJson);
