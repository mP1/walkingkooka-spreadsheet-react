import Text from "./Text";
import TextStyleNode from "./TextStyleNode";
import TextPlaceholderNode from "./TextPlaceholderNode";
import fromJson from "./TextNodeJsonSupport";
import {TextStyle} from "./TextStyle";

test("create style only", () => {
    const styles = new TextStyle({
        "background-color": "#123"
    });
    const style = new TextStyleNode(styles);
    expect(style.styles()).toStrictEqual(styles);
});

test("create style with children", () => {
    const styles = new TextStyle({
        "background-color": "#123"
    });
    const text = new Text("text-xyz");
    const textStyleNode = new TextStyleNode(styles, [text]);

    expect(textStyleNode.styles()).toStrictEqual(styles);
    expect(textStyleNode.children()).toStrictEqual([text]);
});

test("json", () => {
    const styles = new TextStyle({
        "background-color": "#123",
        "color": "#456"
    });
    const style = new TextStyleNode(styles);

    check(style,
        styles,
        {
            typeName: "text-style", value: {
                styles: {
                    "background-color": "#123",
                    "color": "#456"
                }
            }
        });
});

test("json with children", () => {
    const text = new Text("text-xyz");
    const placeholder = new TextPlaceholderNode("placeholder-tuv");

    const styles = new TextStyle({
        "background-color": "#123",
        "color": "#456"
    });
    const style = new TextStyleNode(styles, [text, placeholder]);

    check(style,
        styles,
        {
            typeName: "text-style",
            value: {styles: styles.toJson(), children: [text.toJson(), placeholder.toJson()]}
        });
});

// helpers..............................................................................................................

function check(style, styles, json) {
    expect(style.styles()).toStrictEqual(styles);
    expect(style.toJson()).toStrictEqual(json);
    expect(style.toString()).toBe(JSON.stringify(json));
    expect(fromJson(style.toJson())).toStrictEqual(style);
}
