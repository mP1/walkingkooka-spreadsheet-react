import LocalDateTime from "../../../datetime/LocalDateTime.js";
import SpreadsheetDateParsePatterns from "../../format/SpreadsheetDateParsePatterns.js";
import SpreadsheetMultiParseResponse from "./SpreadsheetMultiParseResponse.js";
import SpreadsheetTimeParsePatterns from "../../format/SpreadsheetTimeParsePatterns.js";
import SystemObject from "../../../SystemObject.js";
import systemObjectTesting from "../../../SystemObjectTesting.js";

function response1() {
    return SpreadsheetDateParsePatterns.fromJson("yyyy-mm-dd");
}

function response2() {
    return LocalDateTime.fromJson("2000-12-31 12:58:59")
}

function responses() {
    return [
        response1(),
        response2(),
    ];
}

function multi() {
    return new SpreadsheetMultiParseResponse(
        responses()
    );
}

systemObjectTesting(
    multi(),
    new SpreadsheetMultiParseResponse(
        [
            SpreadsheetTimeParsePatterns.fromJson("hhmss")
        ]
    ),
    SpreadsheetMultiParseResponse.fromJson,
    "Missing array",
    "spreadsheet-multi-parse-response",
    [
        response1().toJsonWithType(),
        SystemObject.toJsonWithType(response2())
    ]
);

// create...............................................................................................................

test("create missing undefined array fails", () => {
    expect(
        () => new SpreadsheetMultiParseResponse(undefined)
    ).toThrow("Missing responses");
});

test("create missing null array fails", () => {
    expect(
        () => new SpreadsheetMultiParseResponse(null)
    ).toThrow("Missing responses");
});

test("create", () => {
    const r = responses();
    check(
        new SpreadsheetMultiParseResponse(r),
        r
    );
});

test("create empty array", () => {
    const r = [];
    check(
        new SpreadsheetMultiParseResponse(r),
        r
    );
});

// fromJson.............................................................................................................

test("fromJson #2", () => {
    const r = "parsed-123";

    const multi = SpreadsheetMultiParseResponse.fromJson(
        [
            SystemObject.toJsonWithType(r)
        ]
    );

    check(
        multi,
        [r]
    );
});

// toJson...............................................................................................................

test("toJson #2", () => {
    const r1 = "response-1";
    const r2 = "response-2";

    expect(new SpreadsheetMultiParseResponse(
        [
            r1,
            r2,
        ]
    ).toJson())
        .toStrictEqual(
            [
                SystemObject.toJsonWithType(r1),
                SystemObject.toJsonWithType(r2)
            ]
        );
});

// helpers..............................................................................................................

function check(multi, responses) {
    expect(multi.responses()).toStrictEqual(responses);
}