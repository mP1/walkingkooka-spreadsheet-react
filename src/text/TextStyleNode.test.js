import Text from "./Text";
import TextStyleNode from "./TextStyleNode";
import TextPlaceholderNode from "./TextPlaceholderNode";
import fromJson from "./TextNodeJsonSupport";

const styles = {"background-color": "#123"};

test("create style only", () => {
    const style = new TextStyleNode(styles);
    expect(style.styles()).toStrictEqual(styles);
});

test("create style with children", () => {
    const style = {
        "background-color": "#123"
    }
    const text = new Text("text-xyz");
    const textStyleNode = new TextStyleNode(styles, [text]);

    expect(textStyleNode.styles()).toStrictEqual(styles);
    expect(textStyleNode.children()).toStrictEqual([text]);
});

test("json", () => {
    const styles = {
        "background-color": "#123",
        "color": "#456"
    }
    const style = new TextStyleNode(styles);

    checkJson(style, {typeName: "text-style", value: {styles: styles}});
});

test("json with children", () => {
    const text = new Text("text-xyz");
    const placeholder = new TextPlaceholderNode("placeholder-tuv");

    const style = new TextStyleNode(styles, [text, placeholder]);

    checkJson(style, {
        typeName: "text-style",
        value: {styles: styles, children: [text.toJson(), placeholder.toJson()]}
    });
});

// helpers..............................................................................................................

// checks toJson and toString
function checkJson(style, json) {
    expect(style.toJson()).toStrictEqual(json);
    expect(style.toString()).toBe(JSON.stringify(json));
    expect(fromJson(style.toJson())).toStrictEqual(style);
}
