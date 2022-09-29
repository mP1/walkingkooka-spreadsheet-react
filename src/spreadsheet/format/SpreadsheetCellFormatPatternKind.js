import SpreadsheetDateFormatPattern from "./SpreadsheetDateFormatPattern.js";
import SpreadsheetDateTimeFormatPattern from "./SpreadsheetDateTimeFormatPattern.js";
import SpreadsheetNumberFormatPattern from "./SpreadsheetNumberFormatPattern.js";
import SpreadsheetTextFormatPattern from "./SpreadsheetTextFormatPattern.js";
import SpreadsheetTimeFormatPattern from "./SpreadsheetTimeFormatPattern.js";
import SystemEnum from "../../SystemEnum.js";
import SystemObject from "../../SystemObject.js";

const TYPE_NAME = "format-pattern-kind";

export default class SpreadsheetCellFormatPatternKind extends SystemEnum {

    static DATE = new SpreadsheetCellFormatPatternKind("DATE");
    static DATE_TIME = new SpreadsheetCellFormatPatternKind("DATE_TIME");
    static NUMBER = new SpreadsheetCellFormatPatternKind("NUMBER");
    static TEXT = new SpreadsheetCellFormatPatternKind("TEXT");
    static TIME = new SpreadsheetCellFormatPatternKind("TIME");

    static values() {
        return [
            SpreadsheetCellFormatPatternKind.DATE,
            SpreadsheetCellFormatPatternKind.DATE_TIME,
            SpreadsheetCellFormatPatternKind.NUMBER,
            SpreadsheetCellFormatPatternKind.TEXT,
            SpreadsheetCellFormatPatternKind.TIME
        ];
    }

    static valueOf(name) {
        return SystemEnum.valueOf(name, "spreadsheetCellFormatPatternKind", SpreadsheetCellFormatPatternKind.values());
    }

    static fromJson(name) {
        return SpreadsheetCellFormatPatternKind.valueOf(name);
    }

    createPattern(pattern) {
        const name = this.name();
        let formatPattern;

        switch(name) {
            case "DATE":
                formatPattern = new SpreadsheetDateFormatPattern(pattern);
                break;
            case "DATE_TIME":
                formatPattern = new SpreadsheetDateTimeFormatPattern(pattern);
                break;
            case "NUMBER":
                formatPattern = new SpreadsheetNumberFormatPattern(pattern);
                break;
            case "TEXT":
                formatPattern = new SpreadsheetTextFormatPattern(pattern);
                break;
            case "TIME":
                formatPattern = new SpreadsheetTimeFormatPattern(pattern);
                break;
            default:
                SystemObject.throwUnsupportedOperation();
                break;
        }

        return formatPattern;
    }

    typeName() {
        return TYPE_NAME;
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetCellFormatPatternKind.fromJson);
