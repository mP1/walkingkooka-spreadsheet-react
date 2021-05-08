/**
 * A Visitor for {@link TextNode} and sub classes.
 */
import Preconditions from "../Preconditions.js";
import TextNode from "./TextNode";

export default class TextNodeVisitor {

    constructor() {
    }

    accept(node) {
        Preconditions.requireNonNullInstance(node, TextNode, "node");

        if(this.startVisitTextNode(node)){
            node.accept(this);
        }
        this.endVisitTextNode(node);
    }

    startVisitTextNode(node) {
        return true;
    }

    endVisitTextNode(node) {
    }

    visitText(text) {
        return true;
    }

    visitTextPlaceholderNode(placeholder) {
        return true;
    }

    startVisitTextStyleNameNode(styleName) {
        return true;
    }

    endVisitTextStyleNameNode(styleName) {
    }

    startVisitTextStyleNode(style) {
        return true;
    }

    endVisitTextStyleNode(style) {
    }

    /**
     * Accepts each child node one by one.
     */
    acceptChildren(children) {
        children.forEach(c => this.accept(c));
    }
}