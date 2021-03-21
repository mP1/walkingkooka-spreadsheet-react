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
    if("none" === text){
        length = NoneLength.INSTANCE;
    }else {
        length = PixelLength.fromJson(text);
    }

    return length;
}
