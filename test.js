/**
 * @typedef {import('unist').Node} Node
 */

import test from 'tape'
import remark from 'remark'
import {findAllAfter} from './index.js'

const tree = remark().parse('Some *emphasis*, **importance**, and `code`.')
// @ts-expect-error: hush.
const paragraph = tree.children[0]
const children = paragraph.children

test('unist-util-find-all-after', (t) => {
  t.throws(
    () => {
      // @ts-expect-error runtime.
      findAllAfter()
    },
    /Expected parent node/,
    'should fail without parent'
  )

  t.throws(
    () => {
      // @ts-expect-error runtime.
      findAllAfter({type: 'foo'})
    },
    /Expected parent node/,
    'should fail without parent node'
  )

  t.throws(
    () => {
      // @ts-expect-error runtime.
      findAllAfter({type: 'foo', children: []})
    },
    /Expected child node or index/,
    'should fail without index'
  )

  t.throws(
    () => {
      findAllAfter({type: 'foo', children: []}, -1)
    },
    /Expected positive finite number as index/,
    'should fail with invalid index (#1)'
  )

  t.throws(
    () => {
      findAllAfter({type: 'foo', children: []}, Number.POSITIVE_INFINITY)
    },
    /Expected positive finite number as index/,
    'should fail with invalid index (#2)'
  )

  t.throws(
    () => {
      // @ts-expect-error runtime.
      findAllAfter({type: 'foo', children: []}, false)
    },
    /Expected child node or index/,
    'should fail with invalid index (#3)'
  )

  t.throws(
    () => {
      findAllAfter({type: 'foo', children: []}, -1)
    },
    /Expected positive finite number as index/,
    'should fail with invalid index (#4)'
  )

  t.throws(
    () => {
      findAllAfter({type: 'foo', children: []}, {type: 'bar'})
    },
    /Expected child node/,
    'should fail with invalid index (#5)'
  )

  t.throws(
    () => {
      findAllAfter(
        {type: 'foo', children: [{type: 'bar'}, {type: 'baz'}]},
        0,
        // @ts-expect-error runtime.
        false
      )
    },
    /Expected function, string, or object as test/,
    'should fail for invalid `test` (#1)'
  )

  t.throws(
    () => {
      findAllAfter(
        {type: 'foo', children: [{type: 'bar'}, {type: 'baz'}]},
        0,
        // @ts-expect-error runtime.
        true
      )
    },
    /Expected function, string, or object as test/,
    'should fail for invalid `test` (#2)'
  )

  t.deepEqual(
    findAllAfter(paragraph, children[1]),
    children.slice(2),
    'should return the following node when without `test` (#1)'
  )
  t.deepEqual(
    findAllAfter(paragraph, 1),
    children.slice(2),
    'should return the following node when without `test` (#1)'
  )
  t.deepEqual(
    findAllAfter(paragraph, 7),
    [],
    'should return the following node when without `test` (#1)'
  )

  t.deepEqual(
    findAllAfter(paragraph, 0, children[6]),
    [children[6]],
    'should return `node` when given a `node` and existing (#1)'
  )
  t.deepEqual(
    findAllAfter(paragraph, children[0], children[1]),
    [children[1]],
    'should return `node` when given a `node` and existing (#2)'
  )
  t.deepEqual(
    findAllAfter(paragraph, 0, children[1]),
    [children[1]],
    'should return `node` when given a `node` and existing (#3)'
  )
  t.deepEqual(
    findAllAfter(paragraph, children[0], children[0]),
    [],
    'should return `node` when given a `node` and existing (#4)'
  )
  t.deepEqual(
    findAllAfter(paragraph, 0, children[0]),
    [],
    'should return `node` when given a `node` and existing (#5)'
  )
  t.deepEqual(
    findAllAfter(paragraph, 1, children[1]),
    [],
    'should return `node` when given a `node` and existing (#6)'
  )

  t.deepEqual(
    findAllAfter(paragraph, 0, 'strong'),
    [children[3]],
    'should return a child when given a `type` and existing (#1)'
  )
  t.deepEqual(
    findAllAfter(paragraph, 3, 'strong'),
    [],
    'should return a child when given a `type` and existing (#2)'
  )
  t.deepEqual(
    findAllAfter(paragraph, children[0], 'strong'),
    [children[3]],
    'should return a child when given a `type` and existing (#3)'
  )
  t.deepEqual(
    findAllAfter(paragraph, children[3], 'strong'),
    [],
    'should return a child when given a `type` and existing (#4)'
  )

  t.deepEqual(
    findAllAfter(paragraph, 0, test),
    children.slice(5),
    'should return a child when given a `test` and existing (#1)'
  )
  t.deepEqual(
    findAllAfter(paragraph, 6, test),
    [],
    'should return a child when given a `test` and existing (#2)'
  )
  t.deepEqual(
    findAllAfter(paragraph, children[4], test),
    children.slice(5),
    'should return a child when given a `test` and existing (#3)'
  )
  t.deepEqual(
    findAllAfter(paragraph, children[6], test),
    [],
    'should return a child when given a `test` and existing (#4)'
  )

  /**
   * @param {Node} _
   * @param {number|null|undefined} n
   */
  function test(_, n) {
    return typeof n === 'number' && n >= 5
  }

  t.end()
})
