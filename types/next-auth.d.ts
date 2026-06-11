import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: "student" | "insider" | "admin";
      isVerified: boolean;
    };
  }

  interface User {
    role: "student" | "insider" | "admin";
    isVerified: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "student" | "insider" | "admin";
    isVerified: boolean;
    id: string;
  }
}
