import { createAction, handleAction } from 'redux-actions'
import { mapObjIndexed, compose, fromPairs, over, lensIndex, concat, toPairs, map, path, last } from 'ramda'
import { combineReducers } from 'redux'
import { createSelector } from 'reselect'

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

const createDefaultSelectors = ({ rootSelector, prefix, defaultValues }) => {
  if (rootSelector != null) {
    return mapObjIndexed(
      (_, name) => createSelector(rootSelector, root => root[name]),
      defaultValues
    )
  }

  const selectorPath = prefix.split('/').map(snakeToCamel)

  return mapObjIndexed(
    (_, name) => path(selectorPath.concat([name])),
    defaultValues
  )
}

export const createFlux = ({ prefix, rootSelector, defaultValues }) => {
  const defaultSelectors = createDefaultSelectors({
    rootSelector,
    prefix,
    defaultValues
  })

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

  const reducerName = snakeToCamel(last(prefix.split('/'))) + 'Reducer'

  return {
    setActions,
    defaultSelectors,
    [reducerName]: reducer
  }
}

export const createMapStateToProps = (selectors) => (state) => mapObjIndexed((selector) => selector(state), selectors)
