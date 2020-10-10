import React from 'react';

import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SpreadsheetName from '../SpreadsheetName/SpreadsheetName.js';

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
        this.state = {spreadsheetName: props.spreadsheetName};
    }

    updateSpreadsheetName(v) {
        this.setState({spreadsheetName: v});
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
                <SpreadsheetName
                    value={this.state.spreadsheetName}
                    onValueChange={(v) => this.updateSpreadsheetName(v)}/>
            </Toolbar>
        </AppBar>);
    }
}

