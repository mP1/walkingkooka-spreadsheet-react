import MuiAlert from "@material-ui/lab/Alert";
import React from "react";
import Snackbar from '@material-ui/core/Snackbar';

export default class SpreadsheetNotification {

    static error(text) {
        return new SpreadsheetNotification(text, "error");
    }

    static info(text) {
        return new SpreadsheetNotification(text, "info");
    }

    static success(text) {
        return new SpreadsheetNotification(text, "success");
    }

    static warning(text) {
        return new SpreadsheetNotification(text, "warning");
    }

    constructor(text, level) {
        if(!text && text !== ""){
            throw new Error("Missing text");
        }
        if(typeof text !== "string"){
            throw new Error("Expected string text got " + text);
        }

        if(!level && level !== ""){
            throw new Error("Missing level");
        }
        if(typeof level !== "string"){
            throw new Error("Expected string level got " + level);
        }

        this.textValue = text;
        this.levelValue = level;
    }

    text() {
        return this.textValue;
    }

    level() {
        return this.levelValue;
    }

    render(onClose) {
        if(onClose == null){
            throw new Error("Missing onClose");
        }
        if(typeof onClose !== "function"){
            throw new Error("Expected function onClose got " + onClose);
        }

        var text = this.text();
        var severity = this.level();
        var open = !!text;

        // disable if setValue is unavailable
        return (
            <Snackbar open={open}
                      autoHideDuration={1500}
                      onClose={onClose}
                      anchorOrigin={{ vertical: "top", horizontal: "center" }}>
                <MuiAlert key={"muialert"}
                          open={open}
                          onClose={onClose}
                          severity={severity}
                          elevation={6}
                          variant="filled">
                    {text}
                </MuiAlert>
            </Snackbar>
        );
    }

    toString() {
        return this.text() + " " + this.level();
    }
}