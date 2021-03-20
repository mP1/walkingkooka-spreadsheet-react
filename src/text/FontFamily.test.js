import FontFamily from "./FontFamily";
import systemObjectTesting from "../SystemObjectTesting.js";

const NAME = "Times New Roman";

function fontFamily() {
    return FontFamily.fromJson(NAME);
}

systemObjectTesting(
    fontFamily(),
    new FontFamily("Helvetica"),
    FontFamily.fromJson,
    "Missing name",
    "font-family",
    NAME
);

test("fromJson null fails", () => {
    expect(() => FontFamily.fromJson(null)).toThrow("Missing name");
});

test("fromJson empty fails", () => {
    expect(() => FontFamily.fromJson("")).toThrow("Missing name");
});

test("fromJson non string fails", () => {
    expect(() => FontFamily.fromJson(true)).toThrow("Expected string got true");
});

test("create", () => {
    check(new FontFamily(NAME), NAME);
});

// equals...............................................................................................................

test("equals equivalent true", () => {
    const fontFamily = new FontFamily(NAME);
    expect(fontFamily.equals(new FontFamily(NAME))).toBeTrue();
});

// helpers..............................................................................................................

function check(fontFamily, name) {
    expect(fontFamily.name()).toStrictEqual(name);

    const json = name;
    expect(fontFamily.toJson()).toStrictEqual(json);
    expect(fontFamily.toString()).toStrictEqual(json);

    expect(FontFamily.fromJson(fontFamily.toJson())).toStrictEqual(fontFamily);
}
