import React from 'react';

import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

/**
 * An header that displays a menu, followed by an any children which will include the spreadsheet name.
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
                {this.props.children}
            </Toolbar>
        </AppBar>);
    }
}
