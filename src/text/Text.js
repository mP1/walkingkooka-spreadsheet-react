import {TextNode, TEXT} from "./TextNode";

/**
 * Base class for several text sub classes that live in walkingkooka.text.*
 */
export default class Text extends TextNode {

    constructor(text) {
        super();
        this.text = text;
    }

    typeName() {
        return TEXT;
    }

    value() {
        return this.text;
    }
}