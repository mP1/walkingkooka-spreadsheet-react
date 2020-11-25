import TextNode, {STYLE_NAME} from "./TextNode";
import TextStyle from "./TextStyle";

export default class TextStyleNameNode extends TextNode {

    constructor(styleName, children) {
        super();
        this.styleNameValue = styleName;
        this.childrenValue = children || [];
    }

    styleName() {
        return this.styleNameValue;
    }

    styles() {
        return TextStyle.EMPTY;
    }

    children() {
        return this.childrenValue;
    }

    typeName() {
        return STYLE_NAME;
    }

    value() {
        const value = {
            styleName: this.styleName()
        }
        const children = this.children();
        if (children && children.length > 0) {
            value.children = children.map(c => c.toJson());
        }
        return value;
    }

    accept(textNodeVisitor) {
        if(textNodeVisitor.startVisitTextStyleNameNode(this)) {
            textNodeVisitor.acceptChildren(this.children());
        }
        textNodeVisitor.endVisitTextStyleNameNode(this);
    }

    toHtml() {
        throw new Error("Unsupported: toHtml");
    }
}