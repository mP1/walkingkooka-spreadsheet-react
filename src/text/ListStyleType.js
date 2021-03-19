import SystemEnum from "../SystemEnum.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "list-style-type";

export default class ListStyleType extends SystemEnum {

  static DISC = new ListStyleType("DISC");
  static ARMENIAN = new ListStyleType("ARMENIAN");
  static CIRCLE = new ListStyleType("CIRCLE");
  static CJK_IDEOGRAPHIC = new ListStyleType("CJK_IDEOGRAPHIC");
  static DECIMAL = new ListStyleType("DECIMAL");
  static DECIMAL_LEADING_ZERO = new ListStyleType("DECIMAL_LEADING_ZERO");
  static GEORGIAN = new ListStyleType("GEORGIAN");
  static HEBREW = new ListStyleType("HEBREW");
  static HIRAGANA = new ListStyleType("HIRAGANA");
  static HIRAGANA_IROHA = new ListStyleType("HIRAGANA_IROHA");
  static KATAKANA = new ListStyleType("KATAKANA");
  static KATAKANA_IROHA = new ListStyleType("KATAKANA_IROHA");
  static LOWER_ALPHA = new ListStyleType("LOWER_ALPHA");
  static LOWER_GREEK = new ListStyleType("LOWER_GREEK");
  static LOWER_LATIN = new ListStyleType("LOWER_LATIN");
  static LOWER_ROMAN = new ListStyleType("LOWER_ROMAN");
  static NONE = new ListStyleType("NONE");
  static SQUARE = new ListStyleType("SQUARE");
  static UPPER_ALPHA = new ListStyleType("UPPER_ALPHA");
  static UPPER_GREEK = new ListStyleType("UPPER_GREEK");
  static UPPER_LATIN = new ListStyleType("UPPER_LATIN");
  static UPPER_ROMAN = new ListStyleType("UPPER_ROMAN");
  
  static values() {
    return [
      ListStyleType.DISC,
      ListStyleType.ARMENIAN,
      ListStyleType.CIRCLE,
      ListStyleType.CJK_IDEOGRAPHIC,
      ListStyleType.DECIMAL,
      ListStyleType.DECIMAL_LEADING_ZERO,
      ListStyleType.GEORGIAN,
      ListStyleType.HEBREW,
      ListStyleType.HIRAGANA,
      ListStyleType.HIRAGANA_IROHA,
      ListStyleType.KATAKANA,
      ListStyleType.KATAKANA_IROHA,
      ListStyleType.LOWER_ALPHA,
      ListStyleType.LOWER_GREEK,
      ListStyleType.LOWER_LATIN,
      ListStyleType.LOWER_ROMAN,
      ListStyleType.NONE,
      ListStyleType.SQUARE,
      ListStyleType.UPPER_ALPHA,
      ListStyleType.UPPER_GREEK,
      ListStyleType.UPPER_LATIN,
      ListStyleType.UPPER_ROMAN
    ];
  }
  
  static valueOf(name) {
    return SystemEnum.valueOf(name, ListStyleType.values());
  }
  
  static fromJson(name) {
    return ListStyleType.valueOf(name);
  }
  
  constructor(name) {
    super(name);
  }
  
  typeName() {
    return TYPE_NAME;
  }
  
}

SystemObject.register(TYPE_NAME, ListStyleType.fromJson);