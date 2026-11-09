import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../components/features/auth/AuthContext";
import { api } from "../components/features/api";
import { AuthFrame } from "../common/AuthFrame";
import { Button, Card, Field, Notice } from "../ui/Ui";
export default function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const email = String(form.get("email"));
      const password = String(form.get("password"));
      await api.register({
        studentNumber: form.get("studentNumber"),
        fullName: form.get("fullName"),
        email,
        password,
      });
      await login(email, password);
      navigate("/dashboard");
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Unable to create an account.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <AuthFrame>
      <Card className="w-full max-w-md">
        <form onSubmit={submit}>
          <Link to="/login" className="text-xs font-semibold text-[#2b5078]">
            ← Back to log in
          </Link>
          <h2 className="mt-5 text-2xl font-bold text-slate-900">
            Create your account.
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Register with your campus details.
          </p>
          <div className="mt-5 space-y-4">
            <Field
              label="Student number"
              name="studentNumber"
              required
              placeholder="e.g. 2026-00123"
            />
            <Field
              label="Full name"
              name="fullName"
              minLength={2}
              required
              placeholder="Your full name"
            />
            <Field
              label="Email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
            />
            <Field
              label="Password (at least 12 characters)"
              name="password"
              type="password"
              minLength={12}
              maxLength={128}
              required
            />
          </div>
          {error && (
            <div className="mt-4">
              <Notice>{error}</Notice>
            </div>
          )}
          <Button className="mt-5 w-full" disabled={busy}>
            {busy ? "Creating account…" : "Create account"}
          </Button>
          <p className="mt-4 text-xs leading-5 text-slate-500">
            Your campus manages your course enrollment.
          </p>
        </form>
      </Card>
    </AuthFrame>
  );
}
