#!/usr/bin/env node
/* Chiffre / déchiffre un fichier avec AES-256-GCM (clé dérivée par scrypt).
   La phrase secrète se passe par la variable d'environnement BACKUP_PASSPHRASE, jamais en argument.
   Pour un dossier : tar czf - dossier | node src/encrypt-backup.mjs encrypt - sauvegarde.enc
   Le fichier est lu en mémoire : prévu pour des sauvegardes de taille raisonnable (< 1 Go). */
import { readFileSync, writeFileSync } from 'node:fs'
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'node:crypto'
import { isMain, parseArgs, usage, fail } from '../lib/cli.mjs'

const MAGIC = Buffer.from('EAS1')
const key = (passphrase, salt) => scryptSync(passphrase, salt, 32, { N: 2 ** 15, r: 8, p: 1, maxmem: 64 * 1024 * 1024 })

/** Format : EAS1 | sel (16) | iv (12) | étiquette GCM (16) | données chiffrées. */
export function encryptBuffer(data, passphrase) {
  if (!passphrase) throw new Error('phrase secrète vide.')
  const salt = randomBytes(16)
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key(passphrase, salt), iv)
  const body = Buffer.concat([cipher.update(data), cipher.final()])
  return Buffer.concat([MAGIC, salt, iv, cipher.getAuthTag(), body])
}

export function decryptBuffer(blob, passphrase) {
  if (blob.length < 48 || !blob.subarray(0, 4).equals(MAGIC)) throw new Error('fichier non reconnu (en-tête EAS1 absent).')
  const salt = blob.subarray(4, 20)
  const iv = blob.subarray(20, 32)
  const tag = blob.subarray(32, 48)
  const decipher = createDecipheriv('aes-256-gcm', key(passphrase, salt), iv)
  decipher.setAuthTag(tag)
  try {
    return Buffer.concat([decipher.update(blob.subarray(48)), decipher.final()])
  } catch {
    throw new Error('déchiffrement impossible : mauvaise phrase secrète ou fichier altéré.')
  }
}

async function readStdin() {
  const chunks = []
  for await (const c of process.stdin) chunks.push(c)
  return Buffer.concat(chunks)
}

if (isMain(import.meta.url)) {
  const args = parseArgs(process.argv.slice(2), ['help'])
  usage(`
Usage : BACKUP_PASSPHRASE='…' node src/encrypt-backup.mjs <encrypt|decrypt> <entree|-> <sortie>
« - » lit l'entrée standard. Les sauvegardes sans phrase secrète sont refusées.`, args, 3)
  const [mode, input, output] = args._
  const pass = process.env.BACKUP_PASSPHRASE
  if (!pass) fail('définissez BACKUP_PASSPHRASE dans l\'environnement.')
  if (!['encrypt', 'decrypt'].includes(mode)) fail('le mode doit être « encrypt » ou « decrypt ».')
  try {
    const data = input === '-' ? await readStdin() : readFileSync(input)
    writeFileSync(output, mode === 'encrypt' ? encryptBuffer(data, pass) : decryptBuffer(data, pass))
    console.error(`${mode === 'encrypt' ? 'Chiffré' : 'Déchiffré'} → ${output}`)
  } catch (e) { fail(e.message) }
}
