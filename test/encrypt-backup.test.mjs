import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, mkdtempSync, writeFileSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const sample = (n) => readFileSync(new URL(`../samples/${n}`, import.meta.url), 'utf8')
const mod = (n) => import(`../src/${n}.mjs`)

test('09 chiffrement : aller-retour, mauvaise phrase, altération', async () => {
  const { encryptBuffer, decryptBuffer } = await mod('encrypt-backup')
  const data = Buffer.from('données sensibles')
  const blob = encryptBuffer(data, 'phrase-de-test')
  assert.ok(!blob.includes(data))
  assert.deepEqual(decryptBuffer(blob, 'phrase-de-test'), data)
  assert.throws(() => decryptBuffer(blob, 'autre'), /mauvaise phrase/)
  const tampered = Buffer.from(blob); tampered[tampered.length - 1] ^= 1
  assert.throws(() => decryptBuffer(tampered, 'phrase-de-test'), /altéré/)
  assert.throws(() => encryptBuffer(data, ''))
})
