function buildQuery(params = {}) {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) query.append(key, value);
    });
    return query.toString();
}

export async function fetchPosts(params = {}) {
    const queryString = buildQuery(params);

    const res = await fetch(`http://localhost:3000/api/posts?${queryString}`);
    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
}

export async function fetchPostById(postId, params) {
    const queryString = buildQuery(params);

    const res = await fetch(`http://localhost:3000/api/posts/${postId}?${queryString}`);
    if (!res.ok) throw new Error("Failed to fetch post");
    return res.json();
}

export async function fetchReplies(postId, params = {}) {
    const queryString = buildQuery(params);

    const res = await fetch(`http://localhost:3000/api/posts/${postId}/replies?${queryString}`);
    if (!res.ok) throw new Error("Failed to fetch replies");
    return res.json();
}

export async function fetchUserPosts(userId, params = {}) {
    const queryString = buildQuery(params);

    const res = await fetch(`http://localhost:3000/api/users/${userId}/posts?${queryString}`);
    if (!res.ok) throw new Error("Failed to fetch user posts");
    return res.json();
}

export async function fetchUserReplies(userId, params = {}) {
    const queryString = buildQuery(params);

    const res = await fetch(`http://localhost:3000/api/users/${userId}/replies?${queryString}`);
    if (!res.ok) throw new Error("Failed to fetch user replies");
    return res.json();
}

export async function toggleLike(postId, userId, action) {
    const res = await fetch(`http://localhost:3000/api/posts/${postId}/likes`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action })
    });
    if (!res.ok) throw new Error("Failed to toggle like");
    return res.json();
}

export async function createPost(postData) {
    const res = await fetch(`http://localhost:3000/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData)
    });
    if (!res.ok) throw new Error("Failed to create post");
    return res.json();
}
