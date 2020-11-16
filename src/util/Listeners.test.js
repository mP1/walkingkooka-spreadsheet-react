import Listeners from "./Listeners";

test("listeners add missing fails", () => {
    expect(() => new Listeners().add(null)).toThrow("Missing listener");
});

test("listeners add non function fails", () => {
    expect(() => new Listeners().add("!invalid")).toThrow("Expected function listener got !invalid");
});

test("listeners remove missing fails", () => {
    expect(() => new Listeners().remove(null)).toThrow("Missing listener");
});

test("listeners remove non function fails", () => {
    expect(() => new Listeners().remove("!invalid")).toThrow("Expected function listener got !invalid");
});

test("listeners dispatch", () => {
   var fired = false;
   const value = {"hello": 123};
    const listeners = new Listeners();
    listeners.add((v) => {
        expect(v).toBe(value);
        fired = true;
    })
    listeners.dispatch(value);
    expect(fired).toBe(true);
});

test("listeners remove", () => {
    const listeners = new Listeners();

    const removed = () => {};
    listeners.add(removed);
    listeners.remove(removed);

    expect(listeners.listeners).toStrictEqual([]);
});

test("listeners add & remove", () => {
    const listeners = new Listeners();

    const added = () => {};
    listeners.add(added);

    const removed = () => {};
    listeners.add(removed);
    listeners.remove(removed);

    expect(listeners.listeners).toStrictEqual([added]);
});

test("listeners add & remove 2", () => {
    const listeners = new Listeners();

    const removed = () => {};
    listeners.add(removed);

    const added = () => {};
    listeners.add(added);

    listeners.remove(removed);

    expect(listeners.listeners).toStrictEqual([added]);
});

test("listeners dispatch after remove", () => {
    var fired = false;
    const value = {"hello": 123};
    const listeners = new Listeners();

    const added = (v) => {
        expect(v).toBe(value);
        fired = true;
    };
    listeners.add(added);
    
    const removed = (v) => {
        throw new Error("Should have been removed");
    }
    listeners.add(removed);
    listeners.remove(removed);

    expect(listeners.listeners).toStrictEqual([added]);

    listeners.dispatch(value);
    expect(fired).toBe(true);
});