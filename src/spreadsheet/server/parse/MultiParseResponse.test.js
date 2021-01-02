import LocalDateTime from "../../../datetime/LocalDateTime.js";
import MultiParseResponse from "./MultiParseResponse.js";
import SpreadsheetDateParsePatterns from "../../format/SpreadsheetDateParsePatterns.js";
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
    return new MultiParseResponse(
        responses()
    );
}

systemObjectTesting(
    multi(),
    new MultiParseResponse(
        [
            SpreadsheetTimeParsePatterns.fromJson("hhmss")
        ]
    ),
    MultiParseResponse.fromJson,
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
        () => new MultiParseResponse(undefined)
    ).toThrow("Missing responses");
});

test("create missing null array fails", () => {
    expect(
        () => new MultiParseResponse(null)
    ).toThrow("Missing responses");
});

test("create", () => {
    const r = responses();
    check(
        new MultiParseResponse(r),
        r
    );
});

test("create empty array", () => {
    const r = [];
    check(
        new MultiParseResponse(r),
        r
    );
});

// fromJson.............................................................................................................

test("fromJson #2", () => {
    const r = "parsed-123";

    const multi = MultiParseResponse.fromJson(
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

    expect(new MultiParseResponse(
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