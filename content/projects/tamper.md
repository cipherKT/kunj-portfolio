---
title: "tamper"
slug: "tamper"
tag: "Go · Security CLI"
date: "2026-08-16"
description: "An interactive Go CLI for testing sensitive account-update flows — host header injection and body manipulation payloads, run one at a time with automatic markdown reporting."
repo: "https://github.com/cipherKT/tamper"
---

## Overview

`tamper` is a single-binary CLI for testing account-update endpoints — email change, password reset, username update, mobile number change, or any flow with a similar request/confirmation pattern. It supports both HTTP/1.1 and HTTP/2 targets out of the box.

You feed it a raw request file exported from Burp or Caido, pick an attack mode, and it walks through payloads one at a time: send, inspect the response, check your inbox or out-of-band channel, log the result. Every session produces a markdown report automatically.

## Key Features

- 16 host header injection payloads — `X-Forwarded-Host`, `Forwarded`, host append/fragment tricks, IP-spoof headers for rate-limit bypass, and more
- 19 body manipulation payloads — array injection, type confusion, duplicate keys, CRLF injection, presence-gated redirect-field payloads, form parameter pollution
- Interactive send loop with live result logging (`interesting` / `no impact`) and notes per payload
- Auto-generated markdown report with a pass/fail summary at the end
- Auto-detects HTTP/1.1, HTTP/2, and Burp's HTTP/2 pseudo-header format
- Includes a zero-dependency local echo server for testing payloads before pointing at a real target

## Stack

- Go
- Python (bundled local echo server for offline testing)
