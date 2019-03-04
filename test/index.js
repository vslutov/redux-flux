import test from 'ava'
import sinon from 'sinon'
import { createStore, combineReducers } from 'redux'

import { createMapStateToProps, createFlux } from '../src'

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
  t.deepEqual(selectors.count.firstCall.args, [state])
})

test.beforeEach(t => {
  t.context.rootSelector = sinon.fake.returns({
    fontSize: 'fakeFontSize',
    color: 'fakeColor'
  })
  t.context.flux = createFlux({
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

test('manual root selector', async t => {
  const { defaultSelectors } = t.context.flux

  const initState = {
    some: 'state'
  }

  t.is(defaultSelectors.fontSize(initState), 'fakeFontSize')
  t.true(t.context.rootSelector.calledOnce)
  t.deepEqual(t.context.rootSelector.firstCall.args, [initState])

  t.is(defaultSelectors.color(initState), 'fakeColor')
  t.is(t.context.rootSelector.callCount, 2)
  t.deepEqual(t.context.rootSelector.firstCall.args, [initState])
})

test('auto root selector', async t => {
  const { defaultSelectors, themePropertiesReducer } = createFlux({
    prefix: 'THEME/THEME_PROPERTIES',
    defaultValues: {
      fontSize: 8,
      color: 'blue'
    }
  })

  const rootReducer = combineReducers({
    theme: combineReducers({
      themeProperties: themePropertiesReducer
    })
  })

  const initState = rootReducer(undefined, { type: '@@INIT' })

  t.is(defaultSelectors.fontSize(initState), 8)
})

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

  store.dispatch(setActions.setFontSize(10))
  t.is(defaultSelectors.fontSize(store.getState()), 10)

  const prop = createMapStateToProps(defaultSelectors)(store.getState())
  t.deepEqual(prop, {
    fontSize: 10,
    color: 'blue'
  })
})
