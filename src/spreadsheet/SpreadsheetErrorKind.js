// generated by EnumJavaScriptSourceTool at 2022-02-12T14:07:46.147357

import SystemEnum from "../SystemEnum.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "spreadsheet-error-kind";

export default class SpreadsheetErrorKind extends SystemEnum {
  
  static NULL = new SpreadsheetErrorKind("NULL");
  static DIV0 = new SpreadsheetErrorKind("DIV0");
  static VALUE = new SpreadsheetErrorKind("VALUE");
  static REF = new SpreadsheetErrorKind("REF");
  static NAME = new SpreadsheetErrorKind("NAME");
  static NUM = new SpreadsheetErrorKind("NUM");
  static NA = new SpreadsheetErrorKind("NA");
  static SPILL = new SpreadsheetErrorKind("SPILL");
  static CALC = new SpreadsheetErrorKind("CALC");
  
  static values() {
    return [
      SpreadsheetErrorKind.NULL,
      SpreadsheetErrorKind.DIV0,
      SpreadsheetErrorKind.VALUE,
      SpreadsheetErrorKind.REF,
      SpreadsheetErrorKind.NAME,
      SpreadsheetErrorKind.NUM,
      SpreadsheetErrorKind.NA,
      SpreadsheetErrorKind.SPILL,
      SpreadsheetErrorKind.CALC
    ];
  }
  
  static valueOf(name) {
    return SystemEnum.valueOf(name, SpreadsheetErrorKind.values());
  }
  
  static fromJson(name) {
    return SpreadsheetErrorKind.valueOf(name);
  }
  
  typeName() {
    return TYPE_NAME;
  }
}

SystemObject.register(TYPE_NAME, SpreadsheetErrorKind.fromJson);
