#!/usr/bin/env node
/**
 * Hook SessionStart — Reanudación Automática de los 2 CRONs tras Reinicio de SO o Actualización del IDE
 * Lee stdin (JSON de Antigravity) y emite por stdout el contrato JSON de SessionStart (injectSteps).
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function verifyGuardrails() {
  try {
    const repoRoot = path.resolve(__dirname, '..', '..');
    const rulesPath = path.join(repoRoot, '.agents', 'rules', 'reglas_autonomas_proyecto.md');
    const hashFilePath = path.join(repoRoot, '.agents', 'state', 'immutable_guardrails.sha256.json');
    if (!fs.existsSync(rulesPath) || !fs.existsSync(hashFilePath)) return 'MISSING_GUARDRAILS';
    const content = fs.readFileSync(rulesPath, 'utf8');
    const startTag = '<!-- IMMUTABLE_GUARDRAILS_START -->';
    const endTag = '<!-- IMMUTABLE_GUARDRAILS_END -->';
    const s = content.indexOf(startTag);
    const e = content.indexOf(endTag);
    if (s === -1 || e === -1) return 'INVALID_TAGS';
    const block = content.slice(s, e + endTag.length).replace(/\r\n/g, '\n').trim();
    const hash = crypto.createHash('sha256').update(block, 'utf8').digest('hex');
    const saved = JSON.parse(fs.readFileSync(hashFilePath, 'utf8'));
    return hash === saved.sha256 ? `VERIFIED (${hash.slice(0, 12)}...)` : 'HASH_MISMATCH';
  } catch (err) {
    return `ERROR: ${err.message}`;
  }
}

function main() {
  const status = verifyGuardrails();
  const payload = {
    injectSteps: [
      {
        systemMessage: {
          systemMessage:
            `[AUTO-RESUME HOOK v4.0 — SessionStart] Estado de Candados SHA-256: ${status}. ` +
            `Si esta sesión se acaba de iniciar o reanudar tras una actualización de SO o del IDE Antigravity, ` +
            `verifica inmediatamente con 'manage_task' (Action: 'list') que estén activos los 2 CRONs Daemon exclusivos del proyecto Salones San Pedro Plus (y ninguno redundante): ` +
            `1) Loop 1 Principal (UX/CRO/SEO/GEO Consciente): CronExpression '15 9,13,17,21 * * *' (IsDaemon: true, ExactTiming: false). ` +
            `2) Loop 2 Secundario (Meta-Agente Auditor de Prompts): CronExpression '0 20 1,6,11,16,21,26 * *' (IsDaemon: true, ExactTiming: false). ` +
            `Si alguno no aparece activo en 'manage_task list', prográmalo automáticamente de inmediato con la herramienta 'schedule'.`
        }
      }
    ]
  };
  process.stdout.write(JSON.stringify(payload) + '\n');
}

main();
