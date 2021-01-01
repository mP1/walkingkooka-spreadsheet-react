import FormatRequest from "./FormatRequest.js";
import MultiFormatRequest from "./MultiFormatRequest.js";
import SpreadsheetDateFormatPattern from "../../format/SpreadsheetDateFormatPattern.js";
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
    return new FormatRequest(
        SpreadsheetDateFormatPattern.fromJson(localDateTime),
        SpreadsheetDateFormatPattern.fromJson(pattern)
    );
}

function multi() {
    return new MultiFormatRequest(
        requests()
    );
}

systemObjectTesting(
    multi(),
    new MultiFormatRequest(
        [
            request("1970/1/1 12:00:00", "d-m-y")
        ]
    ),
    MultiFormatRequest.fromJson,
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
        () => new MultiFormatRequest(undefined)
    ).toThrow("Missing requests");
});

test("create missing null array fails", () => {
    expect(
        () => new MultiFormatRequest(null)
    ).toThrow("Missing requests");
});

test("create", () => {
    const r = requests();
    check(
        new MultiFormatRequest(r),
        r
    );
});

test("create empty array", () => {
    const r = [];
    check(
        new MultiFormatRequest(r),
        r
    );
});

// fromJson.............................................................................................................

test("fromJson", () => {
    const r = request("2000/1/1 1:1:1", "yyyy-mm-dd hh-mm");

    const multi = MultiFormatRequest.fromJson(
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

    const multi = MultiFormatRequest.fromJson(
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

    expect(new MultiFormatRequest(
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

    expect(new MultiFormatRequest(
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