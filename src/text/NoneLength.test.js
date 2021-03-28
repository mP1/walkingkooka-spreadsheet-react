import NoneLength from "./NoneLength";
import systemObjectTesting from "../SystemObjectTesting.js";

systemObjectTesting(
    NoneLength.INSTANCE,
    undefined,
    NoneLength.fromJson,
    "Missing text",
    "none-length",
    "none"
);

test("parse null fails", () => {
    expect(() => NoneLength.parse(null)).toThrow("Missing text");
});

test("parse non string fails", () => {
    expect(() => NoneLength.parse(true)).toThrow("Expected string got true");
});

test("parse invalid value fails", () => {
    expect(() => NoneLength.parse("!invalid")).toThrow("Expected string \"none\" got !invalid");
});

test("parse none", () => {
    expect(NoneLength.fromJson("none")).toStrictEqual(NoneLength.INSTANCE);
});

test("parse 0", () => {
    expect(NoneLength.fromJson("0")).toStrictEqual(NoneLength.INSTANCE);
});

test("parse 0px", () => {
    expect(NoneLength.fromJson("0px")).toStrictEqual(NoneLength.INSTANCE);
});

test("pixelValue", () => {
    expect(NoneLength.INSTANCE.pixelValue()).toStrictEqual(0);
});

test("toCssValue", () => {
    expect(NoneLength.INSTANCE.toCssValue()).toStrictEqual("0");
});
