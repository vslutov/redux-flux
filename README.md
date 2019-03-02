# @vslutov/redux-flux

[![Build Status](https://travis-ci.org/vslutov/redux-flux.svg?branch=master)](https://travis-ci.org/vslutov/redux-flux)
[![npm version](https://badge.fury.io/js/%40vslutov%2Fredux-flux.svg)](https://badge.fury.io/js/%40vslutov%2Fredux-flux)
[![Greenkeeper badge](https://badges.greenkeeper.io/vslutov/redux-flux.svg)](https://greenkeeper.io/)
[![Coverage Status](https://coveralls.io/repos/github/vslutov/redux-flux/badge.svg?branch=master)](https://coveralls.io/github/vslutov/redux-flux?branch=master)

Redux utils for remove boilerplate

Install:
```sh
npm install @vslutov/redux-flux
```

Code example:

```js
import { prepareFlux, createMapStateToProps } from '@vslutov/redux-flux'

const { setActions, themePropertiesReducer, defaultSelectors } = prepareFlux({
  prefix: 'THEME_PROPERTIES',
  rootSelector: state => state.themeProperties,
  defaultValues: {
    fontSize: 8,
    color: 'blue'
  }
})

const store = createStore(combineReducers({
  themeProperties: themePropertiesReducer
}))

t.is(defaultSelectors.fontSize(store.getState()), 8)

store.dispatch(setActions.setFontSize(10))
t.is(defaultSelectors.fontSize(store.getState()), 10)

const prop = createMapStateToProps(defaultSelectors)(store.getState())
t.deepEqual(prop, {
  fontSize: 10,
  color: 'blue'
})
```
