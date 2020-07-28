import React from 'react';
import './App.css';

import SpreadsheetAppBarTop from "./components/SpreadsheetAppBarTop/SpreadsheetAppBarTop.js";
import SpreadsheetContent from "./components/SpreadsheetContent/SpreadsheetContent.js";
import SpreadsheetFormula from "./components/SpreadsheetFormula/SpreadsheetFormula.js";

import Divider from '@material-ui/core/Divider';

function App() {
    return (
        <div>
            <SpreadsheetAppBarTop spreadsheetName={"Spreadsheet1"}/>
            <Divider/>
            <SpreadsheetFormula/>
            <Divider/>
            <SpreadsheetContent/>
        </div>
    );
}

export default App;
