import test from 'node:test';
import assert from 'node:assert/strict';
import { panicSpeed, escapeMove } from '../js/movement-profile.js';

test('panic run stays readable instead of sprinting across the map', () => {
  assert.ok(panicSpeed(0) >= 2);
  assert.ok(panicSpeed(1) <= 4.2);
});

test('escape move cycles through dodge tumble and hide actions', () => {
  assert.equal(escapeMove(0), 'dodge');
  assert.equal(escapeMove(1), 'tumble');
  assert.equal(escapeMove(2), 'hide');
});
