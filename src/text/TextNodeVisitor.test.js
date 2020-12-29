import Text from "./Text";
import TextNodeVisitor from "./TextNodeVisitor";
import TextPlaceholderNode from "./TextPlaceholderNode";
import TextStyle from "./TextStyle";
import TextStyleNameNode from "./TextStyleNameNode";
import TextStyleNode from "./TextStyleNode";

test("accept missing node fails", () => {
    expect(() => new TextNodeVisitor().accept()).toThrow("Missing node");
});

test("accept non node fails", () => {
    expect(() => new TextNodeVisitor().accept("!invalid")).toThrow("Expected TextNode node got !invalid");
});

test("accept visitTextNode returns false/skip", () => {
    const visitor = new TextNodeVisitor();
    visitor.startVisitTextNode = (n) => false;
    visitor.visitNode = (n) => {
        throw new Error("UnsupportedOperationException " + n)
    };
    visitor.accept(new Text("Text node 123"));
});

test("accept Text", () => {
    var visited = [];

    const visitor = new TextNodeVisitor();
    visitor.startVisitTextNode = (n) => {
        visited.push("startVisitTextNode");
        visited.push(n);
        return true;
    };
    visitor.visitText = (n) => {
        visited.push("visitText");
        visited.push(n);
    };
    visitor.endVisitTextNode = (n) => {
        visited.push("endVisitTextNode");
        visited.push(n);
    };

    const node = new Text("Text node 123");
    visitor.accept(node);

    expect(visited).toEqual(["startVisitTextNode", node, "visitText", node, "endVisitTextNode", node]);
});

test("accept TextPlaceholder", () => {
    var visited = [];

    const visitor = new TextNodeVisitor();
    visitor.startVisitTextNode = (n) => {
        visited.push("startVisitTextNode");
        visited.push(n);
        return true;
    };
    visitor.visitTextPlaceholderNode = (n) => {
        visited.push("visitTextPlaceholderNode");
        visited.push(n);
    };
    visitor.endVisitTextNode = (n) => {
        visited.push("endVisitTextNode");
        visited.push(n);
    };

    const node = new TextPlaceholderNode("placeholder-123");
    visitor.accept(node);

    expect(visited).toEqual(["startVisitTextNode", node, "visitTextPlaceholderNode", node, "endVisitTextNode", node]);
});

// TextStyleNameNode....................................................................................................

test("accept TextStyleNameNode", () => {
    var visited = [];

    const visitor = new TextNodeVisitor();
    visitor.startVisitTextNode = (n) => {
        visited.push("startVisitTextNode");
        visited.push(n);
        return true;
    };

    visitor.startVisitTextStyleNameNode = (n) => {
        visited.push("startVisitTextStyleNameNode");
        visited.push(n);
        return true;
    };
    visitor.endVisitTextStyleNameNode = (n) => {
        visited.push("endVisitTextStyleNameNode");
        visited.push(n);
    };

    visitor.endVisitTextNode = (n) => {
        visited.push("endVisitTextNode");
        visited.push(n);
    };

    const node = new TextStyleNameNode("style-1234");
    visitor.accept(node);

    expect(visited).toEqual([
        "startVisitTextNode", node,
        "startVisitTextStyleNameNode", node,
        "endVisitTextStyleNameNode", node,
        "endVisitTextNode", node]);
});

test("accept TextStyleNameNode with children", () => {
    var visited = [];

    const visitor = new TextNodeVisitor();
    visitor.startVisitTextNode = (n) => {
        visited.push("startVisitTextNode");
        visited.push(n);
        return true;
    };

    visitor.visitText = (n) => {
        visited.push("visitText");
        visited.push(n);
    };

    visitor.startVisitTextStyleNameNode = (n) => {
        visited.push("startVisitTextStyleNameNode");
        visited.push(n);
        return true;
    };
    visitor.endVisitTextStyleNameNode = (n) => {
        visited.push("endVisitTextStyleNameNode");
        visited.push(n);
    };

    visitor.endVisitTextNode = (n) => {
        visited.push("endVisitTextNode");
        visited.push(n);
    };

    const text = new Text("Text-222");
    const textStyleNameNode = new TextStyleNameNode("style-111", [text]);

    visitor.accept(textStyleNameNode);

    expect(visited).toEqual([
        "startVisitTextNode", textStyleNameNode,
        "startVisitTextStyleNameNode", textStyleNameNode,

        "startVisitTextNode", text,
        "visitText", text,
        "endVisitTextNode", text,

        "endVisitTextStyleNameNode", textStyleNameNode,
        "endVisitTextNode", textStyleNameNode
    ]);
});

// TextStyleNode........................................................................................................

test("accept TextStyleNode", () => {
    var visited = [];

    const visitor = new TextNodeVisitor();
    visitor.startVisitTextNode = (n) => {
        visited.push("startVisitTextNode");
        visited.push(n);
        return true;
    };

    visitor.startVisitTextStyleNode = (n) => {
        visited.push("startVisitTextStyleNode");
        visited.push(n);
        return true;
    };
    visitor.endVisitTextStyleNode = (n) => {
        visited.push("endVisitTextStyleNode");
        visited.push(n);
    };

    visitor.endVisitTextNode = (n) => {
        visited.push("endVisitTextNode");
        visited.push(n);
    };

    const node = new TextStyleNode(TextStyle.EMPTY);
    visitor.accept(node);

    expect(visited).toEqual([
        "startVisitTextNode", node,
        "startVisitTextStyleNode", node,
        "endVisitTextStyleNode", node,
        "endVisitTextNode", node]);
});

test("accept TextStyleNode with children", () => {
    var visited = [];

    const visitor = new TextNodeVisitor();
    visitor.startVisitTextNode = (n) => {
        visited.push("startVisitTextNode");
        visited.push(n);
        return true;
    };

    visitor.visitText = (n) => {
        visited.push("visitText");
        visited.push(n);
    };

    visitor.startVisitTextStyleNode = (n) => {
        visited.push("startVisitTextStyleNode");
        visited.push(n);
        return true;
    };
    visitor.endVisitTextStyleNode = (n) => {
        visited.push("endVisitTextStyleNode");
        visited.push(n);
    };

    visitor.endVisitTextNode = (n) => {
        visited.push("endVisitTextNode");
        visited.push(n);
    };

    const text = new Text("Text-222");
    const textStyleNode = new TextStyleNode(TextStyle.EMPTY, [text]);

    visitor.accept(textStyleNode);

    expect(visited).toEqual([
        "startVisitTextNode", textStyleNode,
        "startVisitTextStyleNode", textStyleNode,

        "startVisitTextNode", text,
        "visitText", text,
        "endVisitTextNode", text,

        "endVisitTextStyleNode", textStyleNode,
        "endVisitTextNode", textStyleNode
    ]);
});

