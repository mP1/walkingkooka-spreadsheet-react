// generated by EnumJavaScriptSourceTool at 2021-08-12T21:01:17.100355

import SystemEnum from "../../SystemEnum.js";
import SystemObject from "../../SystemObject.js";

const TYPE_NAME = "spreadsheet-viewport-selection-anchor";

export default class SpreadsheetViewportSelectionAnchor extends SystemEnum {
  
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
    return SystemEnum.valueOf(name, SpreadsheetViewportSelectionAnchor.values());
  }
  
  static fromJson(name) {
    return SpreadsheetViewportSelectionAnchor.valueOf(name);
  }

  /**
   * TOP_LEFT -> top-left, TOP_RIGHT -> top-right
   */
  toHistoryHashToken() {
    return this.name()
        .toLowerCase()
        .replace("_", "-")
  }
  
  typeName() {
    return TYPE_NAME;
  }
}

SystemObject.register(TYPE_NAME, SpreadsheetViewportSelectionAnchor.fromJson);
