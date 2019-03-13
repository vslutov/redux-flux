import test from 'ava'
import sinon from 'sinon'
import { bindActionCreators } from '../src'

test.beforeEach(t => {
  t.context.action = {
    type: 'SET_COUNT',
    payload: 3
  }

  t.context.dispatch = sinon.fake()

  t.context.setCount = sinon.fake.returns(t.context.action)
})

test('simple run', async t => {
  const actionCreators = {
    setCount: t.context.setCount
  }

  await bindActionCreators(actionCreators, t.context.dispatch).setCount(10)

  t.true(t.context.setCount.calledOnce)
  t.deepEqual(t.context.setCount.firstCall.args, [10])

  t.true(t.context.dispatch.calledOnce)
  t.deepEqual(t.context.dispatch.firstCall.args, [t.context.action])
})

test('curry', async t => {
  const actionCreators = {
    setCount: t.context.setCount
  }

  await bindActionCreators(actionCreators)(t.context.dispatch).setCount(10)

  t.true(t.context.setCount.calledOnce)
  t.deepEqual(t.context.setCount.firstCall.args, [10])

  t.true(t.context.dispatch.calledOnce)
  t.deepEqual(t.context.dispatch.firstCall.args, [t.context.action])
})

test('async', async t => {
  const actionCreators = {
    setCount: async (x) => { return t.context.setCount(x) }
  }

  await bindActionCreators(actionCreators)(t.context.dispatch).setCount(10)

  t.true(t.context.setCount.calledOnce)
  t.deepEqual(t.context.setCount.firstCall.args, [10])

  t.true(t.context.dispatch.calledOnce)
  t.deepEqual(t.context.dispatch.firstCall.args, [t.context.action])
})
