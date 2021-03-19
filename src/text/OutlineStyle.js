import SystemEnum from "../SystemEnum.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "outline-style";

export default class OutlineStyle extends SystemEnum {

  static NONE = new OutlineStyle("NONE");
  static HIDDEN = new OutlineStyle("HIDDEN");
  static DOTTED = new OutlineStyle("DOTTED");
  static DASHED = new OutlineStyle("DASHED");
  static SOLID = new OutlineStyle("SOLID");
  static DOUBLE = new OutlineStyle("DOUBLE");
  static GROOVE = new OutlineStyle("GROOVE");
  static RIDGE = new OutlineStyle("RIDGE");
  static INSET = new OutlineStyle("INSET");
  static OUTSET = new OutlineStyle("OUTSET");
  
  static values() {
    return [
      OutlineStyle.NONE,
      OutlineStyle.HIDDEN,
      OutlineStyle.DOTTED,
      OutlineStyle.DASHED,
      OutlineStyle.SOLID,
      OutlineStyle.DOUBLE,
      OutlineStyle.GROOVE,
      OutlineStyle.RIDGE,
      OutlineStyle.INSET,
      OutlineStyle.OUTSET
    ];
  }
  
  static valueOf(name) {
    return SystemEnum.valueOf(name, OutlineStyle.values());
  }
  
  static fromJson(name) {
    return OutlineStyle.valueOf(name);
  }
  
  constructor(name) {
    super(name);
  }
  
  typeName() {
    return TYPE_NAME;
  }
  
}

SystemObject.register(TYPE_NAME, OutlineStyle.fromJson);