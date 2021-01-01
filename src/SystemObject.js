/**
 * Base class for all classes defining some shared members.
 */
const typeNameToFromJson = new Map();

export default class SystemObject {

    /**
     * All classes that support json marshalling and unmarshalling need to register.
     */
    static register(typeName, fromJson) {
        if(!typeName){
            throw new Error("Missing typeName");
        }
        if(typeof typeName !== "string"){
            throw new Error("Expected string typeName got " + typeName);
        }
        if(!fromJson){
            throw new Error("Missing function fromJson");
        }
        if(typeof fromJson !== "function"){
            throw new Error("Expected function fromJson got " + fromJson);
        }
        typeNameToFromJson.set(typeName, fromJson);
    }

    /**
     * Unmarshalls the json which has a type and value.
     */
    static fromJsonWithType(json) {
        if(!json){
            throw new Error("Missing json");
        }
        if(typeof json !== "object"){
            throw new Error("Expected object json got " + json);
        }
        const {type, value} = json;
        if(!type){
            throw new Error("Missing type got " + json);
        }
        if(typeof type !== "string"){
            throw new Error("Expected string type got " + type);
        }
        const unmarshaller = typeNameToFromJson.get(type);
        if(!unmarshaller){
            throw new Error("Unable to find unmarshaller for " + type);
        }
        return unmarshaller(value);
    }

    // eslint-disable-next-line no-useless-constructor
    constructor() {
    }

    equals(other) {
        return this === other;
    }

    toJson() {
        throw new Error("Not yet implemented.");
    }

    typeName() {
        throw new Error("Not yet implemented.");
    }

    toJsonWithType() {
        return {
            type: this.typeName(),
            value: this.toJson()
        };
    }
}

function unmarshallString(json) {
    if(typeof json !== "string"){
        throw new Error("Expected string got " + JSON.stringify(json));
    }
    return json;
}

SystemObject.register("string", unmarshallString);
