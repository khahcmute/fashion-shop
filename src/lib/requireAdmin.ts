import { getAuthUser } from "@/lib/getAuthUser";

export async function requireAdmin() {
  const authUser = await getAuthUser();

  if (!authUser) {
    return {
      ok: false,
      status: 401,
      message: "Chưa đăng nhập",
    };
  }

  if (authUser.role !== "ADMIN") {
    return {
      ok: false,
      status: 403,
      message: "Bạn không có quyền truy cập",
    };
  }

  return {
    ok: true,
    user: authUser,
  };
}
