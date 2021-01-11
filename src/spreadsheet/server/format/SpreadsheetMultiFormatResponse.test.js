import Color from "../../../color/Color.js";
import SpreadsheetMultiFormatResponse from "./SpreadsheetMultiFormatResponse.js";
import SpreadsheetText from "../../format/SpreadsheetText.js";
import SystemObject from "../../../SystemObject.js";
import systemObjectTesting from "../../../SystemObjectTesting.js";

function response1() {
    return new SpreadsheetText(Color.fromJson("#111111"), "formatted-1");
}

function response2() {
    return "formatted-2";
}

function responses() {
    return [
        response1(),
        response2(),
    ];
}

function multi() {
    return new SpreadsheetMultiFormatResponse(
        responses()
    );
}

systemObjectTesting(
    multi(),
    new SpreadsheetMultiFormatResponse(
        [
            "different-response"
        ]
    ),
    SpreadsheetMultiFormatResponse.fromJson,
    "Missing array",
    "spreadsheet-multi-format-response",
    [
        response1().toJsonWithType(),
        SystemObject.toJsonWithType(response2())
    ]
);

// create...............................................................................................................

test("create missing undefined array fails", () => {
    expect(
        () => new SpreadsheetMultiFormatResponse(undefined)
    ).toThrow("Missing responses");
});

test("create missing null array fails", () => {
    expect(
        () => new SpreadsheetMultiFormatResponse(null)
    ).toThrow("Missing responses");
});

test("create", () => {
    const r = responses();
    check(
        new SpreadsheetMultiFormatResponse(r),
        r
    );
});

test("create empty array", () => {
    const r = [];
    check(
        new SpreadsheetMultiFormatResponse(r),
        r
    );
});

// fromJson.............................................................................................................

test("fromJson #2", () => {
    const r = "formatted-123";

    const multi = SpreadsheetMultiFormatResponse.fromJson(
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

    expect(new SpreadsheetMultiFormatResponse(
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