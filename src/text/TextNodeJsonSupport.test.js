import textNodeJsonSupportFromJson from "./TextNodeJsonSupport";
import Text from "./Text";

const value = "text-placeholder-123-abc";

test("textNodeJsonSupportFromJson missing fails", () => {
    expect(() => textNodeJsonSupportFromJson()).toThrow("Missing json");
});

test("textNodeJsonSupportFromJson invalid fails", () => {
    expect(() => textNodeJsonSupportFromJson("!invalid")).toThrow("Expected object json got !invalid");
});

test("textNodeJsonSupportFromJson missing type fails", () => {
    expect(() => textNodeJsonSupportFromJson({})).toThrow("Missing type got {}");
});

test("textNodeJsonSupportFromJson invalid type fails", () => {
    expect(() => textNodeJsonSupportFromJson({
        type: 1,
        value: {}
    })).toThrow("Expected String type got {\"type\":1,\"value\":{}}");
});

test("textNodeJsonSupportFromJson missing value fails", () => {
    expect(() => textNodeJsonSupportFromJson({type: "text"})).toThrow("Missing value");
});

test("textNodeJsonSupportFromJson unknown type fails", () => {
    expect(() => textNodeJsonSupportFromJson({
        type: "unknown-123",
        value: {}
    })).toThrow("Unexpected type name \"unknown-123\" in {\"type\":\"unknown-123\",\"value\":{}}"
    );
});

test("textNodeJsonSupportFromJson Text", () => {
    const text = new Text("text-123");
    expect(textNodeJsonSupportFromJson({type: "text", value: text.value()})).toStrictEqual(text);
});