import { createAction, handleAction } from 'redux-actions'
import { mapObjIndexed, compose, fromPairs, over, lensIndex, concat, toPairs, map } from 'ramda'
import { combineReducers } from 'redux'

const camelToSnake = (string) => (string
  .replace(/([^A-Z])([A-Z])/g, '$1_$2')
  .toUpperCase()
)

const snakeToCamel = (string) => (string
  .toLowerCase()
  .replace(/_+([^_])/g, ($0, $1) => $1.toUpperCase())
)

const upperFirst = string => string.charAt(0).toUpperCase() + string.slice(1)

const setReducer = (state, { payload }) => payload

export const prepareFlux = ({ prefix, rootSelector, defaultValues }) => {
  const defaultSelectors = mapObjIndexed((_, name) => (state) => rootSelector(state)[name], defaultValues)
  const actions = mapObjIndexed((_, name) => createAction(prefix + '/' + camelToSnake(name) + '/SET'), defaultValues)

  const reducer = combineReducers(mapObjIndexed((defaultState, name) => (
    handleAction(actions[name], setReducer, defaultState)
  ), defaultValues))

  const setActions = compose(
    fromPairs,
    map(over(lensIndex(0), compose(
      concat('set'),
      upperFirst
    ))),
    toPairs
  )(actions)

  return {
    setActions,
    defaultSelectors,
    [snakeToCamel(prefix) + 'Reducer']: reducer
  }
}

export const createMapStateToProps = (selectors) => (state) => mapObjIndexed((selector) => selector(state), selectors)
