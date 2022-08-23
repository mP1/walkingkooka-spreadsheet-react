import Color from "../color/Color.js";
import lengthFromJson from "./LengthFromJson.js";
import React from 'react';
import Text from "./Text";
import textNodeJsonSupportFromJson from "./TextNodeJsonSupport";
import TextPlaceholderNode from "./TextPlaceholderNode";
import TextStyle from "./TextStyle";
import TextStyleNode from "./TextStyleNode";

function children() {
    return [new Text("text-1")];
}

function textStyle() {
    return TextStyle.EMPTY
        .set("color", Color.fromJson("#123456"));
}

function textStyleNode() {
    return new TextStyleNode(textStyle(), children());
}

test("create style only", () => {
    const styles = TextStyle.fromJson({
        "background-color": "#123456"
    });
    const style = new TextStyleNode(styles);
    expect(style.styles()).toStrictEqual(styles);
});

test("create style with children", () => {
    const styles = TextStyle.fromJson({
        "background-color": "#123456"
    });
    const text = new Text("text-xyz");
    const textStyleNode = new TextStyleNode(styles, [text]);

    expect(textStyleNode.styles()).toStrictEqual(styles);
    expect(textStyleNode.children()).toStrictEqual([text]);
});

// renderRoot...........................................................................................................

function testRenderRoot(textStyle, expected) {
    test(
        "renderRoot " + textStyle.toJson(),
        () => {

            expect(
                textStyle.renderRoot()
            ).toStrictEqual(expected);
    });
};

testRenderRoot(
    new TextStyleNode(TextStyle.EMPTY, []),
    <React.Fragment>{[]}</React.Fragment>
);

testRenderRoot(
    new TextStyleNode(TextStyle.EMPTY, [ new Text("ABC123")]),
    <React.Fragment>{["ABC123"]}</React.Fragment>
);

// render...............................................................................................................

function testRender(textStyle, expected) {
    test(
        "render " + textStyle,
        () => {
            expect(
                textStyle.render()
            ).toStrictEqual(expected);
        }
    );
};

testRender(
    new TextStyleNode(TextStyle.EMPTY, []),
    <div style={{}}>{[]}</div>
);

testRender(
    new TextStyleNode(
        TextStyle.EMPTY,
        [
            new Text("ABC")
        ]
    ),
    <div style={{}}>{["ABC"]}</div>
);

testRender(
    new TextStyleNode(
        TextStyle.EMPTY,
        [
            new Text("ABC"),
            new Text("XYZ")
        ]
    ),
    <div style={{}}>{["ABC","XYZ"]}</div>
);

testRender(
    new TextStyleNode(
        TextStyle.EMPTY
            .set("background-color", Color.fromJson("#123456")),
        [
            new Text("ABC123")
        ]
    ),
    <div style={{backgroundColor: "#123456"}}>{["ABC123"]}</div>
);

testRender(
    new TextStyleNode(
        TextStyle.EMPTY
            .set("background-color", Color.fromJson("#123456")),
        [
            new Text("ABC"),
            new Text("XYZ")
        ]
    ),
    <div style={{backgroundColor: "#123456"}}>{["ABC","XYZ"]}</div>
);

testRender(
    new TextStyleNode(
        TextStyle.EMPTY
            .set("background-color", Color.fromJson("#123456")),
        [
            new Text("ABC111"),
            new TextStyleNode(
                TextStyle.EMPTY
                    .set("color", Color.fromJson("#ABCDEF")),
                [
                    new Text("DEF")
                ]
            )
        ]
    ),
    <div style={{backgroundColor: "#123456"}}>{
        [
            "ABC111",
            <div style={{color: "#ABCDEF"}}>{["DEF"]}</div>
        ]
    }</div>
);

// toJson...............................................................................................................

test(
    "toJson",
    () => {
        const styles = TextStyle.fromJson({
            "background-color": "#123456",
            "color": "#abcdef"
        });
        const style = new TextStyleNode(styles);

        check(
            style,
            styles,
            {
                styles: {
                    "background-color": "#123456",
                    "color": "#abcdef"
                }
            }
        );
    }
);

test(
    "toJson with children",
    () => {
        const text = new Text("text-xyz");
        const placeholder = new TextPlaceholderNode("placeholder-tuv");

        const styles = TextStyle.fromJson({
            "background-color": "#123456",
            "color": "#abcdef"
        });
        const style = new TextStyleNode(styles, [text, placeholder]);

        check(
            style,
            styles,
            {
                styles: styles.toJson(),
                children: [
                    text.toJsonWithType(),
                    placeholder.toJsonWithType()
                ]}
        );
    }
);

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
            .set("background-color", Color.fromJson("#ffffff")),
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
        .set("width", lengthFromJson("10px"));
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

    expect(textNodeJsonSupportFromJson(style.toJsonWithType())).toStrictEqual(style);
}
