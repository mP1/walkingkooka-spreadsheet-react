import React from 'react';

import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SpreadsheetNameWidget from './SpreadsheetNameWidget.js';
import PropTypes from "prop-types";

/**
 * An header that displays a menu, followed by an editable spreadsheet name
 */
export default class SpreadsheetAppBarTop extends React.Component {

    static classes = makeStyles((theme) => ({
        root: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
    }));

    constructor(props) {
        super(props);
        this.app = props.app;
    }

    render() {
        return (<AppBar position="static">
            <Toolbar>
                <IconButton edge="start"
                            className={SpreadsheetAppBarTop.classes.menuButton}
                            color="inherit"
                            aria-label="menu">
                    <MenuIcon/>
                </IconButton>
                <SpreadsheetNameWidget app={this.app}/>
            </Toolbar>
        </AppBar>);
    }
}

SpreadsheetAppBarTop.propTypes = {
    app: PropTypes.object.isRequired,
}
