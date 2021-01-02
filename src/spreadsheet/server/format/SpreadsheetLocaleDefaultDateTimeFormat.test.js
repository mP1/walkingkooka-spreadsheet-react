import SpreadsheetLocaleDefaultDateTimeFormat from "./SpreadsheetLocaleDefaultDateTimeFormat.js";
import systemObjectTesting from "../../../SystemObjectTesting.js";

systemObjectTesting(
    SpreadsheetLocaleDefaultDateTimeFormat.INSTANCE,
    "different",
    SpreadsheetLocaleDefaultDateTimeFormat.fromJson,
    "Missing json",
    "spreadsheet-locale-default-date-time-format",
    1
);

// toString.............................................................................................................

test("toString", () => {
    expect(
        SpreadsheetLocaleDefaultDateTimeFormat.INSTANCE.toString()
    ).toStrictEqual("SpreadsheetLocaleDefaultDateTimeFormat");
});

