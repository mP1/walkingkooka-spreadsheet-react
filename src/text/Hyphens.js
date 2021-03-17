import SystemEnum from "../SystemEnum.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "hyphens";

export default class Hyphens extends SystemEnum {

  static NONE = new Hyphens("NONE");
  static MANUAL = new Hyphens("MANUAL");
  static AUTO = new Hyphens("AUTO");
  
  static values() {
    return [
      Hyphens.NONE,
      Hyphens.MANUAL,
      Hyphens.AUTO
    ];
  }
  
  static valueOf(name) {
    return SystemEnum.valueOf(name, Hyphens.values());
  }
  
  static fromJson(name) {
    return Hyphens.valueOf(name);
  }
  
  constructor(name) {
    super(name);
  }
  
  typeName() {
    return TYPE_NAME;
  }
  
}

SystemObject.register(TYPE_NAME, Hyphens.fromJson);
