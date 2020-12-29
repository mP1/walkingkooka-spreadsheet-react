import Text from "./Text";
import TextNode from "./TextNode";
import TextPlaceholderNode from "./TextPlaceholderNode";
import TextStyle from "./TextStyle";
import TextStyleNameNode from "./TextStyleNameNode";
import TextStyleNode from "./TextStyleNode";

/**
 * Parses the provided marshalled JSON form of Text and its sub classes back into instances.
 * To avoid circular references this is not placed on TextNode
 */
export default function textNodeJsonSupportFromJson(json) {
    if(!json){
        throw new Error("Missing json");
    }
    if(typeof json !== "object"){
        throw new Error("Expected object json got " + json);
    }

    const {type, value} = json;
    if(!type){
        throw new Error("Missing type got " + JSON.stringify(json));
    }
    if(typeof type !== "string"){
        throw new Error("Expected String type got " + JSON.stringify(json));
    }
    switch(typeof value) {
        case "undefined":
            throw new Error("Missing value got " + JSON.stringify(json));
        default:
            break;
    }

    switch(type) {
        case TextNode.PLACEHOLDER:
            return new TextPlaceholderNode(value);
        case TextNode.STYLE:
            return new TextStyleNode(TextStyle.fromJson(value.styles), array(value.children).map(c => textNodeJsonSupportFromJson(c)));
        case TextNode.STYLE_NAME:
            return new TextStyleNameNode(value.styleName, array(value.children).map(c => textNodeJsonSupportFromJson(c)));
        case TextNode.TEXT:
            return new Text(value);
        default:
            throw new Error("Unexpected type name \"" + type + "\" in " + JSON.stringify(json));
    }
}

function array(array) {
    return array || [];
}
