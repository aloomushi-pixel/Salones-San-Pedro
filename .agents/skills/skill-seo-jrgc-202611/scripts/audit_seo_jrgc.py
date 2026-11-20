#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Auditor CLI Técnico + Síntesis Escaneable + Marketese — SKILL SEO JRGC 202611 (v3.0)
Uso: python .agents/skills/skill-seo-jrgc-202611/scripts/audit_seo_jrgc.py <URL_O_HTML>
"""
import sys
import re
import json
import urllib.request
from html.parser import HTMLParser

AI_CLICHES = [
    r"en el vertiginoso mundo",
    r"desbloquea el poder",
    r"revolucionario",
    r"\b10x\b",
    r"¿el resultado\?",
    r"no es solo .+, es .+",
    r"sin complicaciones, sin estrés, sin sorpresas",
    r"líder indiscutible",
    r"solución integral de vanguardia",
]

class SEOHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_title = False
        self.in_h1 = False
        self.in_h2 = False
        self.in_script_ld = False
        self.title = ""
        self.h1s = []
        self.h2s = []
        self.current_h1 = ""
        self.current_h2 = ""
        self.metas = {}
        self.canonical = None
        self.json_ld = []
        self.current_ld = ""
        self.imgs_total = 0
        self.imgs_missing_alt = 0
        self.links_internal = 0
        self.links_external = 0
        self.text_chunks = []

    def handle_starttag(self, tag, attrs):
        attr_dict = dict(attrs)
        if tag == "title":
            self.in_title = True
        elif tag == "h1":
            self.in_h1 = True
            self.current_h1 = ""
        elif tag == "h2":
            self.in_h2 = True
            self.current_h2 = ""
        elif tag == "meta":
            name = (attr_dict.get("name") or attr_dict.get("property") or "").lower()
            content = attr_dict.get("content") or ""
            if name:
                self.metas[name] = content
        elif tag == "link":
            rel = (attr_dict.get("rel") or "").lower()
            if "canonical" in rel:
                self.canonical = attr_dict.get("href")
        elif tag == "script":
            if (attr_dict.get("type") or "").lower() == "application/ld+json":
                self.in_script_ld = True
                self.current_ld = ""
        elif tag == "img":
            self.imgs_total += 1
            alt = attr_dict.get("alt")
            if alt is None or alt.strip() == "":
                self.imgs_missing_alt += 1
        elif tag == "a":
            href = attr_dict.get("href") or ""
            if href.startswith("/") or href.startswith("#") or "sanpedro.aionia.com.mx" in href:
                self.links_internal += 1
            elif href.startswith("http"):
                self.links_external += 1

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
        elif tag == "h1":
            self.in_h1 = False
            if self.current_h1.strip():
                self.h1s.append(self.current_h1.strip())
        elif tag == "h2":
            self.in_h2 = False
            if self.current_h2.strip():
                self.h2s.append(self.current_h2.strip())
        elif tag == "script" and self.in_script_ld:
            self.in_script_ld = False
            try:
                self.json_ld.append(json.loads(self.current_ld))
            except Exception:
                self.json_ld.append({"error": "Invalid JSON-LD"})

    def handle_data(self, data):
        if self.in_title:
            self.title += data
        if self.in_h1:
            self.current_h1 += data
        if self.in_h2:
            self.current_h2 += data
        if self.in_script_ld:
            self.current_ld += data
        cleaned = data.strip()
        if cleaned:
            self.text_chunks.append(cleaned)

def fetch_source(target):
    if target.startswith("http://") or target.startswith("https://"):
        req = urllib.request.Request(target, headers={"User-Agent": "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            return resp.read().decode("utf-8", errors="replace"), resp.status
    else:
        with open(target, "r", encoding="utf-8", errors="replace") as f:
            return f.read(), 200

def main():
    target = sys.argv[1] if len(sys.argv) > 1 else "https://sanpedro.aionia.com.mx"
    html, status = fetch_source(target)
    parser = SEOHTMLParser()
    parser.feed(html)

    title = parser.title.strip()
    desc = parser.metas.get("description", "").strip()
    robots = parser.metas.get("robots", "").strip()
    og_image = parser.metas.get("og:image", "").strip()
    full_text = " ".join(parser.text_chunks)

    cliches_found = []
    for pat in AI_CLICHES:
        if re.search(pat, full_text, re.IGNORECASE):
            cliches_found.append(pat)

    score = 100
    findings = []

    if not (25 <= len(title) <= 60):
        score -= 10
        findings.append(f"[WARN] <title> longitud={len(title)} (recomendado <=60c): '{title}'")
    if not (70 <= len(desc) <= 160):
        score -= 10
        findings.append(f"[WARN] <meta description> longitud={len(desc)} (recomendado <=160c)")
    if not parser.canonical:
        score -= 15
        findings.append("[FAIL] Falta link rel='canonical'")
    if "max-image-preview:large" not in robots.lower():
        score -= 5
        findings.append("[WARN] Falta 'max-image-preview:large' en meta robots para Google Discover / SERP")
    if not og_image:
        score -= 5
        findings.append("[WARN] Falta meta og:image")
    if len(parser.h1s) != 1:
        score -= 10
        findings.append(f"[WARN] Conteo de H1={len(parser.h1s)} (esperado 1)")
    if parser.imgs_missing_alt > 0:
        score -= 10
        findings.append(f"[WARN] Imágenes sin atributo alt: {parser.imgs_missing_alt}/{parser.imgs_total}")
    if not parser.json_ld:
        score -= 15
        findings.append("[FAIL] No se detectó Schema JSON-LD")
    if cliches_found:
        score -= 5 * len(cliches_found)
        findings.append(f"[WARN] Clichés IA / marketese detectados: {cliches_found}")

    result = {
        "target": target,
        "http_status": status,
        "score": max(0, score),
        "title": title,
        "title_length": len(title),
        "description": desc,
        "description_length": len(desc),
        "canonical": parser.canonical,
        "robots_meta": robots,
        "og_image": og_image,
        "h1_count": len(parser.h1s),
        "h1s": parser.h1s,
        "h2_count": len(parser.h2s),
        "h2_sample": parser.h2s[:8],
        "images_total": parser.imgs_total,
        "images_missing_alt": parser.imgs_missing_alt,
        "links_internal": parser.links_internal,
        "links_external": parser.links_external,
        "json_ld_blocks": len(parser.json_ld),
        "cliches_found": cliches_found,
        "findings": findings,
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()
