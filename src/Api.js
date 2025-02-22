import axios from "axios";

const API = axios.create({
  baseURL: "https://gitbranch-viewer-backend.onrender.com",
  withCredentials: true,
});

export const fetchUser = () => API.get("/auth/user");
export const fetchRepos = () => API.get("/github/repos");
export const fetchBranches = (owner, repo) =>
  API.get(`/github/branches/${owner}/${repo}`);
