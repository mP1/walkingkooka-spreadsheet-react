import SpreadsheetDateParsePattern from "./SpreadsheetDateParsePattern.js";
import SpreadsheetDateTimeParsePattern from "./SpreadsheetDateTimeParsePattern.js";
import SpreadsheetNumberParsePattern from "./SpreadsheetNumberParsePattern.js";
import SpreadsheetTimeParsePattern from "./SpreadsheetTimeParsePattern.js";
import SystemEnum from "../../SystemEnum.js";
import SystemObject from "../../SystemObject.js";

const TYPE_NAME = "parse-pattern-kind";

export default class SpreadsheetCellParsePatternKind extends SystemEnum {

    static DATE = new SpreadsheetCellParsePatternKind("DATE");
    static DATE_TIME = new SpreadsheetCellParsePatternKind("DATE_TIME");
    static NUMBER = new SpreadsheetCellParsePatternKind("NUMBER");
    static TIME = new SpreadsheetCellParsePatternKind("TIME");

    static values() {
        return [
            SpreadsheetCellParsePatternKind.DATE,
            SpreadsheetCellParsePatternKind.DATE_TIME,
            SpreadsheetCellParsePatternKind.NUMBER,
            SpreadsheetCellParsePatternKind.TIME
        ];
    }

    static valueOf(name) {
        return SystemEnum.valueOf(name, "SpreadsheetCellParsePatternKind", SpreadsheetCellParsePatternKind.values());
    }

    static fromJson(name) {
        return SpreadsheetCellParsePatternKind.valueOf(name);
    }

    createPattern(pattern) {
        const name = this.name();
        let parsePattern;

        switch(name) {
            case "DATE":
                parsePattern = new SpreadsheetDateParsePattern(pattern);
                break;
            case "DATE_TIME":
                parsePattern = new SpreadsheetDateTimeParsePattern(pattern);
                break;
            case "NUMBER":
                parsePattern = new SpreadsheetNumberParsePattern(pattern);
                break;
            case "TIME":
                parsePattern = new SpreadsheetTimeParsePattern(pattern);
                break;
            default:
                SystemObject.throwUnsupportedOperation();
                break;
        }

        return parsePattern;
    }

    typeName() {
        return TYPE_NAME;
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetCellParsePatternKind.fromJson);
