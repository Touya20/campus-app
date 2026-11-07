import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../components/features/auth/AuthContext";
import { AuthFrame } from "../common/AuthFrame";
import { Button, Card, Field, Notice } from "../ui/Ui";
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const form = new FormData(e.currentTarget);
    try {
      await login(String(form.get("email")), String(form.get("password")));
      navigate("/dashboard");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to sign in.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <AuthFrame>
      <Card className="w-full max-w-md">
        <form onSubmit={submit}>
          <h2 className="text-2xl font-bold text-slate-900">Welcome back.</h2>
          <p className="mt-2 text-sm text-slate-500">
            Log in to pick up where you left off.
          </p>
          <Field
            className="mt-6"
            label="Institutional email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@campus.edu.ph"
            required
          />
          <p className="mt-1 text-xs text-slate-500">
            Use the email provided by your school.
          </p>
          <label className="mt-5 grid gap-2 text-sm font-medium text-slate-700">
            <span>Password</span>
            <span className="flex rounded-lg border border-slate-300 focus-within:border-[#2b5078] focus-within:ring-2 focus-within:ring-blue-100">
              <input
                className="min-h-11 min-w-0 flex-1 rounded-lg bg-transparent px-3 outline-none"
                type={show ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="px-3 text-xs text-slate-500"
                onClick={() => setShow(!show)}
              >
                {show ? "Hide" : "Show"}
              </button>
            </span>
          </label>
          {error && (
            <div className="mt-4">
              <Notice>{error}</Notice>
            </div>
          )}
          <div className="my-5 flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-slate-600">
              <input type="checkbox" className="accent-[#2b5078]" />
              Remember me
            </label>
            <Link
              className="font-semibold text-[#2b5078] hover:underline"
              to="/forgot-password"
            >
              Forgot password?
            </Link>
          </div>
          <Button className="w-full" disabled={busy}>
            {busy ? "Signing in…" : "Log in"}
          </Button>
          <div className="my-5 border-t border-slate-200" />
          <p className="text-center text-xs text-slate-600">
            New to Campus?{" "}
            <Link
              className="font-semibold text-[#2b5078] hover:underline"
              to="/signup"
            >
              Sign up
            </Link>
          </p>
          <p className="mt-5 text-center text-[11px] leading-5 text-slate-500">
            Using a shared computer? Leave “Remember me” unchecked and log out
            when you’re done.
          </p>
        </form>
      </Card>
    </AuthFrame>
  );
}
