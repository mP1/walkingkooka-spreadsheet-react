/**
 * An immutable Map, that is a wrapper for the native Map with a few gotchas.
 * <ul>
 * <li>Internally keys are converted to String before the lookup using the wrapped Map is performed.</li>
 * <li>Equals also tries to compare values using equals falling back to triple equals ===</li>
 * <li>toJson tries each toJson for each value during the toJson process.</li>
 * </ul>
 */
import Equality from "../Equality.js";
import Preconditions from "../Preconditions.js";

export default class ImmutableMap {

    /**
     * An empty {@link ImmutableMap}
     */
    static EMPTY = new ImmutableMap(new Map());

    /**
     * Transforms the json into a {@link ImmutableMap} using the keyParser to validate keys and valueUnmarshaller to unmarshall values.
     */
    static fromJson(json, keyParser, valueUnmarshaller) {
        Preconditions.requireObject(json, "json");
        Preconditions.requireFunction(keyParser, "keyParser");
        Preconditions.requireFunction(valueUnmarshaller, "valueUnmarshaller");

        const map = new Map();
        for(const [key, value] of Object.entries(json)) {;
            map.set(
                keyParser(key).toMapKey(),
                valueUnmarshaller(value)
            );
        }

        return new ImmutableMap(map);
    }

    /**
     * Creates a new {@link ImmutableMap}
     */
    constructor(map) {
        Preconditions.requireInstance(map, Map, "map");

        this.map = new Map(map);
    }

    /**
     * Returns the value for the given key.
     */
    get(key) {
        return this.map.get(key.toMapKey());
    }

    /**
     * Removes the value with the given key returning a new ImmutableMap.
     */
    remove(key) {
        const copy = new Map([...this.map]);
        copy.delete(key.toMapKey());
        return new ImmutableMap(copy);
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
    setAll(map) {
        Preconditions.requireInstance(map, ImmutableMap, "map");

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
        for(const [key, value] of this.map.entries()) {
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

    for(const [key, value] of map.entries()) {
        result = Equality.safeEquals(value, other.get(key));
        if(!result){
            break;
        }
    }
    return result;
}