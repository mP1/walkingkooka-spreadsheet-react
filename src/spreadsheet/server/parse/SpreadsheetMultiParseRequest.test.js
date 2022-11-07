import SpreadsheetDateParsePattern from "../../format/SpreadsheetDateParsePattern.js";
import SpreadsheetDateTimeParsePattern from "../../format/SpreadsheetDateTimeParsePattern.js";
import SpreadsheetMultiParseRequest from "./SpreadsheetMultiParseRequest.js";
import SpreadsheetParseRequest from "./SpreadsheetParseRequest.js";
import systemObjectTesting from "../../../SystemObjectTesting.js";

function request1() {
    return request("2000/1/1", SpreadsheetDateParsePattern.TYPE_NAME);
}

function request2() {
    return request("2000/2/2", SpreadsheetDateParsePattern.TYPE_NAME);
}

function requests() {
    return [
        request1(),
        request2(),
    ];
}

function request(localDateTime, parser) {
    return new SpreadsheetParseRequest(localDateTime, parser);
}

function multi() {
    return new SpreadsheetMultiParseRequest(
        requests()
    );
}

systemObjectTesting(
    multi(),
    new SpreadsheetMultiParseRequest(
        [
            request("12:00:00", SpreadsheetDateTimeParsePattern.TYPE_NAME)
        ]
    ),
    SpreadsheetMultiParseRequest.fromJson,
    "Missing array",
    "spreadsheet-multi-parse-request",
    [
        request1().toJsonWithType(),
        request2().toJsonWithType()
    ]
);

// create...............................................................................................................

test("create missing undefined array fails", () => {
    expect(
        () => new SpreadsheetMultiParseRequest(undefined)
    ).toThrow("Missing requests");
});

test("create missing null array fails", () => {
    expect(
        () => new SpreadsheetMultiParseRequest(null)
    ).toThrow("Missing requests");
});

test("create", () => {
    const r = requests();
    check(
        new SpreadsheetMultiParseRequest(r),
        r
    );
});

test("create empty array", () => {
    const r = [];
    check(
        new SpreadsheetMultiParseRequest(r),
        r
    );
});

// helpers..............................................................................................................

function check(multi, requests) {
    expect(multi.requests()).toStrictEqual(requests);
}