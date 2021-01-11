import SpreadsheetDateFormatPattern from "../../format/SpreadsheetDateFormatPattern.js";
import SpreadsheetFormatRequest from "./SpreadsheetFormatRequest.js";
import SpreadsheetMultiFormatRequest from "./SpreadsheetMultiFormatRequest.js";
import systemObjectTesting from "../../../SystemObjectTesting.js";

function request1() {
    return request("2000/1/1 1:1:1", "yyyy-mm-dd hh-mm");
}

function request2() {
    return request("2000/2/2 2:2:2", "yyyy-mm-dd hh-mm");
}

function requests() {
    return [
        request1(),
        request2(),
    ];
}

function request(localDateTime, pattern) {
    return new SpreadsheetFormatRequest(
        SpreadsheetDateFormatPattern.fromJson(localDateTime),
        SpreadsheetDateFormatPattern.fromJson(pattern)
    );
}

function multi() {
    return new SpreadsheetMultiFormatRequest(
        requests()
    );
}

systemObjectTesting(
    multi(),
    new SpreadsheetMultiFormatRequest(
        [
            request("1970/1/1 12:00:00", "d-m-y")
        ]
    ),
    SpreadsheetMultiFormatRequest.fromJson,
    "Missing array",
    "spreadsheet-multi-format-request",
    [
        request1().toJsonWithType(),
        request2().toJsonWithType()
    ]
);

// create...............................................................................................................

test("create missing undefined array fails", () => {
    expect(
        () => new SpreadsheetMultiFormatRequest(undefined)
    ).toThrow("Missing requests");
});

test("create missing null array fails", () => {
    expect(
        () => new SpreadsheetMultiFormatRequest(null)
    ).toThrow("Missing requests");
});

test("create", () => {
    const r = requests();
    check(
        new SpreadsheetMultiFormatRequest(r),
        r
    );
});

test("create empty array", () => {
    const r = [];
    check(
        new SpreadsheetMultiFormatRequest(r),
        r
    );
});

// fromJson.............................................................................................................

test("fromJson", () => {
    const r = request("2000/1/1 1:1:1", "yyyy-mm-dd hh-mm");

    const multi = SpreadsheetMultiFormatRequest.fromJson(
        [
            r.toJsonWithType(),
        ]
    );

    check(
        multi,
        [r]
    );
});

test("fromJson #2", () => {
    const r1 = request("2000/1/1 1:1:1", "yyyy-mm-dd hh-mm");
    const r2 = request("2000/2/2 2:2:2", "yyyy-mm-dd hh-mm");

    const multi = SpreadsheetMultiFormatRequest.fromJson(
        [
            r1.toJsonWithType(),
            r2.toJsonWithType(),
        ]
    );

    check(
        multi,
        [
            r1,
            r2
        ]
    );
});

// toJson...............................................................................................................

test("toJson", () => {
    const r = request("2000/1/1 1:1:1", "yyyy-mm-dd hh-mm");

    expect(new SpreadsheetMultiFormatRequest(
        [
            r,
        ]
    ).toJson())
        .toStrictEqual([
            r.toJsonWithType()
        ]);
});

test("toJson #2", () => {
    const r1 = request("2000/1/1 1:1:1", "yyyy-mm-dd hh-mm");
    const r2 = request("2000/2/2 2:2:2", "yyyy-mm-dd hh-mm");

    expect(new SpreadsheetMultiFormatRequest(
        [
            r1,
            r2,
        ]
    ).toJson())
        .toStrictEqual(
            [
                r1.toJsonWithType(),
                r2.toJsonWithType(),
            ]
        );
});

// helpers..............................................................................................................

function check(multi, requests) {
    expect(multi.requests()).toStrictEqual(requests);
}