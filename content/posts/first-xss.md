---
title: "How I found my first XSS on a bug bounty program"
slug: "first-xss"
date: "2026-06-01"
category: "bug-bounty"
tag: ["xss", "bug-bounty"]
description: "A walkthrough of finding reflected XSS during recon on a private program."
---

It started with a routine recon pass — nothing special. Here's how a forgotten parameter turned into my first paid bounty.

## Recon

Running `httpx` against the full subdomain list turned up a staging host that wasn't linked anywhere in the main app.

## The bug

A search parameter reflected user input directly into an inline `<script>` block without encoding.

## Fix & disclosure

Reported same day, triaged within 48 hours, fixed within a week.
