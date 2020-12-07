/**
 * Collection of utilities related to equality.
 */
export default class Equality {

    static safeEquals(left, right) {
        return (Array.isArray(left) && equalsArray(left, right)) ||
            (typeof left === "object" && equalsObject(left, right)) ||
            left === right;
    }
}

function equalsArray(left, right) {
    var equals = Array.isArray(right);

    if (equals) {
        const length = left.length;
        equals = length === right.length;

        if (equals) {
            for (var i = 0; equals && i < length; i++) {
                equals = Equality.safeEquals(left[i], right[i]);
            }
        }
    }

    return equals;
}

function equalsObject(left, right) {
    return (left && left.equals && left.equals(right)) || left === right;
}