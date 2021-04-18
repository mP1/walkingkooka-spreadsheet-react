import SpreadsheetLabelName from "./SpreadsheetLabelName";
import systemObjectTesting from "../../SystemObjectTesting.js";

const NAME = "Label123";

systemObjectTesting(
    new SpreadsheetLabelName(NAME),
    new SpreadsheetLabelName("Label456"),
    SpreadsheetLabelName.fromJson,
    "Missing text",
    "spreadsheet-label-name",
    NAME
);

// parse...............................................................................................................

test("parse null text fails", () => {
    expect(() => SpreadsheetLabelName.parse(null)).toThrow("Missing text");
});

test("parse empty text fails", () => {
    expect(() => SpreadsheetLabelName.parse("")).toThrow("Missing text");
});

test("parse non alpha initial fails", () => {
    expect(() => SpreadsheetLabelName.parse("1")).toThrow("Invalid character 1 at 0");
});

test("parse invalid part fails", () => {
    expect(() => SpreadsheetLabelName.parse("A!")).toThrow("Invalid character ! at 1");
});

test("parse label", () => {
    const label = SpreadsheetLabelName.parse(NAME);
    expect(label.value()).toStrictEqual(NAME);
});

test("toJson", () => {
    const label = new SpreadsheetLabelName(NAME);
    expect(label.toJson()).toStrictEqual(NAME);
});

test("toString", () => {
    const label = new SpreadsheetLabelName(NAME);
    expect(label.toString()).toStrictEqual(NAME);
});

// parse................................................................................................................

test("fromJson Label", () => {
    expect(SpreadsheetLabelName.parse(NAME).equals(new SpreadsheetLabelName(NAME))).toStrictEqual(true);
});

// fromJson.............................................................................................................

test("fromJson Label", () => {
    expect(SpreadsheetLabelName.fromJson(NAME).equals(new SpreadsheetLabelName(NAME))).toStrictEqual(true);
});

// equals................................................................................................................

test("equals different", () => {
    expect(SpreadsheetLabelName.parse(NAME).equals(SpreadsheetLabelName.parse("Different"))).toStrictEqual(false);
});

test("equals", () => {
    expect(SpreadsheetLabelName.parse(NAME).equals(SpreadsheetLabelName.parse(NAME))).toStrictEqual(true);
});