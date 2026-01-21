const buildQuery = (params = {}) => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        if (Array.isArray(value)) {
            value.forEach((v) => searchParams.append(key, String(v)));
            return;
        }

        if (typeof value === "object") {
            searchParams.append(key, JSON.stringify(value));
            return;
        }

        searchParams.append(key, String(value));
    });

    const qs = searchParams.toString();
    return qs ? `?${qs}` : "";
};

const withQuery = (path, params) => `${path}${buildQuery(params)}`;

const apiFetch = async (path, options = {}) => {
    const opts = { ...options };
    opts.headers = opts.headers || {};

    if (opts.body && !opts.headers["Content-Type"]) {
        opts.headers["Content-Type"] = "application/json";
    }

    if (opts.body && typeof opts.body === "object") {
        opts.body = JSON.stringify(opts.body);
    }

    const res = await fetch(path, opts);

    let data = null;
    try {
        data = await res.json();
    } catch (_) {
        data = null;
    }

    if (!res.ok) {
        return {
            ok: false,
            error: data?.message || "API Error",
            status: res.status
        };
    }

    return data;
};

export const fetchUserByNameOrId = (user, params) => {
    return apiFetch(withQuery(`/api/users/${user}`, params));
};

export const fetchPosts = (params = {}) => {
    return apiFetch(withQuery(`/api/posts`, { ...params, includeReposts: true }));
};

export const fetchPostById = (postId, params) => {
    return apiFetch(withQuery(`/api/posts/${postId}`, params));
};

export const fetchReplies = (postId, params = {}) => {
    return apiFetch(withQuery(`/api/posts/${postId}/replies`, params));
};

export const fetchUserPosted = (user, params = {}) => {
    return apiFetch(withQuery(`/api/users/${user}/posted`, { ...params, includeReposts: true }));
};

export const fetchUserReplied = (user, params = {}) => {
    return apiFetch(withQuery(`/api/users/${user}/replied`, params));
};

export const fetchUserSaved = (user, params = {}) => {
    return apiFetch(withQuery(`/api/users/${user}/saved`, params));
};

export const fetchUserLiked = (user, params = {}) => {
    return apiFetch(withQuery(`/api/users/${user}/liked`, params));
};

export const toggleLike = (postId, userId, action) => {
    return apiFetch(`/api/posts/${postId}/like`, {
        method: "PATCH",
        body: { userId, action }
    });
};

export const toggleSave = (postId, userId, action) => {
    return apiFetch(`/api/posts/${postId}/save`, {
        method: "PATCH",
        body: { userId, action }
    });
};

export const createPost = (postData) => {
    return apiFetch(`/api/posts`, {
        method: "POST",
        body: postData
    });
};

export const createRepost = createPost;

export const editPost = (postId, postData) => {
    return apiFetch(`/api/posts/${postId}/edit`, {
        method: "PATCH",
        body: postData
    });
};

export const deletePost = (postId) => {
    return apiFetch(`/api/posts/${postId}`, {
        method: "DELETE"
    });
};

export const loginRequest = ({ username, password }) => {
    return apiFetch(`/api/auth/login`, {
        method: "POST",
        credentials: "include",
        body: { username, password }
    });
};

export const registerRequest = (user) => {
    return apiFetch(`/api/auth/register`, {
        method: "POST",
        credentials: "include",
        body: user
    });
};

export const logoutRequest = () => {
    return apiFetch(`/api/auth/logout`, {
        method: "POST",
        credentials: "include"
    });
};

export const fetchMe = async () => {
    try {
        return await apiFetch(`/api/auth/me`, {
            method: "GET",
            credentials: "include"
        });
    } catch (_) {
        return { user: null };
    }
};

export const fetchTrendingPosts = () => {
    return apiFetch(`/api/trending`);
};
