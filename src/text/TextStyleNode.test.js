import TextStyle from "./TextStyle";
import Text from "./Text";
import TextStyleNode from "./TextStyleNode";
import TextPlaceholderNode from "./TextPlaceholderNode";
import fromJson from "./TextNodeJsonSupport";
import React from 'react';

function children() {
    return [new Text("text-1")];
}

function textStyle() {
    return TextStyle.EMPTY
        .set("color", "black");
}

function textStyleNode() {
    return new TextStyleNode(textStyle(), children());
}

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

// render...............................................................................................................

test("render EMPTY", () => {
    expect(new TextStyleNode(TextStyle.EMPTY, [])
        .render())
        .toStrictEqual((<div style={{}}>{[]}</div>));
});

test("render EMPTY width", () => {
    expect(new TextStyleNode(TextStyle.EMPTY
        .set("width", "100px"), [])
        .render())
        .toStrictEqual((<div style={{width: "100px"}}>{[]}</div>));
});

test("render EMPTY background-color", () => {
    expect(new TextStyleNode(TextStyle.EMPTY
        .set("background-color", "#123456"), [])
        .render())
        .toStrictEqual((<div style={{backgroundColor: "#123456"}}>{[]}</div>));
});

test("render EMPTY background-color & width", () => {
    expect(new TextStyleNode(TextStyle.EMPTY
            .set("background-color", "#123456")
            .set("width", "100px")
        , [])
        .render())
        .toStrictEqual((<div style={{backgroundColor: "#123456", width: "100px"}}>{[]}</div>));
});

test("render style & text child", () => {
    const styles = new TextStyle({
        "background-color": "#123"
    });
    const text = "text-xyz";
    expect(new TextStyleNode(styles, [new Text(text)])
        .render())
        .toStrictEqual((<div style={{backgroundColor: "#123"}}>{[text]}</div>));
});

test("render style & 2 text child", () => {
    const styles = new TextStyle({
        "background-color": "#123"
    });
    const text1 = "text-1";
    const text2 = "text-2";

    expect(new TextStyleNode(styles, [new Text(text1), new Text(text2)])
        .render())
        .toStrictEqual((<div style={{backgroundColor: "#123"}}>{[text1, text2]}</div>));
});

test("render style & TextStyleNode child ", () => {
    const styles1 = new TextStyle({
        "width": "100px"
    });
    const text1 = "text1";
    const styles2 = new TextStyle({
        "height": "50px"
    });
    const text2 = "text2";

    expect(new TextStyleNode(styles1, [new Text(text1), new TextStyleNode(styles2, [new Text(text2)])])
        .render())
        .toStrictEqual((<div style={{width: "100px"}}>{[text1, <div style={{height: "50px"}}>{[text2]}</div>]}</div>));
});

// toJson...............................................................................................................

test("toJson", () => {
    const styles = new TextStyle({
        "background-color": "#123",
        "color": "#456"
    });
    const style = new TextStyleNode(styles);

    check(style,
        styles,
        {
            type: "text-style-node", value: {
                styles: {
                    "background-color": "#123",
                    "color": "#456"
                }
            }
        });
});

test("toJson with children", () => {
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
            type: "text-style-node",
            value: {styles: styles.toJson(), children: [text.toJson(), placeholder.toJson()]}
        });
});

// equals...............................................................................................................

test("equals undefined false", () => {
    const s = textStyleNode();
    expect(s.equals()).toBeFalse();
});

test("equals null false", () => {
    const s = textStyleNode();
    expect(s.equals(null)).toBeFalse();
});

test("equals self true", () => {
    const s = textStyleNode();
    expect(s.equals(s)).toBeTrue();
});

test("equals different TextStyle false", () => {
    const s = textStyleNode();
    expect(s.equals(new TextStyleNode(textStyle()
            .set("background-color", "blue"),
        children()))).toBeFalse();
});

test("equals different children false", () => {
    const s = textStyleNode();
    expect(s.equals(new TextStyleNode(textStyle(), new Text("different")))).toBeFalse();
});

test("equals equivalent true", () => {
    const s = textStyleNode();
    expect(s.equals(textStyleNode())).toBeTrue();
});

test("equals equivalent true #2", () => {
    const t = textStyle()
        .set("width", "10px");
    const c = [new Text("text-1")];
    const s = new TextStyleNode(t, [c]);
    expect(s.equals(new TextStyleNode(t, [c]))).toBeTrue();
});

// helpers..............................................................................................................

function check(style, styles, json) {
    expect(style.styles()).toStrictEqual(styles);
    expect(style.styles()).toBeInstanceOf(TextStyle);

    expect(style.toJson()).toStrictEqual(json);
    expect(style.toString()).toBe(JSON.stringify(json));
    expect(fromJson(style.toJson())).toStrictEqual(style);
}
