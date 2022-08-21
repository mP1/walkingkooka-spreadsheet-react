import SpreadsheetDateTimeParsePatterns from "../format/SpreadsheetDateTimeParsePatterns.js";
import SpreadsheetMetadata from "../meta/SpreadsheetMetadata.js";
import SpreadsheetSettingsWidgetHistoryHashTokens from "./SpreadsheetSettingsWidgetHistoryHashTokens";

// parseHistoryHashToken....................................................................................................

test("parseHistoryHashToken invalid property fails", () => {
    expect(
        () => SpreadsheetSettingsWidgetHistoryHashTokens.parseHistoryHashToken("!invalid", "abc123")
    ).toThrow("Unknown property \"!invalid\"");
});

test("parseHistoryHashToken non text value fails", () => {
    expect(
        () => SpreadsheetSettingsWidgetHistoryHashTokens.parseHistoryHashToken(SpreadsheetMetadata.CELL_CHARACTER_WIDTH, 123)
    ).toThrow("Expected string token got 123");
});

function testParseHistoryHashToken(propertyName, value, expected) {
    test("parseHistoryHashToken " + propertyName + "=" + value, () => {
        expect(
            SpreadsheetSettingsWidgetHistoryHashTokens.parseHistoryHashToken(propertyName, value)
        ).toStrictEqual(expected);
    });
}

testParseHistoryHashToken(SpreadsheetMetadata.CURRENCY_SYMBOL, "AUD", "AUD");
testParseHistoryHashToken(SpreadsheetMetadata.DATETIME_OFFSET, "123", 123);
testParseHistoryHashToken(SpreadsheetMetadata.DATETIME_PARSE_PATTERNS, "yy%2Fmm%2Fdd", new SpreadsheetDateTimeParsePatterns("yy/mm/dd"));
testParseHistoryHashToken(SpreadsheetMetadata.POSITIVE_SIGN, "+", "+");
testParseHistoryHashToken(SpreadsheetMetadata.TWO_DIGIT_YEAR, "20", 20);
