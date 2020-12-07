/**
 * Collection of utilities related to equality.
 */
export default class Equality {

    static safeEquals(left, right) {
        return left === right ||
            (left && left.equals && left.equals(right) || left === right);
    }
}