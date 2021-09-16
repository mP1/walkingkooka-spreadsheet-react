import UrlPath from "./UrlPath";

function urlPath() {
    return UrlPath.parse("/path?a=c");
}

// parse...............................................................................................................

function testParse(url, path, queryParameters) {
    test("Parse " + url, () => {
        const urlPath = UrlPath.parse(url);

        expect(urlPath.path())
            .toStrictEqual(path);
        expect(urlPath.queryParameters())
            .toStrictEqual(queryParameters);
    });
}

testParse("", "", {});
testParse("/", "/", {});
testParse("/abc", "/abc", {});
testParse("/abc%20def", "/abc def", {});
testParse("/abc/123", "/abc/123", {});

testParse("/abc?def",
    "/abc",
    {
        "def": []
    }
);

testParse("/abc?def=ghi",
    "/abc",
    {
        "def": ["ghi"]
    }
);

testParse("/abc?%20=xyz",
    "/abc",
    {
        " ": ["xyz"]
    }
);

testParse("/abc?def=%20",
    "/abc",
    {
        "def": [" "]
    }
);

testParse(
    "/abc?def=ghi&xyz=123",
    "/abc",
    {
        "def": ["ghi"],
        "xyz": ["123"],
    }
);

testParse("/abc?def=ghi&def=1",
    "/abc",
    {
        "def": ["ghi", "1"]
    }
);

// toQuerystring...............................................................................................................

function testToQueryString(queryParameters, queryString) {
    test("toQueryString " + JSON.stringify(queryParameters), () => {
        expect(UrlPath.toQueryString(queryParameters))
            .toStrictEqual(queryString);
    });
}

testToQueryString(
    {},
    ""
);

testToQueryString(
    {
        "a": []
    },
    "?a"
);

testToQueryString(
    {
        "a": ["1"]
    },
    "?a=1"
);

testToQueryString(
    {
        "x y": ["3 4"]
    },
    "?x%20y=3%204"
);

testToQueryString(
    {
        "a": ["11", "22"]
    },
    "?a=11&a=22"
);

testToQueryString(
    {
        "x": ["1234"],
        "y": ["5678"]
    },
    "?x=1234&y=5678"
);

testToQueryString(
    {
        "a": ["1", "2"],
        "b": ["99"]
    },
    "?a=1&a=2&b=99"
);

// setPath...............................................................................................................

function testSetPath(url, path, toString) {
    test("url setPath " + path, () => {
        expect(UrlPath.parse(url).setPath(path).toString())
            .toStrictEqual(toString);
    });
}

testSetPath(
    "/a/b",
    "/c",
    "/c"
);

testSetPath(
    "/a/b?x=y",
    "/c",
    "/c?x=y"
);

// setQueryParameters...............................................................................................................

function testSetQueryParameters(url, queryParameters, toString) {
    test("url setQueryParameters " + JSON.stringify(queryParameters), () => {
        expect(UrlPath.parse(url).setQueryParameters(queryParameters).toString())
            .toStrictEqual(toString);
    });
}

testSetQueryParameters(
    "/a/b?x=y",
    {},
    "/a/b"
);

testSetQueryParameters(
    "/a/b?x=y",
    {
        "1": [2],
        "3": [4],
    },
    "/a/b?1=2&3=4"
);

// setParameterValues...................................................................................................

function testSetParameterValues(url, name, values, toString) {
    test("url setParameterValues " + name + " " + JSON.stringify(values), () => {
        expect(UrlPath.parse(url).setParameterValues(name, values).toString())
            .toStrictEqual(toString);
    });
}

testSetParameterValues(
    "/a/b",
    "c",
    ["d"],
    "/a/b?c=d"
);

testSetParameterValues(
    "/a/b?x=y",
    "c",
    ["d"],
    "/a/b?x=y&c=d"
);

testSetParameterValues(
    "/a/b?x=y",
    "c",
    ["1", "2"],
    "/a/b?x=y&c=1&c=2"
);

// removeParameter...................................................................................................

function testRemoveParameter(url, name, toString) {
    test("url removeParameter " + name, () => {
        expect(UrlPath.parse(url).removeParameter(name).toString())
            .toStrictEqual(toString);
    });
}

testRemoveParameter(
    "/a/b",
    "unknown",
    "/a/b"
);

testRemoveParameter(
    "/a/b?x=y",
    "c",
    "/a/b?x=y"
);

testRemoveParameter(
    "/a/b?x=y&z=1",
    "z",
    "/a/b?x=y"
);

testRemoveParameter(
    "/a/b?x=y&z=1&z=2",
    "z",
    "/a/b?x=y"
);

// getParameterValues...................................................................................................

function testGetParameterValues(url, name, values) {
    test("url getParameterValues " + name + " " + JSON.stringify(values), () => {
        expect(UrlPath.parse(url).getParameterValues(name))
            .toStrictEqual(values);
    });
}

testGetParameterValues(
    "/a/b",
    "unknown",
    undefined
);

testGetParameterValues(
    "/a/b?x=y",
    "x",
    ["y"]
);

testGetParameterValues(
    "/a/b?q=r&x=1&x=2",
    "x",
    ["1", "2"]
);

// equals...............................................................................................................

test("equals different path", () => {
    expect(urlPath().equals(UrlPath.parse("/different")))
        .toBeFalse();
});

test("equals different query parameters", () => {
    expect(UrlPath.parse("/same?different=1").equals(UrlPath.parse("/same?different=23")))
        .toBeFalse();
});

// toString...............................................................................................................

function testToString(urlPath, toString) {
    test("toString " + urlPath, () => {
        expect(UrlPath.parse(urlPath).toString())
            .toStrictEqual(toString);
    });
}

testToString("/a/b", "/a/b");
testToString("/a/b?", "/a/b");
testToString("/a/b?x=y", "/a/b?x=y");
