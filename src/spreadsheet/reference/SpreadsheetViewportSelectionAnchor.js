// generated by EnumJavaScriptSourceTool at 2022-03-15T22:05:20.765386

import SystemEnum from "../SystemEnum.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "spreadsheet-viewport-selection-anchor";

export default class SpreadsheetViewportSelectionAnchor extends SystemEnum {
  
  static NONE = new SpreadsheetViewportSelectionAnchor("NONE");
  static TOP_LEFT = new SpreadsheetViewportSelectionAnchor("TOP_LEFT");
  static TOP_RIGHT = new SpreadsheetViewportSelectionAnchor("TOP_RIGHT");
  static BOTTOM_LEFT = new SpreadsheetViewportSelectionAnchor("BOTTOM_LEFT");
  static BOTTOM_RIGHT = new SpreadsheetViewportSelectionAnchor("BOTTOM_RIGHT");
  static TOP = new SpreadsheetViewportSelectionAnchor("TOP");
  static BOTTOM = new SpreadsheetViewportSelectionAnchor("BOTTOM");
  static LEFT = new SpreadsheetViewportSelectionAnchor("LEFT");
  static RIGHT = new SpreadsheetViewportSelectionAnchor("RIGHT");
  
  static values() {
    return [
      SpreadsheetViewportSelectionAnchor.NONE,
      SpreadsheetViewportSelectionAnchor.TOP_LEFT,
      SpreadsheetViewportSelectionAnchor.TOP_RIGHT,
      SpreadsheetViewportSelectionAnchor.BOTTOM_LEFT,
      SpreadsheetViewportSelectionAnchor.BOTTOM_RIGHT,
      SpreadsheetViewportSelectionAnchor.TOP,
      SpreadsheetViewportSelectionAnchor.BOTTOM,
      SpreadsheetViewportSelectionAnchor.LEFT,
      SpreadsheetViewportSelectionAnchor.RIGHT
    ];
  }
  
  static valueOf(name) {
    return SystemEnum.valueOf(name, "anchor", SpreadsheetViewportSelectionAnchor.values());
  }
  
  static fromJson(name) {
    return SpreadsheetViewportSelectionAnchor.valueOf(name);
  }
  
  static from(text) {
    return SystemObject.from(text, "anchor", SpreadsheetViewportSelectionAnchor.value());
  }
  
  typeName() {
    return TYPE_NAME;
  }
}

SystemObject.register(TYPE_NAME, SpreadsheetViewportSelectionAnchor.fromJson);
