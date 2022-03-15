import SystemEnum from "../../SystemEnum.js";

const TYPE_NAME = "spreadsheet-reference-kind";

export default class SpreadsheetReferenceKind extends SystemEnum {

    static ABSOLUTE = new SpreadsheetReferenceKind("ABSOLUTE", "Absolute");
    static RELATIVE = new SpreadsheetReferenceKind("RELATIVE", "Relative");

    static values() {
        return [
            SpreadsheetReferenceKind.ABSOLUTE,
            SpreadsheetReferenceKind.RELATIVE,
        ];
    }

    static valueOf(name) {
        return SystemEnum.valueOf(name, "SpreadsheetReferenceKind", SpreadsheetReferenceKind.values());
    }

    static fromJson(name) {
        return SpreadsheetReferenceKind.valueOf(name);
    }

    prefix() {
        return SpreadsheetReferenceKind.ABSOLUTE === this ?
            "$" :
            "";
    }

    typeName() {
        return TYPE_NAME;
    }
}