import TextPlaceholderNode from "./TextPlaceholderNode";
import TextStyleNode from "./TextStyleNode";
import TextStyleNameNode from "./TextStyleNameNode";
import Text from "./Text";
import {PLACEHOLDER, STYLE, STYLE_NAME, TEXT} from "./TextNode";
import {TextStyle} from "./TextStyle";

/**
 * Parses the provided marshalled JSON form of Text and its sub classes back into instances.
 * To avoid circular references this is not placed on TextNode
 */
export default function fromJson(json) {
    const typeName = json.typeName;
    const value = json.value;

    switch (typeName) {
        case PLACEHOLDER:
            return new TextPlaceholderNode(value);
        case STYLE:
            return new TextStyleNode(new TextStyle(value.styles), array(value.children).map(c => fromJson(c)));
        case STYLE_NAME:
            return new TextStyleNameNode(value.styleName, array(value.children).map(c => fromJson(c)));
        case TEXT:
            return new Text(value);
        default:
            throw new Error("Unexpected type name \"" + typeName + "\" in " + JSON.stringify(json));
    }
}

function array(array) {
    return array || [];
}
