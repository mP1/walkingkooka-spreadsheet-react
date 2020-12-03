/**
 * A wrapper for the native Map using the toString for keys as well as being immutable.
 */
export default class ImmutableMap {

    /**
     * An empty {@link ImmutableMap}
     */
    static EMPTY = new ImmutableMap(new Map());

    /**
     * Transforms the json into a {@link ImmutableMap} using the keyParser to validate keys and valueUnmarshaller to unmarshall values.
     */
    static fromJson(json, keyParser, valueUnmarshaller) {
        if (!json) {
            throw new Error("Missing json");
        }
        if (typeof json !== "object") {
            throw new Error("Expected object json got " + json);
        }
        if (!keyParser) {
            throw new Error("Missing key parser");
        }
        if (typeof keyParser !== "function") {
            throw new Error("Expected function key parser got " + keyParser);
        }
        if (!valueUnmarshaller) {
            throw new Error("Missing valueUnmarshaller");
        }
        if (typeof valueUnmarshaller !== "function") {
            throw new Error("Expected function valueUnmarshaller got " + valueUnmarshaller);
        }

        const map = new Map();
        for (const [key, value] of Object.entries(json)) {
            keyParser(key);
            map.set(key, valueUnmarshaller(value));
        }

        return new ImmutableMap(map);
    }

    /**
     * Creates a new {@link ImmutableMap}
     */
    constructor(map) {
        if (!map) {
            throw new Error("Missing map");
        }
        if (!(map instanceof Map)) {
            throw new Error("Expected Map map got " + map);
        }

        this.map = new Map(map);
    }

    /**
     * Returns the value for the given key.
     */
    get(key) {
        return this.map.get(key.toString());
    }

    /**
     * Returns true if the map is empty that is has no entries.
     */
    isEmpty() {
        return 0 === this.size();
    }

    /**
     * Returns the number of entries in the map.
     */
    size() {
        return this.map.size;
    }

    /**
     * Returns a Map assumes the keys are strings.
     */
    toMap() {
        return new Map(this.map);
    }

    /**
     * Turns this map into JSON.
     */
    toJson() {
        let json = {};
        for (const [key, value] of this.map.entries()) {
            json[key.toString()] = (value.toJson && value.toJson()) || value;
        }
        return json;
    }

    toString() {
        return JSON.stringify(this.toJson());
    }
}

