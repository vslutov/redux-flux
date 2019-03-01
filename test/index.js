import test from 'ava'
import sinon from 'sinon'
import { createStore, combineReducers } from 'redux'

import { createMapStateToProps, prepareFlux } from '../index'

test('createMapStateToProps', async t => {
  const selectors = {
    count: sinon.fake.returns(3)
  }

  const state = {
    items: [1, 2, 3]
  }

  const props = createMapStateToProps(selectors)(state)

  t.deepEqual(props, {
    count: 3
  })

  t.true(selectors.count.calledOnce)
  t.is(selectors.count.lastArg, state)
})

test.before(t => {
  t.context.rootSelector = sinon.fake.returns({
    fontSize: 'fakeFontSize',
    color: 'fakeColor'
  })
  t.context.flux = prepareFlux({
    prefix: 'THEME_PROPERTIES',
    rootSelector: t.context.rootSelector,
    defaultValues: {
      fontSize: 8,
      color: 'blue'
    }
  })
})

test('setActions', async t => {
  const { setActions } = t.context.flux

  t.deepEqual(setActions.setFontSize(10), {
    type: 'THEME_PROPERTIES/FONT_SIZE/SET',
    payload: 10
  })

  t.deepEqual(setActions.setColor('red'), {
    type: 'THEME_PROPERTIES/COLOR/SET',
    payload: 'red'
  })
})

test('reducer', async t => {
  const { themePropertiesReducer, setActions } = t.context.flux

  const initState = themePropertiesReducer(undefined, {
    type: '@@redux/INIT'
  })

  t.deepEqual(initState, {
    fontSize: 8,
    color: 'blue'
  })

  const fontSizeUpdated = themePropertiesReducer(initState, setActions.setFontSize(10))

  t.deepEqual(fontSizeUpdated, {
    fontSize: 10,
    color: 'blue'
  })
})

test('selector', async t => {
  const { defaultSelectors } = t.context.flux

  const initState = {
    some: 'state'
  }

  t.is(defaultSelectors.fontSize(initState), 'fakeFontSize')
  t.true(t.context.rootSelector.calledOnce)
  t.is(t.context.rootSelector.lastArg, initState)

  t.is(defaultSelectors.color(initState), 'fakeColor')
  t.is(t.context.rootSelector.callCount, 2)
  t.is(t.context.rootSelector.lastArg, initState)
})

test('integrity', async t => {
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
})
