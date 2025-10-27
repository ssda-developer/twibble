const base = "/api/posts";

export async function fetchPosts({ originalOnly = true, cursor, limit = 20 } = {}) {
    const params = new URLSearchParams();
    if (originalOnly) params.set("onlyOriginal", "true");
    if (cursor) params.set("cursor", cursor);
    if (limit) params.set("limit", String(limit));

    const res = await fetch(`http://localhost:3000${base}?${params.toString()}`, { method: "GET" });
    if (!res.ok) throw new Error("Failed to load posts");
    return res.json();
}

export async function fetchUserPosts({ originalOnly = true, cursor, limit = 20, author = null } = {}) {
    const params = new URLSearchParams();
    if (originalOnly) params.set("onlyOriginal", "true");
    if (author) params.set("author", author);
    if (cursor) params.set("cursor", cursor);
    if (limit) params.set("limit", String(limit));

    const res = await fetch(`http://localhost:3000${base}?${params.toString()}`, { method: "GET" });
    if (!res.ok) throw new Error("Failed to load posts");
    return res.json();
}

export async function fetchReplies(postId, { cursor, limit = 20 } = {}) {
    const params = new URLSearchParams();
    if (cursor) params.set("cursor", cursor);
    if (limit) params.set("limit", String(limit));

    const res = await fetch(`http://localhost:3000/api/posts/${postId}/replies?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to load replies");
    return res.json();
}

export async function fetchPostById(id) {
    const res = await fetch(`http://localhost:3000${base}/${encodeURIComponent(id)}`, { method: "GET" });
    if (!res.ok) throw new Error(`Failed to load post by ${id}`);
    return res.json();
}

export async function createPost(payload) {
    const res = await fetch(`http://localhost:3000${base}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Failed to create post");
    return res.json();
}
