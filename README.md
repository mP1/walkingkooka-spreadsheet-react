[![Build Status](https://travis-ci.com/mP1/walkingkooka-spreadsheet-react.svg?branch=master)](https://travis-ci.com/mP1/walkingkooka-spreadsheet-react.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/mP1/walkingkooka-spreadsheet-react/badge.svg?branch=master)](https://coveralls.io/repos/github/mP1/walkingkooka-spreadsheet-react?branch=master)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Language grade: Java](https://img.shields.io/lgtm/grade/java/g/mP1/walkingkooka-spreadsheet-react.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/mP1/walkingkooka-spreadsheet-react/context:java)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/mP1/walkingkooka-spreadsheet-react.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/mP1/walkingkooka-spreadsheet-react/alerts/)



## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


### walkingkooka-spreadsheet-webworker

During development this assumes that a http server is available on `https://localhost:12345/walkingkooka-walkingkooka-spreadsheet-webworker.js`
serving the javascript engine.


## History hash format

Components within a hash that begin with dollar sign '$' represent a variable of some sort related to the context. Other
components are actual literals.

- $spreadsheet-id / $spreadsheet name  viewing spreadsheet with nothing selected for editing
- $spreadsheet-id / $spreadsheet name / name / edit  editing the spreadsheet name
- $spreadsheet-id / $spreadsheet name / cellReference / $cellReference-reference / formula  editing the formula belonging to a cellReference. 



## Cypress Integration testing

Integration tests are available using the popular [Cypress testing tool](https://www.cypress.io/)

```bash
cypress open
```
