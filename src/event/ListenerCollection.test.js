import ListenerCollection from "./ListenerCollection.js";

test("Add listener", () => {
    const l = new ListenerCollection();
    l.add(() => {
    });
    expect(
        l.listeners.length
    ).toStrictEqual(1);
});

test("Add listener then remove", () => {
    const l = new ListenerCollection();
    const r = l.add(() => {
    });
    r();
    expect(
        l.listeners.length
    ).toStrictEqual(0);
});

test("Add 2 listeners then remove 1", () => {
    const l = new ListenerCollection();
    const r1 = l.add(() => {
    });
    const r2 = l.add(() => {
    });

    r1();
    expect(
        l.listeners.length
    ).toStrictEqual(1);
});

test("fire 1x event 1x listener", () => {
    const fired = [];

    const l = new ListenerCollection();
    l.add((v) => {
        fired.push(v);
    });

    l.fire("a1");
    expect(
        fired
    ).toStrictEqual(["a1"]);
});

test("fire 1x null event value 1x listener", () => {
    const fired = [];

    const l = new ListenerCollection();
    l.add((v) => {
        fired.push(v);
    });

    l.fire(null);
    expect(
        fired
    ).toStrictEqual([null]);
});

test("fire 1x multi parameters 1x listener", () => {
    const fired = [];

    const l = new ListenerCollection();
    l.add((p1, p2, p3) => {
        fired.push(p1);
        fired.push(p2);
        fired.push(p3);
    });

    l.fire(1, 2, 3);
    expect(
        fired
    ).toStrictEqual([1, 2, 3]);
});

test("fire 1 event 2x listeners", () => {
    const fired = [];

    const l = new ListenerCollection();
    l.add((v) => {
        fired.push(v);
    });

    l.add((v) => {
        fired.push(v + "!");
    });

    l.fire("a1");

    expect(
        fired
    ).toStrictEqual(["a1", "a1!"]);
});

test("fire 2x events 1x listener", () => {
    const fired = [];

    const l = new ListenerCollection();
    l.add((v) => {
        fired.push(v);
    });

    l.fire("a1");
    l.fire("b2");

    expect(
        fired
    ).toStrictEqual(["a1", "b2"]);
});

test("fire 2x events 2x listeners", () => {
    const fired = [];

    const l = new ListenerCollection();
    l.add((v) => {
        fired.push(v);
    });

    l.add((v) => {
        fired.push(v + "!");
    });

    l.fire("a1");
    l.fire("b2");

    expect(
        fired
    ).toStrictEqual(["a1", "a1!", "b2", "b2!"]);
});