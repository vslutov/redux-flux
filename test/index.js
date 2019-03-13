import test from 'ava'
import { createStore, combineReducers } from 'redux'

import { applySelectors, createFlux, bindActionCreators } from '../src'

test('integrity', async t => {
  const { setActions, themePropertiesReducer, defaultSelectors } = createFlux({
    prefix: 'THEME_PROPERTIES',
    defaultValues: {
      fontSize: 8,
      color: 'blue'
    }
  })

  const store = createStore(combineReducers({
    themeProperties: themePropertiesReducer
  }))

  t.is(defaultSelectors.fontSize(store.getState()), 8)

  const actions = bindActionCreators(setActions, store.dispatch)
  await actions.setFontSize(10)

  t.is(defaultSelectors.fontSize(store.getState()), 10)

  const prop = applySelectors(defaultSelectors)(store.getState())
  t.deepEqual(prop, {
    fontSize: 10,
    color: 'blue'
  })
})
