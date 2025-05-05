import { LoginRequest, User } from "@/lib/api/endpoints";
import { supabase } from "@/lib/supabase/client";

class AuthService {
  public async login(credentials: LoginRequest) {
    try {
      console.log("Login attempt for email:", credentials.email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        console.error("Login error:", error);
        throw error;
      }

      console.log("Login successful, session established:", !!data.session);
      return { data, error };
    } catch (error) {
      console.error("Login exception:", error);
      throw error;
    }
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
    try {
      console.log("Signup attempt for email:", credentials.email);
      
      // First sign up the user
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error("Signup error:", error);
        throw error;
      }
      
      console.log("Signup successful, session created:", !!data.session);
      
      // If email confirmations are disabled (as configured in supabase/config.toml),
      // the user should already be signed in. However, in some cases we need to ensure
      // the session is properly established, so we'll explicitly sign in.
      if (!data.session) {
        console.log("No session after signup, attempting explicit login");
        // Sign in the user immediately after sign up
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (signInError) {
          console.error("Post-signup login error:", signInError);
          throw signInError;
        }
        
        console.log("Post-signup login successful, session established:", !!signInData.session);
      }
    } catch (error) {
      console.error("Signup process exception:", error);
      throw error;
    }
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