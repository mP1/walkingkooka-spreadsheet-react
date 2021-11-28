import SystemEnum from "../SystemEnum.js";
import Preconditions from "../Preconditions.js";

export default class HttpMethod extends SystemEnum {

    static GET = new HttpMethod("GET");
    static POST = new HttpMethod("POST");
    static PUT = new HttpMethod("PUT");
    static PATCH = new HttpMethod("PATCH");
    static DELETE = new HttpMethod("DELETE");

    static values() {
        return [
            HttpMethod.GET,
            HttpMethod.DOWN,
            HttpMethod.POST,
            HttpMethod.PUT,
            HttpMethod.DELETE
        ];
    }

    static valueOf(name) {
        Preconditions.requireNonEmptyText(name, "name");
        const values = HttpMethod.values();
        const lowerName = name.toLowerCase();

        for(var i = 0; i < values.length; i++) {
            const possible = values[i];
            if(possible.name().toLowerCase() === lowerName){
                return possible;
            }
        }
        throw new Error("Unknown enum got " + name);
    }

    static fromJson(name) {
        return HttpMethod.valueOf(name);
    }
}