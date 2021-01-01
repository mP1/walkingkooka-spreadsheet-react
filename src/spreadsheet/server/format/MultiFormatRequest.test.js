import FormatRequest from "./FormatRequest.js";
import MultiFormatRequest from "./MultiFormatRequest.js";
import SpreadsheetDateFormatPattern from "../../format/SpreadsheetDateFormatPattern.js";

function requests() {
    return [
        request("2000/1/1 1:1:1", "yyyy-mm-dd hh-mm"),
        request("2000/2/2 2:2:2", "yyyy-mm-dd hh-mm"),
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

test("fromJson undefined fails", () => {
    expect(
        () => MultiFormatRequest.fromJson(undefined)
    ).toThrow("Missing array");
});

test("fromJson null fails", () => {
    expect(
        () => MultiFormatRequest.fromJson(null)
    ).toThrow("Missing array");
});

test("fromJson non array fails", () => {
    expect(
        () => MultiFormatRequest.fromJson("invalid!")
    ).toThrow("Expected array json got invalid!");
});

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

// equals...............................................................................................................

test("equals undefined false", () => {
    expect(multi()
        .equals())
        .toBeFalse();
});

test("equals null false", () => {
    expect(multi()
        .equals(null))
        .toBeFalse();
});

test("equals different type false", () => {
    expect(multi()
        .equals("different"))
        .toBeFalse();
});

test("equals self true", () => {
    const f = multi();
    expect(f.equals(f))
        .toBeTrue();
});

test("equals different request false", () => {
    expect(multi()
        .equals(
            new MultiFormatRequest(
                [
                    request("1999-12-31 12:58:59", "yy-mm-dd")
                ]
            )
        )
    ).toBeFalse();
});

// helpers..............................................................................................................

function check(multi, requests) {
    expect(multi.requests()).toStrictEqual(requests);
}