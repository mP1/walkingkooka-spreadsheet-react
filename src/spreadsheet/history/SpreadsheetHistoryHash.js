import ListenerCollection from "../../event/ListenerCollection.js";
import Preconditions from "../../Preconditions.js";
import spreadsheetCellReferenceOrLabelNameFromJson from "../reference/SpreadsheetCellReferenceOrLabelNameFromJson.js";
import SpreadsheetLabelName from "../reference/SpreadsheetLabelName.js";
import SpreadsheetName from "../SpreadsheetName.js";
import SpreadsheetSelection from "../reference/SpreadsheetSelection.js";

function tokenize(pathname) {
    return pathname && pathname.startsWith("/") ?
        split(pathname) :
        [];
}

function split(pathname) {
    const components = pathname.split("/");
    components.shift();
    return components;
}

function isSettingsToken(token) {
    var valid;

    switch(token) {
        case SpreadsheetHistoryHash.SETTINGS_METADATA:
        case SpreadsheetHistoryHash.SETTINGS_TEXT:
        case SpreadsheetHistoryHash.SETTINGS_NUMBER:
        case SpreadsheetHistoryHash.SETTINGS_DATE_TIME:
        case SpreadsheetHistoryHash.SETTINGS_STYLE:
            valid = true;
            break;
        default:
            valid = false;
            break;
    }
    return valid;
}

/**
 * A collection of utilities that support history hash.
 */
export default class SpreadsheetHistoryHash {

    static SPREADSHEET_ID = "spreadsheet-id";
    static SPREADSHEET_NAME = "spreadsheet-name";
    static SPREADSHEET_NAME_EDIT = "name";
    static CELL = "cell";
    static CELL_FORMULA = "formula";
    static LABEL = "label";
    static NAVIGATE = "navigate";
    static SETTINGS = "settings";
    static SETTINGS_SECTION = "settings-section";

    // these tokens are optional and only one may appear after SETTINGS
    static SETTINGS_METADATA = "metadata";
    static SETTINGS_TEXT = "text";
    static SETTINGS_NUMBER = "number";
    static SETTINGS_DATE_TIME = "date-time";
    static SETTINGS_STYLE = "style";

    /**
     * Parsers the path extracting tokens returning an object with valid tokens. Invalid combination will be removed.
     */
    static parse(hash, errors) {
        Preconditions.requireText(hash, "hash");
        Preconditions.requireFunction(errors, "errors");

        const sourceTokens = tokenize(hash);
        const spreadsheetId = sourceTokens.shift();
        const tokens = {};

        if(spreadsheetId){
            tokens[SpreadsheetHistoryHash.SPREADSHEET_ID] = spreadsheetId;

            try {
                tokens[SpreadsheetHistoryHash.SPREADSHEET_NAME] = new SpreadsheetName(sourceTokens.shift());

                const tokens2 = {};
                var valid = true;
                var cell = null;

                while(sourceTokens.length > 0 && valid) {
                    const token = sourceTokens.shift();

                    switch(token) {
                        case SpreadsheetHistoryHash.SPREADSHEET_NAME_EDIT:
                            tokens2[SpreadsheetHistoryHash.SPREADSHEET_NAME_EDIT] = true;
                            break;
                        case SpreadsheetHistoryHash.CELL:
                            if(sourceTokens.length === 0){
                                valid = false;
                                break;
                            }

                            try {
                                cell = spreadsheetCellReferenceOrLabelNameFromJson(sourceTokens.shift());
                            } catch(invalid) {
                                errors("Cell: " + invalid.message);
                                valid = false;
                            }
                            tokens2[SpreadsheetHistoryHash.CELL] = cell;
                            break;
                        case SpreadsheetHistoryHash.CELL_FORMULA:
                            if(!cell){
                                valid = false;
                                break;
                            }
                            tokens2[SpreadsheetHistoryHash.CELL_FORMULA] = true;
                            break;
                        case SpreadsheetHistoryHash.LABEL:
                            if(sourceTokens.length === 0){
                                valid = false;
                                break;
                            }

                            var label = null;
                            try {
                                label = SpreadsheetLabelName.parse(sourceTokens.shift());
                            } catch(invalid) {
                                errors("Label: " + invalid.message);
                                valid = false;
                            }
                            tokens2[SpreadsheetHistoryHash.LABEL] = label;
                            break;
                        case SpreadsheetHistoryHash.NAVIGATE:
                            tokens2[SpreadsheetHistoryHash.NAVIGATE] = true;
                            break;
                        case SpreadsheetHistoryHash.SETTINGS:
                            tokens2[SpreadsheetHistoryHash.SETTINGS] = true;
                            const possibleSection = sourceTokens.shift();
                            if(null != possibleSection){
                                if(isSettingsToken(possibleSection)){
                                    tokens2[SpreadsheetHistoryHash.SETTINGS_SECTION] = possibleSection;
                                }
                            }
                            valid = true;
                            break;
                        default:
                            valid = false;
                            break;
                    }
                }

                if(valid) {
                    Object.assign(tokens, tokens2);
                }
            } catch(ignore) {
            }
        }

        return SpreadsheetHistoryHash.validate(tokens);
    }

    /**
     * Verifies the given tokens are valid, for example formula cannot be set if cell if absent.
     */
    static validate(tokens) {
        var spreadsheetId = tokens[SpreadsheetHistoryHash.SPREADSHEET_ID];
        var spreadsheetName = tokens[SpreadsheetHistoryHash.SPREADSHEET_NAME];
        var nameEdit = tokens[SpreadsheetHistoryHash.SPREADSHEET_NAME_EDIT];
        var cell = tokens[SpreadsheetHistoryHash.CELL];
        var formula = tokens[SpreadsheetHistoryHash.CELL_FORMULA];
        var label = tokens[SpreadsheetHistoryHash.LABEL];
        var navigate = tokens[SpreadsheetHistoryHash.NAVIGATE];
        var settings = tokens[SpreadsheetHistoryHash.SETTINGS];
        var settingsSection = tokens[SpreadsheetHistoryHash.SETTINGS_SECTION];

        const verified = {};

        if(spreadsheetId){
            verified[SpreadsheetHistoryHash.SPREADSHEET_ID] = spreadsheetId;

            if(spreadsheetName){
                verified[SpreadsheetHistoryHash.SPREADSHEET_NAME] = spreadsheetName;
                if(nameEdit && (cell || label || navigate || settings)){
                    nameEdit = false;
                    cell = false;
                    label = false;
                    navigate = false;
                }
                if(nameEdit){
                    cell = false;
                    label = false;
                    navigate = false;
                }
                if(cell || label || navigate || settings){
                    nameEdit = false;
                }
                if(formula && !cell){
                    formula = false;
                }
                if(nameEdit){
                    verified[SpreadsheetHistoryHash.SPREADSHEET_NAME_EDIT] = nameEdit;
                }
                if(cell instanceof SpreadsheetSelection){
                    verified[SpreadsheetHistoryHash.CELL] = cell;
                    if(formula){
                        verified[SpreadsheetHistoryHash.CELL_FORMULA] = formula;
                    }
                }
                if(label instanceof SpreadsheetLabelName){
                    verified[SpreadsheetHistoryHash.LABEL] = label;
                }
                if(navigate){
                    verified[SpreadsheetHistoryHash.NAVIGATE] = navigate;
                }
                if(settings){
                    verified[SpreadsheetHistoryHash.SETTINGS] = settings;

                    if(settingsSection){
                        verified[SpreadsheetHistoryHash.SETTINGS_SECTION] = settingsSection;
                    }
                }
            }
        }

        return verified;
    }

    /**
     * Merges the two history has objects, using the delta to update and return a new object of hashes.
     */
    static merge(current, delta) {
        Preconditions.requireObject(current, "current");
        Preconditions.requireObject(delta, "delta");

        // get the current
        var spreadsheetId = current[SpreadsheetHistoryHash.SPREADSHEET_ID];
        var spreadsheetName = current[SpreadsheetHistoryHash.SPREADSHEET_NAME];
        var nameEdit = current[SpreadsheetHistoryHash.SPREADSHEET_NAME_EDIT];
        var cell = current[SpreadsheetHistoryHash.CELL];
        var formula = current[SpreadsheetHistoryHash.CELL_FORMULA];
        var label = current[SpreadsheetHistoryHash.LABEL];
        var navigate = current[SpreadsheetHistoryHash.NAVIGATE];
        var settings = current[SpreadsheetHistoryHash.SETTINGS];
        var settingsSection = current[SpreadsheetHistoryHash.SETTINGS_SECTION];

        // try replacing...
        if(delta.hasOwnProperty(SpreadsheetHistoryHash.SPREADSHEET_ID)){
            spreadsheetId = delta[SpreadsheetHistoryHash.SPREADSHEET_ID];
        }

        if(delta.hasOwnProperty(SpreadsheetHistoryHash.SPREADSHEET_NAME)){
            spreadsheetName = delta[SpreadsheetHistoryHash.SPREADSHEET_NAME];
        }

        if(delta.hasOwnProperty(SpreadsheetHistoryHash.SPREADSHEET_NAME_EDIT)){
            nameEdit = !!delta[SpreadsheetHistoryHash.SPREADSHEET_NAME_EDIT];
            if(nameEdit){
                cell = null;
                formula = null;
                label = null;
                navigate = null;
                settings = null;
            }
        }

        if(delta.hasOwnProperty(SpreadsheetHistoryHash.CELL)){
            cell = delta[SpreadsheetHistoryHash.CELL];
            if(cell){
                nameEdit = false;
            }
        }

        if(delta.hasOwnProperty(SpreadsheetHistoryHash.CELL_FORMULA)){
            formula = delta[SpreadsheetHistoryHash.CELL_FORMULA];
            if(formula){
                nameEdit = false;
            }
        }

        if(delta.hasOwnProperty(SpreadsheetHistoryHash.LABEL)){
            label = delta[SpreadsheetHistoryHash.LABEL];

            if(label){
                nameEdit = false;
            }
        }

        if(delta.hasOwnProperty(SpreadsheetHistoryHash.NAVIGATE)){
            navigate = delta[SpreadsheetHistoryHash.NAVIGATE];
            if(navigate){
                nameEdit = false;
            }
        }

        if(delta.hasOwnProperty(SpreadsheetHistoryHash.SETTINGS)){
            settings = delta[SpreadsheetHistoryHash.SETTINGS];
            settingsSection = delta[SpreadsheetHistoryHash.SETTINGS_SECTION];
            if(settingsSection && !isSettingsToken(settingsSection)){
                settingsSection = null;
            }
        }

        const merged = {};
        let valid = false;

        if(null != spreadsheetId){
            merged[SpreadsheetHistoryHash.SPREADSHEET_ID] = spreadsheetId;

            if(null != spreadsheetName){
                merged[SpreadsheetHistoryHash.SPREADSHEET_NAME] = spreadsheetName;

                valid = true;
                if(nameEdit){
                    if(cell || label || navigate || settings){
                        valid = false;
                    }
                }
            }
        }

        if(valid){
            if(nameEdit){
                merged[SpreadsheetHistoryHash.SPREADSHEET_NAME_EDIT] = nameEdit;
            }

            if(cell){
                merged[SpreadsheetHistoryHash.CELL] = cell;
            }

            if(cell && !!formula){
                merged[SpreadsheetHistoryHash.CELL_FORMULA] = formula;
            }

            if(label){
                merged[SpreadsheetHistoryHash.LABEL] = label;
            }

            if(navigate){
                merged[SpreadsheetHistoryHash.NAVIGATE] = navigate;
            }

            if(!!settings){
                merged[SpreadsheetHistoryHash.SETTINGS] = settings;

                if(settingsSection){
                    merged[SpreadsheetHistoryHash.SETTINGS_SECTION] = settingsSection;
                }
            }
        }

        return merged;
    }

    /**
     * Accepts some history tokens, verifies the combinations are valid and returns the hash without the leading hash-sign.
     */
    static stringify(tokens) {
        var spreadsheetId = tokens[SpreadsheetHistoryHash.SPREADSHEET_ID];
        var spreadsheetName = tokens[SpreadsheetHistoryHash.SPREADSHEET_NAME];
        var nameEdit = tokens[SpreadsheetHistoryHash.SPREADSHEET_NAME_EDIT];
        var cell = tokens[SpreadsheetHistoryHash.CELL];
        var formula = tokens[SpreadsheetHistoryHash.CELL_FORMULA];
        var label = tokens[SpreadsheetHistoryHash.LABEL];
        var navigate = tokens[SpreadsheetHistoryHash.NAVIGATE];
        var settings = tokens[SpreadsheetHistoryHash.SETTINGS];
        var settingsSection = tokens[SpreadsheetHistoryHash.SETTINGS_SECTION];

        let hash = "";
        let valid = false;

        if(null != spreadsheetId){
            hash = "/" + spreadsheetId;

            if(null != spreadsheetName){
                hash = hash + "/" + spreadsheetName;

                valid = true;
                if(nameEdit){
                    if(cell || label || navigate || settings){
                        valid = false;
                    }
                }
            }
        }

        if(valid){
            if(nameEdit){
                hash = hash + "/" + SpreadsheetHistoryHash.SPREADSHEET_NAME_EDIT;
                cell = null;
                formula = null;
                label = null;
                navigate = null;
            }

            if(cell){
                hash = hash + "/" + SpreadsheetHistoryHash.CELL + "/" + cell;
            }

            if(cell && !!formula){
                hash = hash + "/" + SpreadsheetHistoryHash.CELL_FORMULA;
            }

            if(label){
                hash = hash + "/" + SpreadsheetHistoryHash.LABEL + "/" + label;
            }

            if(navigate){
                hash = hash + "/" + SpreadsheetHistoryHash.NAVIGATE;
            }

            if(!!settings){
                hash = hash + "/" + SpreadsheetHistoryHash.SETTINGS;

                if(settingsSection){
                    hash = hash + "/" + settingsSection;
                }
            }
        }

        return hash;
    }

    constructor(hash, setHash, showError) {
        Preconditions.requireFunction(hash, "hash");
        Preconditions.requireFunction(setHash, "setHash");
        Preconditions.requireFunction(showError, "showError");

        this.hash = hash;
        this.setHash = setHash;
        this.showError = showError;

        this.listeners = new ListenerCollection();
        this.hashCounter = 0;
        this.currentTokens = SpreadsheetHistoryHash.parse(
            hash(),
            this.showError
        );
    }

    onHistoryChange(e) {
        const hash = this.hash();
        const tokens = SpreadsheetHistoryHash.parse(
            hash,
            this.showError
        );

        const merged = SpreadsheetHistoryHash.merge(
            tokens,
            {}
        );
        this.push(merged);

        this.currentTokens = merged;

        const hashCounter = this.hashCounter;
        for(const listener of this.listeners.listeners.slice()) {
            if(this.hashCounter !== hashCounter){
                break;
            }
            listener(Object.assign({}, merged));
        }
    }

    tokens() {
        let currentTokens = this.currentTokens;
        if(null == currentTokens){
            const hash = this.hash();
            const tokens = SpreadsheetHistoryHash.parse(
                hash,
                this.showError
            );
            this.push(tokens);
            this.currentTokens = tokens;
        }
        return Object.assign({}, this.currentTokens);
    }

    /**
     * Adds a new history hash listener, returning a function which when invoked will remove the added listener.
     */
    addListener(listener) {
        return this.listeners.add(listener);
    }

    /**
     * Accepts some new history tokens and combines them with the current. This may result in some feature being cancelled,
     * eg editing the spreadsheet name turns off cell, label, navigate and settings.
     */
    mergeAndPush(tokens) {
        return this.push(SpreadsheetHistoryHash.merge(this.tokens(), tokens));
    }

    push(tokens) {
        const validated = SpreadsheetHistoryHash.validate(tokens);
        const tokensHash = SpreadsheetHistoryHash.stringify(validated);
        const hash = this.hash();
        if(tokensHash !== hash){
            this.hashCounter++;
            this.currentTokens = null;
            this.setHash(tokensHash);
        }
        return validated;
    }

    mergeAndStringify(tokens) {
        return SpreadsheetHistoryHash.stringify(
            SpreadsheetHistoryHash.merge(this.tokens(), tokens)
        );
    }
}