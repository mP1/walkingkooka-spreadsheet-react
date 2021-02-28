import HistoryHash from "./HistoryHash.js";
import SpreadsheetCellReference from "../reference/SpreadsheetCellReference.js";


/**
 * A collection of utilities that support history hash.
 */
export default class SpreadsheetHistoryHash {

    static SPREADSHEET_ID = "spreadsheet-id";
    static SPREADSHEET_NAME = "spreadsheet-name";
    static SPREADSHEET_NAME_EDIT = "name";
    static CELL = "cell";
    static CELL_FORMULA = "formula";
    static SETTINGS = "settings";

    /**
     * Parsers the path extracting tokens returning an object with valid tokens. Invalid combination will be removed.
     */
    static parse(pathname) {
        const sourceTokens = HistoryHash.tokenize(pathname);

        var valid = true;

        var spreadsheetId = sourceTokens.shift();
        var spreadsheetName;
        var nameEdit;
        var cell;
        var formula;
        var settings;

        if(null != spreadsheetId){
            spreadsheetName = sourceTokens.shift();
            if(null != spreadsheetName){

                while(sourceTokens.length > 0 && valid) {
                    const token = sourceTokens.shift();

                    switch(token) {
                        case SpreadsheetHistoryHash.SPREADSHEET_NAME_EDIT:
                            if(cell){
                                valid = false;
                                break;
                            }
                            nameEdit = true;
                            break;
                        case SpreadsheetHistoryHash.CELL:
                            if(nameEdit || sourceTokens.length === 0){
                                valid = false;
                                break;
                            }

                            try {
                                cell = SpreadsheetCellReference.parse(sourceTokens.shift())
                            } catch(invalid) {
                                valid = false;
                            }
                            break;
                        case SpreadsheetHistoryHash.CELL_FORMULA:
                            if(!cell){
                                valid = false;
                                break;
                            }
                            formula = true;
                            break;
                        case SpreadsheetHistoryHash.SETTINGS:
                            settings = true;
                            break;
                        default:
                            valid = false;
                            break;
                    }
                }
            }
        }

        const destTokens = {};

        if(spreadsheetId){
            destTokens[SpreadsheetHistoryHash.SPREADSHEET_ID] = spreadsheetId;

            if(spreadsheetName){
                destTokens[SpreadsheetHistoryHash.SPREADSHEET_NAME] = spreadsheetName;

                if(cell && !formula) {
                    valid = false;
                }
                if(valid){
                    if(nameEdit) {
                        destTokens[SpreadsheetHistoryHash.SPREADSHEET_NAME_EDIT] = nameEdit;
                    }
                    if(cell) {
                        destTokens[SpreadsheetHistoryHash.CELL] = cell;
                        if(formula) {
                            destTokens[SpreadsheetHistoryHash.CELL_FORMULA] = formula;
                        }
                    }
                    if(settings) {
                        destTokens[SpreadsheetHistoryHash.SETTINGS] = settings;
                    }
                }
            }
        }

        return destTokens;
    }

    /**
     * Merges the tokens from the given current history hash tokens and the updates.
     */
    static merge(current, replacements) {
        // get the current
        var spreadsheetId = current[SpreadsheetHistoryHash.SPREADSHEET_ID];
        var spreadsheetName = current[SpreadsheetHistoryHash.SPREADSHEET_NAME];
        var nameEdit = current[SpreadsheetHistoryHash.SPREADSHEET_NAME_EDIT];
        var cell = current[SpreadsheetHistoryHash.CELL];
        var formula = current[SpreadsheetHistoryHash.CELL_FORMULA];
        var settings = current[SpreadsheetHistoryHash.SETTINGS];

        // try replacing...
        const newSpreadsheetId = replacements[SpreadsheetHistoryHash.SPREADSHEET_ID];
        if(newSpreadsheetId){
            spreadsheetId = newSpreadsheetId;
        }

        const newSpreadsheetName = replacements[SpreadsheetHistoryHash.SPREADSHEET_NAME];
        if(newSpreadsheetName){
            spreadsheetName = newSpreadsheetName;
        }

        const newSpreadsheetEdit = replacements[SpreadsheetHistoryHash.SPREADSHEET_NAME_EDIT];
        if(null != newSpreadsheetEdit){
            nameEdit = !!newSpreadsheetEdit;

            if(nameEdit){
                cell = null;
                formula = null;
            }
        }

        const newCell = replacements[SpreadsheetHistoryHash.CELL];
        if(newCell){
            cell = newCell;
        }
        const newFormula = replacements[SpreadsheetHistoryHash.CELL_FORMULA];
        if(null != newFormula){
            formula = newFormula;
        }

        const newSettings = replacements[SpreadsheetHistoryHash.SETTINGS];
        if(null != newSettings){
            settings = newSettings;
        }

        var valid = true;
        if(cell && !formula){
            valid = false;
        }

        // create the resulting verified history token pathname
        const verified = [];
        if(null != spreadsheetId){
            verified.push(spreadsheetId);
            if(null != spreadsheetName){
                verified.push(spreadsheetName);
            }
        }

        if(valid){
            if(nameEdit){
                verified.push(SpreadsheetHistoryHash.SPREADSHEET_NAME_EDIT);
            }

            if(cell){
                verified.push(SpreadsheetHistoryHash.CELL);
                verified.push(cell.toString());
            }

            if(!!formula){
                verified.push(SpreadsheetHistoryHash.CELL_FORMULA);
            }

            if(!!settings){
                verified.push(SpreadsheetHistoryHash.SETTINGS);
            }
        }

        return HistoryHash.join(verified);
    }

    constructor(history) {
        if(null == history){
            throw new Error("Missing history");
        }
        this.history = history;
    }

    update(replacements) {
        const history = this.history;

        const currentPathname = history.location.pathname;
        const updatedPathname = SpreadsheetHistoryHash.merge(
            SpreadsheetHistoryHash.parse(currentPathname),
            replacements
        );
        if(currentPathname !== updatedPathname){
            console.log("History push \"" + currentPathname + "\"");
            history.push(updatedPathname);
        }else {
            console.log("History push unchanged \"" + currentPathname + "\" new \"" + updatedPathname + "\"");
        }
    }
}