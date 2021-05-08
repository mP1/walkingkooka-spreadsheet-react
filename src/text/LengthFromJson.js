import NoneLength from "./NoneLength.js";
import PixelLength from "./PixelLength.js";
import Preconditions from "../Preconditions.js";

export default function lengthFromJson(text) {
    Preconditions.requireText(text, "text");

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
