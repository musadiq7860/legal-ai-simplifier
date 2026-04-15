"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = getSupabase();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      // Refresh server state so middleware sees the new auth cookies
      router.refresh();
      router.push("/upload");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email) {
      setError("Enter your email first");
      return;
    }
    setLoading(true);
    setError("");

    const supabase = getSupabase();
    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      setError(error.message);
    } else {
      setMagicLinkSent(true);
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "64px 24px 24px",
        position: "relative",
      }}
    >
      <div className="grid-texture" />

      <div
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: 440,
          padding: "48px 40px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <span className="label-mono" style={{ color: "var(--accent)" }}>
            Welcome Back
          </span>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "2rem",
              fontWeight: 700,
              marginTop: 8,
            }}
          >
            Sign In
          </h1>
        </div>

        {magicLinkSent ? (
          <div style={{ textAlign: "center" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 16px", display: "block" }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.3rem",
                marginBottom: 8,
              }}
            >
              Check Your Email
            </h3>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.9rem",
                lineHeight: 1.6,
              }}
            >
              We sent a magic link to <strong style={{ color: "var(--accent)" }}>{email}</strong>.
              Click it to sign in.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSignIn}>
            {error && (
              <div
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: 8,
                  padding: "12px 16px",
                  marginBottom: 20,
                  fontSize: "0.85rem",
                  color: "#ef4444",
                }}
              >
                {error}
              </div>
            )}

            <div style={{ marginBottom: 20 }}>
              <label className="label-mono" style={{ marginBottom: 8, display: "block" }}>
                Email
              </label>
              <input
                type="email"
                className="input-dark"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label className="label-mono" style={{ marginBottom: 8, display: "block" }}>
                Password
              </label>
              <input
                type="password"
                className="input-dark"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-accent"
              disabled={loading}
              style={{ width: "100%", marginBottom: 12 }}
            >
              {loading ? <span className="spinner" /> : "Sign In"}
            </button>

            <button
              type="button"
              className="btn-ghost"
              onClick={handleMagicLink}
              disabled={loading}
              style={{ width: "100%", marginBottom: 24 }}
            >
              Send Magic Link Instead
            </button>

            <p
              style={{
                textAlign: "center",
                fontSize: "0.85rem",
                color: "var(--text-secondary)",
              }}
            >
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                style={{ color: "var(--accent)", textDecoration: "none" }}
              >
                Sign Up
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
