import MultiParseRequest from "./MultiParseRequest.js";
import ParseRequest from "./ParseRequest.js";
import SpreadsheetDateParsePatterns from "../../format/SpreadsheetDateParsePatterns.js";
import SpreadsheetDateTimeParsePatterns from "../../format/SpreadsheetDateTimeParsePatterns.js";
import systemObjectTesting from "../../../SystemObjectTesting.js";

function request1() {
    return request("2000/1/1", SpreadsheetDateParsePatterns.TYPE_NAME);
}

function request2() {
    return request("2000/2/2", SpreadsheetDateParsePatterns.TYPE_NAME);
}

function requests() {
    return [
        request1(),
        request2(),
    ];
}

function request(localDateTime, parser) {
    return new ParseRequest(localDateTime, parser);
}

function multi() {
    return new MultiParseRequest(
        requests()
    );
}

systemObjectTesting(
    multi(),
    new MultiParseRequest(
        [
            request("12:00:00", SpreadsheetDateTimeParsePatterns.TYPE_NAME)
        ]
    ),
    MultiParseRequest.fromJson,
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
        () => new MultiParseRequest(undefined)
    ).toThrow("Missing requests");
});

test("create missing null array fails", () => {
    expect(
        () => new MultiParseRequest(null)
    ).toThrow("Missing requests");
});

test("create", () => {
    const r = requests();
    check(
        new MultiParseRequest(r),
        r
    );
});

test("create empty array", () => {
    const r = [];
    check(
        new MultiParseRequest(r),
        r
    );
});

// helpers..............................................................................................................

function check(multi, requests) {
    expect(multi.requests()).toStrictEqual(requests);
}