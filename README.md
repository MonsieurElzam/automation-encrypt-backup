# automation-encrypt-backup

**Sauvegarde chiffrée** — Chiffre et déchiffre un fichier en AES-256-GCM, clé dérivée par scrypt ; la phrase secrète passe par une variable d'environnement.

> **EN** — *Encrypted backup.* Encrypts and decrypts a file with AES-256-GCM, scrypt-derived key; the passphrase comes from an environment variable.

Node.js 18+, **aucune dépendance**, licence **MIT**. Aucune donnée n'est envoyée nulle part. Les messages affichés sont en français.

## Utilisation

```bash
BACKUP_PASSPHRASE='…' node src/encrypt-backup.mjs encrypt dump.sql dump.enc
```

Aide intégrée (`--help`) :

```text
Usage : BACKUP_PASSPHRASE='…' node src/encrypt-backup.mjs <encrypt|decrypt> <entree|-> <sortie>
« - » lit l'entrée standard. Les sauvegardes sans phrase secrète sont refusées.
```

## Tests

```bash
npm test
```

## Limites

- Les exemples de `samples/` sont fictifs ; adaptez les en-têtes de colonnes à vos propres exports.
- Essayez d'abord sur une copie de vos données.
- Fourni tel quel, sans garantie (voir `LICENSE`).

## La série

Ce script fait partie d'une série de **scripts d'automatisation libres** (public : sécurité et sauvegarde, entre autres) : [présentation, guides et archive complète](https://monsieurelzam.com/scripts) · [tous les dépôts](https://github.com/MonsieurElzam?tab=repositories&q=automation-).

---

Par [Elzam MAMAH](https://monsieurelzam.com) — business analyst, optimisation de processus. Licence MIT.
