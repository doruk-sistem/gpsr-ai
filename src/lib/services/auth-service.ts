import { LoginRequest, User } from "@/lib/api/endpoints";
import { supabase } from "@/lib/supabase/client";

class AuthService {
  public async login(credentials: LoginRequest) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw error;

    return { data, error };
  }

  public async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  public async refreshToken() {
    const { data, error } = await supabase.auth.refreshSession();

    if (error) throw error;

    return {
      data,
      error,
    };
  }

  public async getCurrentUser(): Promise<User> {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) throw error;
    if (!user) throw new Error("No user found");

    return user;
  }

  public async updateCurrentUser(user: Partial<User["user_metadata"]>) {
    const { data, error } = await supabase.auth.updateUser({
      data: user,
    });

    if (error) throw error;
    return data;
  }

  public async signUp(credentials: LoginRequest): Promise<void> {
    const { error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
  }

  public async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;
  }

  public async updatePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
  }

  public async signInWithGoogle() {
    return supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }
}

const authService = new AuthService();

export default authService;
