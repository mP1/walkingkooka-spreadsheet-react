import SystemEnum from "../../SystemEnum.js";
import SystemObject from "../../SystemObject.js";

const TYPE_NAME = "format-pattern-kind";

export default class SpreadsheetCellFormatPatternKind extends SystemEnum {

    static DATE = new SpreadsheetCellFormatPatternKind("DATE");
    static DATE_TIME = new SpreadsheetCellFormatPatternKind("DATE_TIME");
    static NUMBER = new SpreadsheetCellFormatPatternKind("NUMBER");
    static TIME = new SpreadsheetCellFormatPatternKind("TIME");

    static values() {
        return [
            SpreadsheetCellFormatPatternKind.DATE,
            SpreadsheetCellFormatPatternKind.DATE_TIME,
            SpreadsheetCellFormatPatternKind.NUMBER,
            SpreadsheetCellFormatPatternKind.TIME
        ];
    }

    static valueOf(name) {
        return SystemEnum.valueOf(name, "spreadsheetCellFormatPatternKind", SpreadsheetCellFormatPatternKind.values());
    }

    static fromJson(name) {
        return SpreadsheetCellFormatPatternKind.valueOf(name);
    }

    typeName() {
        return TYPE_NAME;
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetCellFormatPatternKind.fromJson);
