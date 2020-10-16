import Text from "./Text";
import fromJson from "./TextNodeJsonSupport";

const textValue = "text-123-abc";

test("create", () => {
    const text = new Text(textValue);
    expect(text.value()).toBe(textValue);
});

test("json", () => {
    const text = new Text(textValue);

    checkJson(text, {typeName: "text", value: textValue});
});

// helpers..............................................................................................................

// checks toJson and toString
function checkJson(text, json) {
    expect(text.toJson()).toStrictEqual(json);
    expect(text.toString()).toBe(JSON.stringify(json));
    expect(fromJson(text.toJson())).toStrictEqual(text);
}
