import Equality from "../Equality.js";
import Preconditions from "../Preconditions.js";
import SystemObject from "../SystemObject.js";

/**
 * Represents a url path with methods to get the path and parameters.
 */
export default class RelativeUrl extends SystemObject {

    static toQueryString(firstSeparator, parameters) {
        Preconditions.requireText(firstSeparator, "firstSeparator");
        Preconditions.requireObject(parameters, "parameters");

        const components = [];

        for (const [name, values] of Object.entries(parameters)) {
            const encodedName = encodeURIComponent(name);

            if(values.length > 0) {
                values.forEach((v) => {
                    components.push(components.length > 0 ? "&" : firstSeparator);

                    components.push(encodedName);
                    components.push("=");
                    components.push(encodeURIComponent(v));
                });
            } else {
                components.push(components.length > 0 ? "&" : firstSeparator);

                components.push(encodedName);
            }
        }

        return components.join("");
    }

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

        return new RelativeUrl(path, queryParameters);
    }

    constructor(path, queryParameters) {
        super();
        this.pathValue = path;
        this.queryParametersValue = queryParameters;
    }

    path() {
        return this.pathValue;
    }

    setPath(path) {
        Preconditions.requireText(path, "path");

        return new RelativeUrl(path, this.queryParameters());
    }

    queryParameters() {
        return Object.assign({}, this.queryParametersValue);
    }

    setQueryParameters(queryParameters) {
        Preconditions.requireObject(queryParameters, "queryParameters");

        const copy = {};

        return new RelativeUrl(
            this.path(),
            Object.assign(copy, queryParameters)
        );
    }

    getParameterValues(name) {
        Preconditions.requireText(name, "name");

        const values = this.queryParameters()[name];
        return values && values.slice();
    }

    firstParameterValue(name) {
        const values = this.getParameterValues(name);
        return values && values[0];
    }

    setParameterValues(name, values) {
        Preconditions.requireText(name, "name");
        Preconditions.requireArray(values, "values");

        const parameters = this.queryParameters();
        parameters[name] = values.slice();
        return this.setQueryParameters(parameters);
    }

    removeParameter(name) {
        Preconditions.requireText(name, "name");

        const parameters = this.queryParameters();
        delete parameters[name];
        return this.setQueryParameters(parameters);
    }

    equals(other) {
        return this === other ||
            (other instanceof RelativeUrl &&
                this.path() === other.path() &&
                Equality.safeEquals(this.queryParameters(), other.queryParameters()));
    }

    toString() {
        return this.path() + RelativeUrl.toQueryString("?", this.queryParameters());
    }
}
