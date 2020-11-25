import TextStyle from "./TextStyle";
import Text from "./Text";
import TextStyleNode from "./TextStyleNode";
import TextPlaceholderNode from "./TextPlaceholderNode";
import fromJson from "./TextNodeJsonSupport";
import React from 'react';

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

// toHtml...............................................................................................................

test("toHtml EMPTY", () => {
    expect(new TextStyleNode(TextStyle.EMPTY, [])
        .toHtml())
        .toStrictEqual((<div style={{}}>{[]}</div>));
});

test("toHtml EMPTY width", () => {
    expect(new TextStyleNode(TextStyle.EMPTY
        .set("width", "100px"), [])
        .toHtml())
        .toStrictEqual((<div style={{width: "100px"}}>{[]}</div>));
});

test("toHtml EMPTY background-color", () => {
    expect(new TextStyleNode(TextStyle.EMPTY
        .set("background-color", "#123456"), [])
        .toHtml())
        .toStrictEqual((<div style={{backgroundColor: "#123456"}}>{[]}</div>));
});

test("toHtml EMPTY background-color & width", () => {
    expect(new TextStyleNode(TextStyle.EMPTY
            .set("background-color", "#123456")
            .set("width", "100px")
        , [])
        .toHtml())
        .toStrictEqual((<div style={{backgroundColor: "#123456", width: "100px"}}>{[]}</div>));
});

test("toHtml style & text child", () => {
    const styles = new TextStyle({
        "background-color": "#123"
    });
    const text = "text-xyz";
    expect(new TextStyleNode(styles, [new Text(text)])
        .toHtml())
        .toStrictEqual((<div style={{backgroundColor: "#123"}}>{[text]}</div>));
});

test("toHtml style & 2 text child", () => {
    const styles = new TextStyle({
        "background-color": "#123"
    });
    const text1 = "text-1";
    const text2 = "text-2";

    expect(new TextStyleNode(styles, [new Text(text1), new Text(text2)])
        .toHtml())
        .toStrictEqual((<div style={{backgroundColor: "#123"}}>{[text1, text2]}</div>));
});

test("toHtml style & TextStyleNode child ", () => {
    const styles1 = new TextStyle({
        "width": "100px"
    });
    const text1 = "text1";
    const styles2 = new TextStyle({
        "height": "50px"
    });
    const text2 = "text2";

    expect(new TextStyleNode(styles1, [new Text(text1), new TextStyleNode(styles2, [new Text(text2)])])
        .toHtml())
        .toStrictEqual((<div style={{width: "100px"}}>{[text1, <div style={{height: "50px"}}>{[text2]}</div>]}</div>));
});

// toJson...............................................................................................................

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
    expect(style.styles()).toBeInstanceOf(TextStyle);

    expect(style.toJson()).toStrictEqual(json);
    expect(style.toString()).toBe(JSON.stringify(json));
    expect(fromJson(style.toJson())).toStrictEqual(style);
}
