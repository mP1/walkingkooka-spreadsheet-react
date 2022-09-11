import React from 'react';
import Preconditions from "../Preconditions.js";

/**
 * A widget with some common or useful logic.
 */
export default class SpreadsheetWidget extends React.Component {

    prefix() {
        return this.constructor.name
    }

    /**
     * Gives focus to the given element after a short delay.
     */
    giveFocus(elementSupplier) {
        Preconditions.requireFunction(elementSupplier, "elementSupplier");

        setTimeout(
            () => {
                const element = elementSupplier();
                if(element && element.focus) {
                    console.log(this.prefix() +".focused");
                    element.focus();
                }
            },
            10
        );
    }

    showErrorErrorHandler(showError) {
        return (statusCode, statusMessage) => {
            showError(statusMessage);
        };
    }
}
