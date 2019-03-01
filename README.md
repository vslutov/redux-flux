# redux-flux

Redux utils for remove boilerplate

Code example:

```js
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
