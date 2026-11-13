#!/usr/bin/env node
/**
 * Verificador Criptográfico SHA-256 del Bloque Intocable (Estándar Maestro v4.0)
 * Uso:
 *   node .agents/scripts/verify_immutable_guardrails.js --seal
 *   node .agents/scripts/verify_immutable_guardrails.js --verify
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const repoRoot = path.resolve(__dirname, '..', '..');
const rulesPath = path.join(repoRoot, '.agents', 'rules', 'reglas_autonomas_proyecto.md');
const hashFilePath = path.join(repoRoot, '.agents', 'state', 'immutable_guardrails.sha256.json');

function extractImmutableBlock(content) {
  const startTag = '<!-- IMMUTABLE_GUARDRAILS_START -->';
  const endTag = '<!-- IMMUTABLE_GUARDRAILS_END -->';
  const startIdx = content.indexOf(startTag);
  const endIdx = content.indexOf(endTag);
  if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
    throw new Error('No se encontró el bloque <!-- IMMUTABLE_GUARDRAILS_START --> ... <!-- IMMUTABLE_GUARDRAILS_END -->');
  }
  const rawBlock = content.slice(startIdx, endIdx + endTag.length);
  // Normalizar saltos de línea CRLF/LF para consistencia en Windows/Linux
  return rawBlock.replace(/\r\n/g, '\n').trim();
}

function computeSha256(text) {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
}

function main() {
  const mode = process.argv[2] || '--verify';
  if (!fs.existsSync(rulesPath)) {
    console.error(`[ERROR] No existe el archivo de reglas: ${rulesPath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(rulesPath, 'utf8');
  const block = extractImmutableBlock(content);
  const currentHash = computeSha256(block);

  if (mode === '--seal') {
    fs.mkdirSync(path.dirname(hashFilePath), { recursive: true });
    const payload = {
      algorithm: 'SHA-256',
      sha256: currentHash,
      sealed_at: new Date().toISOString(),
      protected_file: '.agents/rules/reglas_autonomas_proyecto.md',
    };
    fs.writeFileSync(hashFilePath, JSON.stringify(payload, null, 2) + '\n', 'utf8');
    console.log(`[SEALED] Bloque Intocable sellado con éxito. SHA-256: ${currentHash}`);
    process.exit(0);
  }

  if (!fs.existsSync(hashFilePath)) {
    console.error(`[ERROR] No existe archivo de sello SHA-256 en ${hashFilePath}. Ejecuta con --seal primero.`);
    process.exit(1);
  }

  const saved = JSON.parse(fs.readFileSync(hashFilePath, 'utf8'));
  if (saved.sha256 !== currentHash) {
    console.error(`[CRITICAL VIOLATION] El hash SHA-256 del Bloque Intocable NO coincide!`);
    console.error(`  Esperado: ${saved.sha256}`);
    console.error(`  Actual:   ${currentHash}`);
    process.exit(2);
  }

  console.log(`[VERIFIED] Bloque Intocable íntegro (SHA-256: ${currentHash})`);
}

main();
