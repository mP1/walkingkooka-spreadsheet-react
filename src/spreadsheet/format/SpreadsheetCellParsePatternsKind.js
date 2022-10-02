import SpreadsheetDateFormatPattern from "./SpreadsheetDateFormatPattern.js";
import SpreadsheetDateTimeFormatPattern from "./SpreadsheetDateTimeFormatPattern.js";
import SpreadsheetNumberFormatPattern from "./SpreadsheetNumberFormatPattern.js";
import SpreadsheetTimeFormatPattern from "./SpreadsheetTimeFormatPattern.js";
import SystemEnum from "../../SystemEnum.js";
import SystemObject from "../../SystemObject.js";

const TYPE_NAME = "parse-patterns-kind";

export default class SpreadsheetCellParsePatternsKind extends SystemEnum {

    static DATE = new SpreadsheetCellParsePatternsKind("DATE");
    static DATE_TIME = new SpreadsheetCellParsePatternsKind("DATE_TIME");
    static NUMBER = new SpreadsheetCellParsePatternsKind("NUMBER");
    static TIME = new SpreadsheetCellParsePatternsKind("TIME");

    static values() {
        return [
            SpreadsheetCellParsePatternsKind.DATE,
            SpreadsheetCellParsePatternsKind.DATE_TIME,
            SpreadsheetCellParsePatternsKind.NUMBER,
            SpreadsheetCellParsePatternsKind.TIME
        ];
    }

    static valueOf(name) {
        return SystemEnum.valueOf(name, "SpreadsheetCellParsePatternsKind", SpreadsheetCellParsePatternsKind.values());
    }

    static fromJson(name) {
        return SpreadsheetCellParsePatternsKind.valueOf(name);
    }

    createPattern(pattern) {
        const name = this.name();
        let parsePatterns;

        switch(name) {
            case "DATE":
                parsePatterns = new SpreadsheetDateFormatPattern(pattern);
                break;
            case "DATE_TIME":
                parsePatterns = new SpreadsheetDateTimeFormatPattern(pattern);
                break;
            case "NUMBER":
                parsePatterns = new SpreadsheetNumberFormatPattern(pattern);
                break;
            case "TIME":
                parsePatterns = new SpreadsheetTimeFormatPattern(pattern);
                break;
            default:
                SystemObject.throwUnsupportedOperation();
                break;
        }

        return parsePatterns;
    }

    typeName() {
        return TYPE_NAME;
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetCellParsePatternsKind.fromJson);
