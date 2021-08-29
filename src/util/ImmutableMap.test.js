import ImmutableMap from "./ImmutableMap";
import lengthFromJson from "../text/LengthFromJson.js";
import SpreadsheetCellReference from "../spreadsheet/reference/SpreadsheetCellReference";
import SpreadsheetColumnReference from "../spreadsheet/reference/SpreadsheetColumnReference";
import TextStyle from "../text/TextStyle";

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

// isEmpty/Size..................................................................................................................

test("isEmpty/size empty", () => {
    const map = ImmutableMap.EMPTY;

    expect(map.size()).toStrictEqual(0);
    expect(map.isEmpty()).toStrictEqual(true);
});

test("isEmpty/size not empty size=1", () => {
    const a1 = SpreadsheetCellReference.parse("A1");

    const a1v = "A1-value";

    const nativeMap = new Map([[a1.toString(), a1v]]);
    const map = new ImmutableMap(nativeMap);

    expect(map.size()).toStrictEqual(1);
    expect(map.isEmpty()).toStrictEqual(false);
});

test("isEmpty/size not empty 1", () => {
    const a1 = SpreadsheetCellReference.parse("A1");
    const b2 = SpreadsheetCellReference.parse("B2");

    const a1v = "A1-value";
    const b2v = "B2-value";

    const nativeMap = new Map([[a1.toString(), a1v], [b2.toString(), b2v]]);
    const map = new ImmutableMap(nativeMap);

    expect(map.size()).toStrictEqual(2);
    expect(map.isEmpty()).toStrictEqual(false);
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

// set..................................................................................................................

test("setAll missing map fails", () => {
    expect(() => ImmutableMap.EMPTY.setAll()).toThrow("Missing map");
});

test("setAll invalid map type fails", () => {
    expect(() => ImmutableMap.EMPTY.setAll("!invalid")).toThrow("Expected ImmutableMap map got !invalid");
});

test("setAll empty map empty map", () => {
    const map = ImmutableMap.EMPTY;
    const after = ImmutableMap.EMPTY.setAll(map);
    expect(after === map).toBeTrue();
});

test("setAll empty map not empty map", () => {
    const a1 = SpreadsheetCellReference.parse("A1");
    const b2 = SpreadsheetCellReference.parse("B2");

    const a1v = "A1-value";
    const b2v = "B2-value";

    const map = new ImmutableMap(new Map([[a1.toString(), a1v], [b2.toString(), b2v]]));
    const after = ImmutableMap.EMPTY.setAll(map);
    expect(after === map).toBeTrue();
});

test("setAll not empty map empty map", () => {
    const a1 = SpreadsheetCellReference.parse("A1");
    const b2 = SpreadsheetCellReference.parse("B2");

    const a1v = "A1-value";
    const b2v = "B2-value";

    const map = new ImmutableMap(new Map([[a1.toString(), a1v], [b2.toString(), b2v]]));
    const after = map.setAll(ImmutableMap.EMPTY);
    expect(after === map).toBeTrue();
});

test("setAll not empty map different not empty map", () => {
    const a1 = SpreadsheetCellReference.parse("A1");
    const b2 = SpreadsheetCellReference.parse("B2");

    const a1v = "A1-value";
    const b2v = "B2-value";

    const map = new ImmutableMap(new Map([[a1.toString(), a1v]]));
    const other = new ImmutableMap(new Map([[b2.toString(), b2v]]));

    const after = map.setAll(other);

    expect(after)
        .toStrictEqual(new ImmutableMap(
            new Map([
                [a1.toString(), a1v],
                [b2.toString(), b2v]
            ])));
});

test("setAll not empty map same not empty map", () => {
    const a1 = SpreadsheetCellReference.parse("A1");
    const a1v = "A1-value";

    const map = new ImmutableMap(new Map([[a1.toString(), a1v]]));
    const other = new ImmutableMap(new Map([[a1.toString(), a1v]]));

    const after = map.setAll(other);
    expect(after === map).toBeTrue();
});

// remove..................................................................................................................

test("remove unknown key", () => {
    const a1 = SpreadsheetCellReference.parse("A1");
    const b2 = SpreadsheetCellReference.parse("B2");

    const a1v = "A1-value";
    const b2v = "B2-value";

    const nativeMap = new Map([[a1.toString(), a1v], [b2.toString(), b2v]]);
    const map = new ImmutableMap(nativeMap);

    expect(map.remove(
        SpreadsheetCellReference.parse("Z99"))
    ).toStrictEqual(map);
});

test("remove", () => {
    const a1 = SpreadsheetCellReference.parse("A1");
    const b2 = SpreadsheetCellReference.parse("B2");

    const a1v = "A1-value";
    const b2v = "B2-value";

    const nativeMap = new Map([[a1.toString(), a1v], [b2.toString(), b2v]]);
    const map = new ImmutableMap(nativeMap);

    expect(map.remove(a1))
        .toStrictEqual(
            new ImmutableMap(
                new Map([[b2.toString(), b2v]])
            )
        );
});

// fromJson.............................................................................................................

test("fromJson missing json fails", () => {
    expect(() => ImmutableMap.fromJson()).toThrow("Missing json");
});

test("fromJson invalid json fails", () => {
    expect(() => ImmutableMap.fromJson("!invalid")).toThrow("Expected object json got !invalid");
});

test("fromJson missing key parser fails", () => {
    expect(() => ImmutableMap.fromJson({})).toThrow("Missing keyParser");
});

test("fromJson invalid key parser fails", () => {
    expect(() => ImmutableMap.fromJson({}, "!invalid")).toThrow("Expected function keyParser got !invalid");
});

test("fromJson missing value unmarshaller fails", () => {
    expect(() => ImmutableMap.fromJson({}, () => false)).toThrow("Missing valueUnmarshaller");
});

test("fromJson invalid value unmarshaller fails", () => {
    expect(() => ImmutableMap.fromJson({}, () => false, "!invalid")).toThrow("Expected function valueUnmarshaller got !invalid");
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

test("toJson value.toJson", () => {
    const a1 = SpreadsheetCellReference.parse("A1");
    const b2 = SpreadsheetCellReference.parse("B2");

    const a1v = SpreadsheetColumnReference.parse("$C");
    const b2v = SpreadsheetColumnReference.parse("$D");

    const nativeMap = new Map([[a1.toString(), a1v], [b2.toString(), b2v]]);
    const map = new ImmutableMap(nativeMap);

    expect(map.toJson()).toStrictEqual({A1: "$C", B2: "$D"});
});

test("toJson value missing toJson", () => {
    const a1 = SpreadsheetCellReference.parse("A1");
    const b2 = SpreadsheetCellReference.parse("B2");

    const a1v = TextStyle.EMPTY.set("height", lengthFromJson("10px"));
    const b2v = TextStyle.EMPTY.set("width", lengthFromJson("100px"));

    const nativeMap = new Map([[a1.toString(), a1v], [b2.toString(), b2v]]);
    const map = new ImmutableMap(nativeMap);

    expect(map.toJson()).toStrictEqual({A1: a1v.toJson(), B2: b2v.toJson()});
});

// equals...............................................................................................................

test("equals undefined", () => {
    expect(ImmutableMap.EMPTY.equals()).toStrictEqual(false);
});

test("equals null", () => {
    expect(ImmutableMap.EMPTY.equals(null)).toStrictEqual(false);
});

test("equals non ImmutableMap", () => {
    expect(ImmutableMap.EMPTY.equals("!invalid")).toStrictEqual(false);
});

test("equals empty map and empty map", () => {
    expect(ImmutableMap.EMPTY.equals(ImmutableMap.EMPTY)).toStrictEqual(true);
});

test("equals different map", () => {
    expect(ImmutableMap.EMPTY.equals(new ImmutableMap(new Map([["A1", "A1-value"]])))).toStrictEqual(false);
});

test("equals different map #2", () => {
    expect(new ImmutableMap(new Map([["A1", "A1-value"]])).equals(new ImmutableMap(new Map([["B2", "B2-value"]])))).toStrictEqual(false);
});

test("equals different map #3", () => {
    expect(new ImmutableMap(new Map([["A1", "A1-value"]])).equals(new ImmutableMap(new Map([["A1", "different"]])))).toStrictEqual(false);
});

test("equals different map #4", () => {
    expect(new ImmutableMap(new Map([["A1", SpreadsheetColumnReference.parse("A")]])).equals(new ImmutableMap(new Map([["A1", SpreadsheetColumnReference.parse("Z")]])))).toStrictEqual(false);
});

test("equals equivalent map", () => {
    expect(new ImmutableMap(new Map([["A1", "A1-value"]])).equals(new ImmutableMap(new Map([["A1", "A1-value"]])))).toStrictEqual(true);
});

test("equals equivalent map #2", () => {
    const map = new Map([
        ["A1", "A1-value"],
        ["B2", "B2-value"]
    ]);

    expect(new ImmutableMap(map).equals(new ImmutableMap(new Map(map)))).toStrictEqual(true);
});

test("equals equivalent map #3", () => {
    const map = new Map([
        ["A1", SpreadsheetColumnReference.parse("A")],
        ["B2", SpreadsheetColumnReference.parse("B")]
    ]);

    expect(new ImmutableMap(map).equals(new ImmutableMap(new Map(map)))).toStrictEqual(true);
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

test("toString values missing toJson", () => {
    const a1 = SpreadsheetCellReference.parse("A1");
    const b2 = SpreadsheetCellReference.parse("B2");

    const a1v = 3;
    const b2v = 4;

    const nativeMap = new Map([[a1.toString(), a1v], [b2.toString(), b2v]]);
    const map = new ImmutableMap(nativeMap);

    expect(map.toString()).toStrictEqual("{\"A1\":3,\"B2\":4}");
});