import React from 'react';

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
    giveFocus(element) {
        console.log(this.prefix() +"!.giveFocus!!!");

        element && setTimeout(() => {
            console.log(this.prefix() +"!.focused!");
            element.focus();
        }, 10);
    }
}
