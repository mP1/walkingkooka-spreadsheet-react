import Equality from "../Equality.js";
import SystemObject from "../SystemObject.js";

/**
 * Represents a url path with methods to get the path and parameters.
 */
export default class UrlPath extends SystemObject {

    static parse(url) {
        const decoded = decodeURI(url);

        const queryParameterStart = decoded.indexOf("?");
        const path = queryParameterStart >= 0 ? decoded.substring(0, queryParameterStart) : decoded;
        const queryString = queryParameterStart >= 0 ? decoded.substring(queryParameterStart + 1) : "";

        const queryParameters = {};
        if(queryString){
            const parameters = queryString.split("&");
            for(const nameAndValue of parameters) {
                const equalsSign = nameAndValue.indexOf("=");
                const name = decodeURIComponent(equalsSign >= 0 ? nameAndValue.substring(0, equalsSign) : nameAndValue);
                const value = equalsSign >= 0 ? decodeURIComponent(nameAndValue.substring(equalsSign + 1)) : null;

                var all = queryParameters[name];
                if(null == all){
                    all = [];
                    queryParameters[name] = all;
                }
                if(null != value){
                    all.push(value);
                }
            }
        }

        return new UrlPath(path, queryParameters, decoded);
    }

    constructor(path, queryParameters, url) {
        super();
        this.pathValue = path;
        this.queryParametersValue = queryParameters;
        this.urlValue = url;
    }

    path() {
        return this.pathValue;
    }

    queryParameters() {
        return Object.assign({}, this.queryParametersValue);
    }

    equals(other) {
        return this === other ||
            (other instanceof UrlPath &&
                this.path() === other.path() &&
                Equality.safeEquals(this.queryParameters(), other.queryParameters()));
    }

    toString() {
        return this.url();
    }
}
