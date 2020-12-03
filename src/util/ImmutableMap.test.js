import ImmutableMap from "./ImmutableMap";
import SpreadsheetCellReference from "../spreadsheet/reference/SpreadsheetCellReference";
import TextPlaceholderNode from "../text/TextPlaceholderNode";
import TextStyle from "../text/TextStyle";
import SpreadsheetColumnReference from "../spreadsheet/reference/SpreadsheetColumnReference";


// new..................................................................................................................

test("ctor missing map fails", () => {
    expect(() => new ImmutableMap()).toThrow("Missing map");
});

test("ctor invalid map type fails", () => {
    expect(() => new ImmutableMap("!invalid")).toThrow("Expected Map map got !invalid");
});

test("ctor map copied", () => {
    const a1 = SpreadsheetCellReference.parse("A1");
    const b2 = SpreadsheetCellReference.parse("B2");

    const a1v = "A1-value";
    const b2v = "B2-value";

    const nativeMap = new Map([[a1.toString(), a1v], [b2.toString(), b2v]]);
    const map = new ImmutableMap(nativeMap);

    nativeMap.set(a1, "different");

    expect(map.get(a1)).toStrictEqual(a1v);
});

// get..................................................................................................................

test("get", () => {
    const a1 = SpreadsheetCellReference.parse("A1");
    const b2 = SpreadsheetCellReference.parse("B2");

    const a1v = "A1-value";
    const b2v = "B2-value";

    const nativeMap = new Map([[a1.toString(), a1v], [b2.toString(), b2v]]);
    const map = new ImmutableMap(nativeMap);

    expect(map.get(SpreadsheetCellReference.parse("A1"))).toStrictEqual(a1v);
});

test("get unknown key", () => {
    const a1 = SpreadsheetCellReference.parse("A1");
    const b2 = SpreadsheetCellReference.parse("B2");

    const a1v = "A1-value";
    const b2v = "B2-value";

    const nativeMap = new Map([[a1.toString(), a1v], [b2.toString(), b2v]]);
    const map = new ImmutableMap(nativeMap);

    expect(map.get(SpreadsheetCellReference.parse("Z99"))).toBeUndefined();
});

// fromJson.............................................................................................................

test("fromJson missing json fails", () => {
    expect(() => ImmutableMap.fromJson()).toThrow("Missing json");
});

test("fromJson invalid json fails", () => {
    expect(() => ImmutableMap.fromJson("!invalid")).toThrow("Expected object json got !invalid");
});

test("fromJson missing key parser fails", () => {
    expect(() => ImmutableMap.fromJson({})).toThrow("Missing key parser");
});

test("fromJson invalid key parser fails", () => {
    expect(() => ImmutableMap.fromJson({},"!invalid")).toThrow("Expected function key parser got !invalid");
});

test("fromJson missing value unmarshaller fails", () => {
    expect(() => ImmutableMap.fromJson({}, () => false)).toThrow("Missing valueUnmarshaller");
});

test("fromJson invalid value unmarshaller fails", () => {
    expect(() => ImmutableMap.fromJson({},() => false, "!invalid")).toThrow("Expected function valueUnmarshaller got !invalid");
});

test("fromJson empty", () => {
    const json = {};
    const map = ImmutableMap.fromJson(json,
        SpreadsheetCellReference.fromJson,
        SpreadsheetColumnReference.parse);

    expect(map.toJson()).toStrictEqual(json);
});

test("fromJson not empty", () => {
    const json = {
        "A1": "B",
        "B2": "C",
    };
    const map = ImmutableMap.fromJson(json,
        SpreadsheetCellReference.fromJson,
        SpreadsheetColumnReference.parse);

    expect(map.get(SpreadsheetCellReference.fromJson("A1"))).toStrictEqual(SpreadsheetColumnReference.parse("B"));
    expect(map.get(SpreadsheetCellReference.fromJson("B2"))).toStrictEqual(SpreadsheetColumnReference.parse("C"));
    expect(map.toJson()).toStrictEqual({
        "A1": "B",
        "B2": "C",
    });
});

// toJson..............................................................................................................

test("toJson empty", () => {
    expect(ImmutableMap.EMPTY.toJson()).toStrictEqual({});
});

test("toJson", () => {
    const a1 = SpreadsheetCellReference.parse("A1");
    const b2 = SpreadsheetCellReference.parse("B2");

    const a1v = SpreadsheetColumnReference.parse("$C");
    const b2v = SpreadsheetColumnReference.parse("$D");

    const nativeMap = new Map([[a1.toString(), a1v], [b2.toString(), b2v]]);
    const map = new ImmutableMap(nativeMap);

    expect(map.toJson()).toStrictEqual({A1:"$C", B2:"$D"});
});

test("toJson 2", () => {
    const a1 = SpreadsheetCellReference.parse("A1");
    const b2 = SpreadsheetCellReference.parse("B2");

    const a1v = TextStyle.EMPTY.set("height", "10px");
    const b2v = TextStyle.EMPTY.set("width", "100px");

    const nativeMap = new Map([[a1.toString(), a1v], [b2.toString(), b2v]]);
    const map = new ImmutableMap(nativeMap);

    expect(map.toJson()).toStrictEqual({A1:a1v.toJson(), B2:b2v.toJson()});
});

// toString.............................................................................................................

test("toString", () => {
    const a1 = SpreadsheetCellReference.parse("A1");
    const b2 = SpreadsheetCellReference.parse("B2");

    const a1v = SpreadsheetColumnReference.parse("$C");
    const b2v = SpreadsheetColumnReference.parse("$D");

    const nativeMap = new Map([[a1.toString(), a1v], [b2.toString(), b2v]]);
    const map = new ImmutableMap(nativeMap);

    expect(map.toString()).toStrictEqual("{\"A1\":\"$C\",\"B2\":\"$D\"}");
});