import Equality from "../Equality.js";
import TextNode from "./TextNode";
import TextStyle from "./TextStyle";

// TODO SystemObject.register
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
        return TextNode.STYLE_NAME;
    }

    toJson() {
        const value = {
            styleName: this.styleName()
        }
        const children = this.children();
        if(children && children.length > 0){
            value.children = children.map(c => c.toJsonWithType());
        }
        return value;
    }

    accept(textNodeVisitor) {
        if(textNodeVisitor.startVisitTextStyleNameNode(this)){
            textNodeVisitor.acceptChildren(this.children());
        }
        textNodeVisitor.endVisitTextStyleNameNode(this);
    }

    render() {
        throw new Error("Unsupported: render");
    }

    equals(other) {
        return other instanceof TextStyleNameNode &&
            this.styleName() === other.styleName() &&
            Equality.safeEquals(this.children(), other.children());
    }
}