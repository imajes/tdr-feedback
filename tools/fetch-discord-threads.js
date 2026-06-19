/**
 * fetch-discord-threads.js
 *
 * Browser-side scraper for Discord forum channel threads.
 * Run this in the browser console (or via Claude in Chrome's javascript_tool)
 * while logged into Discord on the target channel.
 *
 * Usage:
 *   1. Navigate to the forum channel in Discord web app
 *   2. Paste this entire script into the browser console
 *   3. Call: await TDR.fetchAll()
 *   4. Files will download to ~/Downloads/ as <slug>.jsonl
 *
 * The script stores all data in window.__tdr_* for inspection:
 *   window.__tdr_threads       — raw thread metadata from Discord API
 *   window.__tdr_all_messages  — { [threadId]: { thread, messages[] } }
 *   window.__tdr_files         — { [slug]: { thread_name, thread_id, lines[] } }
 */

(function () {
  // ── Auth ────────────────────────────────────────────────────────────────────

  function getToken() {
    const req = window.webpackChunkdiscord_app.push([[Symbol()], {}, r => r]);
    window.webpackChunkdiscord_app.pop();
    for (const id of Object.keys(req.c)) {
      const mod = req.c[id]?.exports;
      if (!mod) continue;
      for (const m of [mod, mod?.default, ...(typeof mod === 'object' ? Object.values(mod) : [])]) {
        if (m && typeof m.getToken === 'function') {
          try {
            const t = m.getToken();
            if (typeof t === 'string' && t.length > 20) return t;
          } catch (e) {}
        }
      }
    }
    throw new Error('Could not find Discord auth token');
  }

  // ── API helpers ─────────────────────────────────────────────────────────────

  async function apiFetch(path, token) {
    const resp = await fetch(`https://discord.com/api/v9${path}`, {
      headers: { Authorization: token },
    });
    if (!resp.ok) throw new Error(`Discord API ${resp.status} on ${path}`);
    return resp.json();
  }

  async function fetchThreadList(channelId, token) {
    const data = await apiFetch(
      `/channels/${channelId}/threads/search?sort_by=last_message_time&sort_order=desc&limit=25&offset=0`,
      token
    );
    return data.threads || [];
  }

  async function fetchAllMessages(threadId, token, { delayMs = 300 } = {}) {
    const messages = [];
    let before = null;
    while (true) {
      const qs = `limit=100${before ? '&before=' + before : ''}`;
      const batch = await apiFetch(`/channels/${threadId}/messages?${qs}`, token);
      if (!batch.length) break;
      messages.push(...batch);
      if (batch.length < 100) break;
      before = batch[batch.length - 1].id;
      await sleep(delayMs);
    }
    return messages;
  }

  // ── Serialisation ────────────────────────────────────────────────────────────

  function serializeMessage(msg, threadMeta) {
    return {
      id: msg.id,
      thread_id: msg.channel_id,
      thread_name: threadMeta.name,
      type: msg.type,
      author: {
        id: msg.author?.id,
        username: msg.author?.username,
        global_name: msg.author?.global_name,
        discriminator: msg.author?.discriminator,
      },
      content: msg.content,
      timestamp: msg.timestamp,
      edited_timestamp: msg.edited_timestamp,
      pinned: msg.pinned,
      reactions: (msg.reactions || []).map(r => ({
        emoji: r.emoji?.id ? `${r.emoji.name}:${r.emoji.id}` : r.emoji?.name,
        count: r.count,
        me: r.me,
      })),
      attachments: (msg.attachments || []).map(a => ({
        id: a.id,
        filename: a.filename,
        url: a.url,
        content_type: a.content_type,
        size: a.size,
      })),
      embeds: (msg.embeds || []).map(e => ({
        type: e.type,
        title: e.title,
        description: e.description,
        url: e.url,
      })),
      message_reference: msg.message_reference || null,
      referenced_message: msg.referenced_message
        ? {
            id: msg.referenced_message.id,
            author: msg.referenced_message.author?.username,
            content: msg.referenced_message.content,
          }
        : null,
      flags: msg.flags,
      position: msg.position ?? null,
    };
  }

  function slugify(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  // ── Download helper ──────────────────────────────────────────────────────────

  function downloadFile(filename, content) {
    const blob = new Blob([content], { type: 'application/jsonl' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ── Utilities ────────────────────────────────────────────────────────────────

  function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  // ── Main ─────────────────────────────────────────────────────────────────────

  /**
   * Fetch all threads + messages for a forum channel and download as .jsonl files.
   *
   * @param {string} channelId  - Forum channel ID (visible in the URL)
   * @param {object} opts
   * @param {boolean} opts.download  - Trigger browser downloads (default: true)
   * @param {number}  opts.delayMs   - ms between paginated requests (default: 300)
   */
  async function fetchAll(channelId, { download = true, delayMs = 300 } = {}) {
    // Auto-detect channel ID from URL if not provided
    if (!channelId) {
      const match = location.pathname.match(/\/channels\/\d+\/(\d+)/);
      if (!match) throw new Error('Could not detect channel ID from URL — provide it explicitly');
      channelId = match[1];
    }

    const token = getToken();
    console.log(`[TDR] Auth OK. Fetching thread list for channel ${channelId}…`);

    const threads = await fetchThreadList(channelId, token);
    window.__tdr_threads = { threads };
    console.log(`[TDR] Found ${threads.length} threads`);

    window.__tdr_all_messages = {};
    window.__tdr_files = {};
    window.__tdr_progress = { done: 0, total: threads.length };

    for (const thread of threads) {
      console.log(`[TDR] Fetching "${thread.name}" (~${thread.message_count} msgs)…`);
      const messages = await fetchAllMessages(thread.id, token, { delayMs });
      window.__tdr_all_messages[thread.id] = { thread, messages };

      const slug = slugify(thread.name);
      const lines = messages.map(m => JSON.stringify(serializeMessage(m, thread)));
      window.__tdr_files[slug] = { thread_name: thread.name, thread_id: thread.id, lines };

      if (download) {
        await sleep(300);
        downloadFile(`${slug}.jsonl`, lines.join('\n'));
      }

      window.__tdr_progress.done++;
      console.log(`[TDR] ✓ "${thread.name}" — ${messages.length} messages saved`);
      await sleep(500);
    }

    window.__tdr_progress.complete = true;
    console.log(`[TDR] Done. ${threads.length} threads, ${
      Object.values(window.__tdr_all_messages).reduce((n, t) => n + t.messages.length, 0)
    } total messages.`);

    return window.__tdr_files;
  }

  // ── Chunk accessor (for extracting data via javascript_tool) ─────────────────

  function getChunk(slug, start, end) {
    const f = window.__tdr_files[slug];
    if (!f) return null;
    return f.lines.slice(start, end).join('\n');
  }

  function getMeta() {
    return Object.entries(window.__tdr_files).map(([slug, f]) => ({
      slug,
      thread_name: f.thread_name,
      thread_id: f.thread_id,
      total_lines: f.lines.length,
    }));
  }

  // ── Expose ───────────────────────────────────────────────────────────────────

  window.TDR = { fetchAll, getChunk, getMeta, getToken };
  console.log('[TDR] Loaded. Call: await TDR.fetchAll() — or TDR.fetchAll("<channelId>")');
})();
