/**
 * Base class for all classes defining some shared members.
 */
import Preconditions from "./Preconditions.js";

const typeNameToFromJson = new Map();

export default class SystemObject {

    static throwUnsupportedOperation() {
        throw new Error("Not yet implemented");
    }
    
    /**
     * All classes that support json marshalling and unmarshalling need to register.
     */
    static register(typeName, fromJson) {
        Preconditions.requireNonEmptyText(typeName, "typeName");
        Preconditions.requireFunction(fromJson, "fromJson");

        typeNameToFromJson.set(typeName, fromJson);
    }

    /**
     * Unmarshalls the json which has a type and value.
     */
    static fromJsonWithType(json) {
        var result;

        const typeType = typeof json;
        switch(typeType) {
            case "boolean":
            case "number":
            case "string":
                result = json;
                break;
            case "object":
                if(Array.isArray(json)){
                    jsonWithTypeFail(json);
                }
                if(json){
                    const {type, value} = json;
                    Preconditions.requireNonEmptyText(type, "type");

                    const unmarshaller = typeNameToFromJson.get(type);
                    if(!unmarshaller){
                        throw new Error("Unable to find unmarshaller for " + type);
                    }
                    result = unmarshaller(value);
                }else {
                    result = null;
                }
                break;
            default:
                jsonWithTypeFail(json);
        }

        return result;
    }

    /**
     * Unmarshalls the json array using the element factory function.
     */
    static fromJsonList(json, element) {
        if(!json){
            throw new Error("Missing array");
        }
        if(!Array.isArray(json)){
            throw new Error("Expected array json got " + json);
        }
        Preconditions.requireFunction(element, "element");
        return json.map(e => element(e));
    }

    /**
     * Unmarshalls a json array where each element has its type set.
     */
    static fromJsonListWithType(json) {
        return SystemObject.fromJsonList(
            json,
            SystemObject.fromJsonWithType
        );
    }

    static toJsonWithType(value) {
        if(Array.isArray(value)){
            jsonWithTypeFail(value);
        }
        let json;

        if(value instanceof SystemObject){
            json = value.toJsonWithType();
        }else {
            if(!value){
                json = value;
            }else {
                const type = typeof value;
                switch(type) {
                    case "boolean":
                    case "number":
                    case "string":
                        json = value;
                        break;
                    case "object":
                    case "function":
                    default:
                        throw new Error("Unsupported type " + value);
                }
            }
        }

        return json;
    }

    // eslint-disable-next-line no-useless-constructor
    constructor() {
    }

    equals(other) {
        return this === other;
    }

    toJson() {
        SystemObject.throwUnsupportedOperation();
    }

    typeName() {
        SystemObject.throwUnsupportedOperation();
    }

    toJsonWithType() {
        return {
            type: this.typeName(),
            value: this.toJson()
        };
    }
}

function jsonWithTypeFail(json) {
    throw new Error("Expected boolean/string/null/number/object got " + json);
}

function unmarshallDouble(json) {
    if(typeof json !== "number"){
        throw new Error("Expected number got " + JSON.stringify(json));
    }
    return json;
}

SystemObject.register("double", unmarshallDouble);

function unmarshallString(json) {
    if(typeof json !== "string"){
        throw new Error("Expected string got " + JSON.stringify(json));
    }
    return json;
}

SystemObject.register("string", unmarshallString);
