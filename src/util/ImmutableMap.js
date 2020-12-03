/**
 * An immutable Map, that is a wrapper for the native Map with a few gotchas.
 * <ul>
 * <li>Internally keys are converted to String before the lookup using the wrapped Map is performed.</li>
 * <li>Equals also tries to compare values using equals falling back to triple equals ===</li>
 * <li>toJson tries each toJson for each value during the toJson process.</li>
 * </ul>
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
     * Returns a new {@link ImmutableMap} that combines the entries of this with the new map. Entries with the same key
     * in the new will replace those in the old.
     */
    set(map) {
        if (!map) {
            throw new Error("Missing map");
        }
        if (!(map instanceof ImmutableMap)) {
            throw new Error("Expected ImmutableMap map got " + map);
        }

        return map.isEmpty() ?
            this :
            this.isEmpty() ?
                map :
                merge(this, map);
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

    equals(other) {
        return this === other || (other instanceof ImmutableMap && equals0(this.map, other.map));
    }

    toString() {
        return JSON.stringify(this.toJson());
    }
}

function merge(map, other) {
    const merged = new ImmutableMap(new Map([...map.map, ...other.map]));
    return map.equals(merged) ?
        map :
        merged;
}

function equals0(map, other) {
    return map.size === other.size && equals1(map, other);
}

function equals1(map, other) {
    var result = true;

    for (const [key, value] of map.entries()) {
        const otherValue = other.get(key);
        result = (value && value.equals && value.equals(otherValue)) || value === otherValue;
        if (!result) {
            break;
        }
    }
    return result;
}