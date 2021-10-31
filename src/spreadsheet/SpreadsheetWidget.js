import React from 'react';

/**
 * A widget with some common or useful logic.
 */
export default class SpreadsheetWidget extends React.Component {

    prefix() {
        return this.constructor.name
    }
}
