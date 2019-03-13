import test from 'ava'
import sinon from 'sinon'

import { applySelectors } from '../src'

test('applySelectors', async t => {
  const selectors = {
    count: sinon.fake.returns(3)
  }

  const state = {
    items: [1, 2, 3]
  }

  const props = applySelectors(selectors)(state)

  t.deepEqual(props, {
    count: 3
  })

  t.true(selectors.count.calledOnce)
  t.deepEqual(selectors.count.firstCall.args, [state])
})
