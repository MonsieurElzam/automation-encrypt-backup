# automation-encrypt-backup

**Encrypted backup.** Encrypts and decrypts a file with AES-256-GCM, scrypt-derived key; the passphrase comes from an environment variable.

Node.js 18+, **no dependencies**, **MIT** licence. No data is sent anywhere. The scripts print their messages in French.

## Usage

```bash
BACKUP_PASSPHRASE='…' node src/encrypt-backup.mjs encrypt dump.sql dump.enc
```

Run it with `--help` for the built-in options (the scripts print in French).

## Tests

```bash
npm test
```

## Limits

- The files in `samples/` are fictional: adapt the column headers to your own exports.
- Try it on a copy of your data first.
- Provided as is, without warranty (see `LICENSE`).

## The series

This script is part of a series of **free automation scripts** (audience: security and backup, among others): [overview, guides and full archive](https://monsieurelzam.com/en/scripts) · [all repositories](https://github.com/MonsieurElzam?tab=repositories&q=automation-).

---

By [Elzam MAMAH](https://monsieurelzam.com/en), business analyst and process-optimization expert. MIT licence.
