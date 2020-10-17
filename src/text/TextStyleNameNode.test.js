import Text from "./Text";
import TextStyleNameNode from "./TextStyleNameNode";
import TextPlaceholderNode from "./TextPlaceholderNode";
import fromJson from "./TextNodeJsonSupport";
import {TextStyle} from "./TextStyle";

const styleName = "style-name-123-abc";

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

test("json", () => {
    const styleNameNode = new TextStyleNameNode(styleName);

    checkJson(styleNameNode, {typeName: "text-style-name", value: {styleName: styleName}});
});

test("json with children", () => {
    const text = new Text("text-xyz");
    const placeholder = new TextPlaceholderNode("placeholder-tuv");
    const styleNameNode = new TextStyleNameNode(styleName, [text, placeholder]);

    checkJson(styleNameNode, {
        typeName: "text-style-name",
        value: {
            styleName: styleName, children: [
                {
                    typeName: "text",
                    value: "text-xyz"
                },
                {
                    typeName: "text-placeholder",
                    value: "placeholder-tuv"
                },
            ]
        }
    });
});

// helpers..............................................................................................................

function checkJson(styleNameNode, json) {
    expect(styleNameNode.styles()).toStrictEqual(TextStyle.EMPTY);
    expect(styleNameNode.toJson()).toStrictEqual(json);
    expect(styleNameNode.toString()).toBe(JSON.stringify(json));
    expect(fromJson(styleNameNode.toJson())).toStrictEqual(styleNameNode);
}
