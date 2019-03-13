import test from 'ava'
import sinon from 'sinon'
import { combineReducers } from 'redux'

import { createFlux } from '../src'

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
