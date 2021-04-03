import NoneLength from "./NoneLength.js";
import PixelLength from "./PixelLength.js";

export default function lengthFromJson(text) {
    if(!text){
        throw new Error("Missing text");
    }
    if(typeof text !== "string"){
        throw new Error("Expected string got " + text);
    }

    let length;
    switch(text) {
        case "0":
        case "0px":
        case "none":
            length = NoneLength.INSTANCE;
            break;
        default:
            length = PixelLength.fromJson(text);
            break;
    }

    return length;
}
