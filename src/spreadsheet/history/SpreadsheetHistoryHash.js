import ListenerCollection from "../../event/ListenerCollection.js";
import Preconditions from "../../Preconditions.js";
import SpreadsheetCellReferenceOrLabelName from "../reference/SpreadsheetCellReferenceOrLabelName.js";
import spreadsheetCellReferenceOrLabelNameParse from "../reference/SpreadsheetCellReferenceOrLabelNameParse.js";
import SpreadsheetColumnReferenceRange from "../reference/SpreadsheetColumnReferenceRange.js";
import SpreadsheetColumnOrRowReference from "../reference/SpreadsheetColumnOrRowReference.js";
import SpreadsheetColumnOrRowReferenceRange from "../reference/SpreadsheetColumnOrRowReferenceRange.js";
import SpreadsheetColumnOrRowDeleteHistoryHashToken from "./SpreadsheetColumnOrRowDeleteHistoryHashToken.js";
import SpreadsheetColumnOrRowDeleteOrInsertHistoryHashToken
    from "./SpreadsheetColumnOrRowDeleteOrInsertHistoryHashToken.js";
import SpreadsheetColumnOrRowInsertAfterHistoryHashToken from "./SpreadsheetColumnOrRowInsertAfterHistoryHashToken.js";
import SpreadsheetColumnOrRowInsertBeforeHistoryHashToken
    from "./SpreadsheetColumnOrRowInsertBeforeHistoryHashToken.js";
import SpreadsheetFormulaHistoryHashToken from "./SpreadsheetFormulaHistoryHashToken.js";
import SpreadsheetHistoryHashToken from "./SpreadsheetHistoryHashToken.js";
import SpreadsheetLabelName from "../reference/SpreadsheetLabelName.js";
import SpreadsheetName from "../SpreadsheetName.js";
import SpreadsheetRowReferenceRange from "../reference/SpreadsheetRowReferenceRange.js";
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

    static SELECTION = "selection";
    static SELECTION_ACTION = "selection-action";

    static CELL = "cell";
    static CELL_FORMULA = "formula";
    static COLUMN = "column";
    static ROW = "row";
    static DELETE_COLUMN_OR_ROW = "delete";
    static INSERT_AFTER_COLUMN_OR_ROW = "insert-after";
    static INSERT_BEFORE_COLUMN_OR_ROW = "insert-before";

    static LABEL = "label";
    static SELECT = "select";
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

        const tokens = tokenize(hash);
        const spreadsheetId = tokens.shift();
        const historyHashTokens = {};

        if(spreadsheetId){
            historyHashTokens[SpreadsheetHistoryHash.SPREADSHEET_ID] = spreadsheetId;

            try {
                historyHashTokens[SpreadsheetHistoryHash.SPREADSHEET_NAME] = new SpreadsheetName(tokens.shift());

                var valid = true;

                var name = null;
                var selection = null;
                var selectionAction = null;
                var label = null;
                var select = null;
                var settings = null;
                var settingsSection = null;

                while(tokens.length > 0 && valid) {
                    const token = tokens.shift();

                    switch(token) {
                        case SpreadsheetHistoryHash.SPREADSHEET_NAME_EDIT:
                            name = true;
                            break;
                        case SpreadsheetHistoryHash.CELL:
                            if(selection || tokens.length === 0){
                                valid = false;
                                break;
                            }

                            try {
                                selection = spreadsheetCellReferenceOrLabelNameParse(tokens.shift());
                            } catch(invalid) {
                                errors("Cell: " + invalid.message);
                                valid = false;
                            }
                            break;
                        case SpreadsheetHistoryHash.CELL_FORMULA:
                            if(!(selection instanceof SpreadsheetCellReferenceOrLabelName)){
                                valid = false;
                                break;
                            }
                            selectionAction = new SpreadsheetFormulaHistoryHashToken();
                            break;
                        case SpreadsheetHistoryHash.COLUMN:
                            if(selection || tokens.length === 0){
                                valid = false;
                                break;
                            }

                            try {
                                selection = SpreadsheetColumnReferenceRange.parse(tokens.shift())
                                    .columnOrRange();
                            } catch(invalid) {
                                errors("Column: " + invalid.message);
                                valid = false;
                            }
                            break;
                        case SpreadsheetHistoryHash.DELETE_COLUMN_OR_ROW:
                            valid = false;
                            if(!(selection instanceof SpreadsheetColumnOrRowReference || selection instanceof SpreadsheetColumnOrRowReferenceRange) || tokens.length === 0){
                                break;
                            }
                            const deleteCount = tokens.shift();
                            if(!Number.isNaN(Number(deleteCount))){
                                try {
                                    selectionAction = new SpreadsheetColumnOrRowDeleteHistoryHashToken(parseInt(deleteCount, 10));
                                    valid = true;
                                } catch(invalid) {
                                    errors("Insert count: " + invalid.message);
                                }
                            }
                            break;
                        case SpreadsheetHistoryHash.INSERT_AFTER_COLUMN_OR_ROW:
                            valid = false;
                            if(!(selection instanceof SpreadsheetColumnOrRowReference) || tokens.length === 0){
                                break;
                            }
                            const insertAfterCount = tokens.shift();
                            if(!Number.isNaN(Number(insertAfterCount))){
                                try {
                                    selectionAction = new SpreadsheetColumnOrRowInsertAfterHistoryHashToken(parseInt(insertAfterCount, 10));
                                    valid = true;
                                } catch(invalid) {
                                    errors("Insert after count: " + invalid.message);
                                }
                            }
                            break;
                        case SpreadsheetHistoryHash.INSERT_BEFORE_COLUMN_OR_ROW:
                            valid = false;
                            if(!(selection instanceof SpreadsheetColumnOrRowReference) || tokens.length === 0){
                                break;
                            }
                            const insertBeforeCount = tokens.shift();
                            if(!Number.isNaN(Number(insertBeforeCount))){
                                try {
                                    selectionAction = new SpreadsheetColumnOrRowInsertBeforeHistoryHashToken(parseInt(insertBeforeCount, 10));
                                    valid = true;
                                } catch(invalid) {
                                    errors("Insert before count: " + invalid.message);
                                }
                            }
                            break;
                        case SpreadsheetHistoryHash.LABEL:
                            if(tokens.length === 0){
                                valid = false;
                                break;
                            }

                            try {
                                label = SpreadsheetLabelName.parse(tokens.shift());
                            } catch(invalid) {
                                errors("Label: " + invalid.message);
                                valid = false;
                            }
                            break;
                        case SpreadsheetHistoryHash.ROW:
                            if(selection || tokens.length === 0){
                                valid = false;
                                break;
                            }

                            try {
                                selection = SpreadsheetRowReferenceRange.parse(tokens.shift())
                                    .rowOrRange();
                            } catch(invalid) {
                                errors("Row: " + invalid.message);
                                valid = false;
                            }
                            break;
                        case SpreadsheetHistoryHash.SELECT:
                            select = true;
                            break;
                        case SpreadsheetHistoryHash.SETTINGS:
                            settings = true;
                            const possibleSection = tokens.shift();
                            if(null != possibleSection){
                                if(isSettingsToken(possibleSection)){
                                    settingsSection = possibleSection;
                                }
                            }
                            valid = true;
                            break;
                        default:
                            valid = false;
                            break;
                    }
                }

                if(valid){
                    if(name){
                        historyHashTokens[SpreadsheetHistoryHash.SPREADSHEET_NAME_EDIT] = name;
                    }
                    if(selection){
                        historyHashTokens[SpreadsheetHistoryHash.SELECTION] = selection;
                        if(selectionAction){
                            historyHashTokens[SpreadsheetHistoryHash.SELECTION_ACTION] = selectionAction;
                        }
                    }
                    if(label){
                        historyHashTokens[SpreadsheetHistoryHash.LABEL] = label;
                    }
                    if(select){
                        historyHashTokens[SpreadsheetHistoryHash.SELECT] = select;
                    }
                    if(settings){
                        historyHashTokens[SpreadsheetHistoryHash.SETTINGS] = settings;
                        if(settingsSection){
                            historyHashTokens[SpreadsheetHistoryHash.SETTINGS_SECTION] = settingsSection;
                        }
                    }
                }
            } catch(ignore) {
            }
        }

        return SpreadsheetHistoryHash.validate(historyHashTokens);
    }

    /**
     * Verifies the given tokens are valid, for example formula cannot be set if cell if absent.
     */
    static validate(tokens) {
        var spreadsheetId = tokens[SpreadsheetHistoryHash.SPREADSHEET_ID];
        var spreadsheetName = tokens[SpreadsheetHistoryHash.SPREADSHEET_NAME];
        var nameEdit = tokens[SpreadsheetHistoryHash.SPREADSHEET_NAME_EDIT];
        var selection = tokens[SpreadsheetHistoryHash.SELECTION];
        var selectionAction = tokens[SpreadsheetHistoryHash.SELECTION_ACTION];
        var label = tokens[SpreadsheetHistoryHash.LABEL];
        var select = tokens[SpreadsheetHistoryHash.SELECT];
        var settings = tokens[SpreadsheetHistoryHash.SETTINGS];
        var settingsSection = tokens[SpreadsheetHistoryHash.SETTINGS_SECTION];

        const verified = {};

        if(spreadsheetId){
            verified[SpreadsheetHistoryHash.SPREADSHEET_ID] = spreadsheetId;

            if(spreadsheetName){
                verified[SpreadsheetHistoryHash.SPREADSHEET_NAME] = spreadsheetName;
                if(nameEdit && (selection || label || select || settings)){
                    nameEdit = false;
                    selection = false;
                    label = false;
                    select = false;
                }
                if(nameEdit){
                    selection = false;
                    label = false;
                    select = false;
                }
                if(selection || label || select || settings){
                    nameEdit = false;
                }
                if(nameEdit){
                    verified[SpreadsheetHistoryHash.SPREADSHEET_NAME_EDIT] = nameEdit;
                }
                if(selection instanceof SpreadsheetSelection){
                    verified[SpreadsheetHistoryHash.SELECTION] = selection;

                    if((selection instanceof SpreadsheetColumnOrRowReference || selection instanceof SpreadsheetColumnOrRowReferenceRange) && selectionAction instanceof SpreadsheetColumnOrRowDeleteOrInsertHistoryHashToken){
                        verified[SpreadsheetHistoryHash.SELECTION_ACTION] = selectionAction;
                    }
                    if(selection instanceof SpreadsheetCellReferenceOrLabelName && selectionAction instanceof SpreadsheetFormulaHistoryHashToken){
                        verified[SpreadsheetHistoryHash.SELECTION_ACTION] = selectionAction;
                    }
                }
                if(label instanceof SpreadsheetLabelName){
                    verified[SpreadsheetHistoryHash.LABEL] = label;
                }
                if(select){
                    verified[SpreadsheetHistoryHash.SELECT] = select;
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
     * Merges the two history hash objects, using the delta to update and return a new object.
     */
    static merge(current, delta) {
        Preconditions.requireObject(current, "current");
        Preconditions.requireObject(delta, "delta");

        // get the current
        var spreadsheetId = current[SpreadsheetHistoryHash.SPREADSHEET_ID];
        var spreadsheetName = current[SpreadsheetHistoryHash.SPREADSHEET_NAME];
        var nameEdit = current[SpreadsheetHistoryHash.SPREADSHEET_NAME_EDIT];
        var selection = current[SpreadsheetHistoryHash.SELECTION];
        var selectionAction = current[SpreadsheetHistoryHash.SELECTION_ACTION];
        var label = current[SpreadsheetHistoryHash.LABEL];
        var select = current[SpreadsheetHistoryHash.SELECT];
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
                selection = null;
                selectionAction = null;
                label = null;
                select = null;
                settings = null;
            }
        }

        if(delta.hasOwnProperty(SpreadsheetHistoryHash.SELECTION)){
            selection = delta[SpreadsheetHistoryHash.SELECTION];
            if(selection){
                nameEdit = false;
            }
        }

        if(delta.hasOwnProperty(SpreadsheetHistoryHash.SELECTION_ACTION)){
            selectionAction = delta[SpreadsheetHistoryHash.SELECTION_ACTION];
            if(selectionAction instanceof SpreadsheetHistoryHashToken){
                nameEdit = false;
            }
        }

        if(delta.hasOwnProperty(SpreadsheetHistoryHash.LABEL)){
            label = delta[SpreadsheetHistoryHash.LABEL];

            if(label){
                nameEdit = false;
            }
        }

        if(delta.hasOwnProperty(SpreadsheetHistoryHash.SELECT)){
            select = delta[SpreadsheetHistoryHash.SELECT];
            if(select){
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
                    if(selection || label || select || settings){
                        valid = false;
                    }
                }
            }
        }

        if(valid){
            if(nameEdit){
                merged[SpreadsheetHistoryHash.SPREADSHEET_NAME_EDIT] = nameEdit;
            }

            if(selection){
                merged[SpreadsheetHistoryHash.SELECTION] = selection;
            }

            if(selection && selectionAction instanceof SpreadsheetHistoryHashToken){
                merged[SpreadsheetHistoryHash.SELECTION_ACTION] = selectionAction;
            }

            if(label){
                merged[SpreadsheetHistoryHash.LABEL] = label;
            }

            if(select){
                merged[SpreadsheetHistoryHash.SELECT] = select;
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
        var selection = tokens[SpreadsheetHistoryHash.SELECTION];
        var selectionAction = tokens[SpreadsheetHistoryHash.SELECTION_ACTION];
        var label = tokens[SpreadsheetHistoryHash.LABEL];
        var select = tokens[SpreadsheetHistoryHash.SELECT];
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
                    if(selection || label || select || settings){
                        valid = false;
                    }
                }
            }
        }

        if(valid){
            if(nameEdit){
                hash = hash + "/" + SpreadsheetHistoryHash.SPREADSHEET_NAME_EDIT;
                selection = null;
                selectionAction = null;
                label = null;
                select = null;
            }

            if(selection){
                hash = hash + "/" + selection.toHistoryHashToken();

                if(selectionAction instanceof SpreadsheetHistoryHashToken){
                    hash = hash + "/" + selectionAction.toHistoryHashToken();
                }
            }

            if(label){
                hash = hash + "/" + SpreadsheetHistoryHash.LABEL + "/" + label;
            }

            if(select){
                hash = hash + "/" + SpreadsheetHistoryHash.SELECT;
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
     * eg editing the spreadsheet name turns off cell, label, select and settings.
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