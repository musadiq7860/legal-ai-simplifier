"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const supabase = getSupabase();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
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
            Get Started
          </span>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "2rem",
              fontWeight: 700,
              marginTop: 8,
            }}
          >
            Create Account
          </h1>
        </div>

        {success ? (
          <div style={{ textAlign: "center" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 16px", display: "block" }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.3rem",
                marginBottom: 8,
              }}
            >
              Account Created
            </h3>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.9rem",
                lineHeight: 1.6,
                marginBottom: 24,
              }}
            >
              Check your email for a confirmation link, then{" "}
              <Link
                href="/sign-in"
                style={{ color: "var(--accent)", textDecoration: "none" }}
              >
                sign in
              </Link>
              .
            </p>
          </div>
        ) : (
          <form onSubmit={handleSignUp}>
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

            <div style={{ marginBottom: 20 }}>
              <label className="label-mono" style={{ marginBottom: 8, display: "block" }}>
                Password
              </label>
              <input
                type="password"
                className="input-dark"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label className="label-mono" style={{ marginBottom: 8, display: "block" }}>
                Confirm Password
              </label>
              <input
                type="password"
                className="input-dark"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-accent"
              disabled={loading}
              style={{ width: "100%", marginBottom: 24 }}
            >
              {loading ? <span className="spinner" /> : "Create Account"}
            </button>

            <p
              style={{
                textAlign: "center",
                fontSize: "0.85rem",
                color: "var(--text-secondary)",
              }}
            >
              Already have an account?{" "}
              <Link
                href="/sign-in"
                style={{ color: "var(--accent)", textDecoration: "none" }}
              >
                Sign In
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
