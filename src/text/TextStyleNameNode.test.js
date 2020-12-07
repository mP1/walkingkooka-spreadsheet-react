import Text from "./Text";
import TextStyleNameNode from "./TextStyleNameNode";
import TextPlaceholderNode from "./TextPlaceholderNode";
import fromJson from "./TextNodeJsonSupport";
import TextStyle from "./TextStyle";

const styleName = "style-name-123-abc";

function textStyleNameNode() {
    return new TextStyleNameNode(styleName,
        [
            new Text("text-1"),
            new Text("text-2")
        ]
    );
}

test("create style only", () => {
    const styleNameNode = new TextStyleNameNode(styleName);
    expect(styleNameNode.styleName()).toBe(styleName);
});

test("create style with children", () => {
    const text = new Text("text-xyz");
    const styleNameNode = new TextStyleNameNode(styleName, [text]);

    expect(styleNameNode.styleName()).toBe(styleName);
    expect(styleNameNode.children()).toStrictEqual([text]);
});

// render...............................................................................................................

test("render fails", () => {
    expect(() => new TextStyleNameNode(styleName).render()).toThrow("Unsupported: render");
});

// toJson...............................................................................................................

test("toJson", () => {
    const styleNameNode = new TextStyleNameNode(styleName);

    checkJson(styleNameNode, {type: "text-styleName", value: {styleName: styleName}});
});

test("toJson with children", () => {
    const text = new Text("text-xyz");
    const placeholder = new TextPlaceholderNode("placeholder-tuv");
    const styleNameNode = new TextStyleNameNode(styleName, [text, placeholder]);

    checkJson(styleNameNode, {
        type: "text-styleName",
        value: {
            styleName: styleName, children: [
                {
                    type: "text",
                    value: "text-xyz"
                },
                {
                    type: "text-placeholder",
                    value: "placeholder-tuv"
                },
            ]
        }
    });
});

// equals...............................................................................................................

test("equals undefined false", () => {
    const s = textStyleNameNode();
    expect(s.equals()).toBeFalse();
});

test("equals null false", () => {
    const s = textStyleNameNode();
    expect(s.equals(null)).toBeFalse();
});

test("equals self true", () => {
    const s = textStyleNameNode();
    expect(s.equals(s)).toBeTrue();
});

test("equals different false", () => {
    const s = textStyleNameNode();
    expect(s.equals(new TextStyleNameNode("different"))).toBeFalse();
});

test("equals different children false", () => {
    const s = textStyleNameNode();
    expect(s.equals(new TextStyleNameNode(styleName, new Text("different")))).toBeFalse();
});

test("equals equivalent true", () => {
    const s = textStyleNameNode();
    expect(s.equals(textStyleNameNode())).toBeTrue();
});

test("equals equivalent true #2", () => {
    const c = [new Text("text-1")];
    const s = new TextStyleNameNode(styleName, [c]);
    expect(s.equals(new TextStyleNameNode(styleName, [c]))).toBeTrue();
});

// helpers..............................................................................................................

function checkJson(styleNameNode, json) {
    expect(styleNameNode.styles()).toStrictEqual(TextStyle.EMPTY);
    expect(styleNameNode.toJson()).toStrictEqual(json);
    expect(styleNameNode.toString()).toBe(JSON.stringify(json));
    expect(fromJson(styleNameNode.toJson())).toStrictEqual(styleNameNode);
}
