// generated by EnumJavaScriptSourceTool at 2022-03-15T22:52:02.559047

import SystemEnum from "../../../SystemEnum.js";
import SystemObject from "../../../SystemObject.js";

const TYPE_NAME = "spreadsheet-viewport-anchor";

export default class SpreadsheetViewportAnchor extends SystemEnum {
  
  static NONE = new SpreadsheetViewportAnchor("NONE");
  static TOP_LEFT = new SpreadsheetViewportAnchor("TOP_LEFT");
  static TOP_RIGHT = new SpreadsheetViewportAnchor("TOP_RIGHT");
  static BOTTOM_LEFT = new SpreadsheetViewportAnchor("BOTTOM_LEFT");
  static BOTTOM_RIGHT = new SpreadsheetViewportAnchor("BOTTOM_RIGHT");
  static TOP = new SpreadsheetViewportAnchor("TOP");
  static BOTTOM = new SpreadsheetViewportAnchor("BOTTOM");
  static LEFT = new SpreadsheetViewportAnchor("LEFT");
  static RIGHT = new SpreadsheetViewportAnchor("RIGHT");
  
  static values() {
    return [
      SpreadsheetViewportAnchor.NONE,
      SpreadsheetViewportAnchor.TOP_LEFT,
      SpreadsheetViewportAnchor.TOP_RIGHT,
      SpreadsheetViewportAnchor.BOTTOM_LEFT,
      SpreadsheetViewportAnchor.BOTTOM_RIGHT,
      SpreadsheetViewportAnchor.TOP,
      SpreadsheetViewportAnchor.BOTTOM,
      SpreadsheetViewportAnchor.LEFT,
      SpreadsheetViewportAnchor.RIGHT
    ];
  }
  
  static valueOf(name) {
    return SystemEnum.valueOf(name, "anchor", SpreadsheetViewportAnchor.values());
  }
  
  static fromJson(name) {
    return SpreadsheetViewportAnchor.valueOf(name);
  }
  
  static from(text) {
    return SystemObject.from(text, "anchor", SpreadsheetViewportAnchor.value());
  }

  historyHashPath() {
      return this.nameKebabCase();
  }
  
  typeName() {
    return TYPE_NAME;
  }
}

SystemObject.register(TYPE_NAME, SpreadsheetViewportAnchor.fromJson);
