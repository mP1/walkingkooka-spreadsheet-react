import Alert from "@mui/material/Alert";
import Preconditions from "../../Preconditions.js";
import React from "react";
import Snackbar from '@mui/material/Snackbar';

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
        Preconditions.requireNonEmptyText(text, "text");
        Preconditions.requireNonEmptyText(level, "level");

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
        Preconditions.requireFunction(onClose, "onClose");

        var text = this.text();
        var severity = this.level();
        var open = !!text;

        // disable if setValue is unavailable
        return (
            <Snackbar open={open}
                      autoHideDuration={1500}
                      onClose={onClose}
                      anchorOrigin={{ vertical: "top", horizontal: "center" }}>
                <Alert key={"muialert"}
                          open={open}
                          onClose={onClose}
                          severity={severity}
                          elevation={6}
                          variant="filled">
                    {text}
                </Alert>
            </Snackbar>
        );
    }

    toString() {
        return this.text() + " " + this.level();
    }
}