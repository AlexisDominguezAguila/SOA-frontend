// src/utils/auth-helpers.js
import api from "@/services/api";

export function logoutSilent() {
  localStorage.removeItem("userInfo");
  delete api.defaults.headers.common.Authorization;
  window.location.href = "/admin/login";
}
