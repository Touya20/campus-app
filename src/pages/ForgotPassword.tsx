import { useState } from "react";
import { Link } from "react-router";
import { AuthFrame } from "../common/AuthFrame";
import { Button, Card, Field, Notice } from "../ui/Ui";
export default function ForgotPassword() {
  const [requested, setRequested] = useState(false);
  return (
    <AuthFrame>
      <Card className="w-full max-w-md">
        <Link to="/login" className="text-xs font-semibold text-[#2b5078]">
          ← Back to log in
        </Link>
        <div className="mt-6 grid size-10 place-items-center rounded-lg bg-blue-50 text-lg text-[#2b5078]">
          ⌕
        </div>
        <h1 className="mt-5 text-2xl font-bold text-slate-900">
          Forgot password?
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Enter your institutional email to request a reset link.
        </p>
        <form
          className="mt-5"
          onSubmit={(e) => {
            e.preventDefault();
            setRequested(true);
          }}
        >
          <Field
            label="Institutional email"
            type="email"
            required
            placeholder="you@campus.edu.ph"
          />
          <p className="mt-1 text-xs text-slate-500">
            Use the email linked to your Campus account.
          </p>
          <Button className="mt-5 w-full">Send reset link</Button>
        </form>
        {requested && (
          <div className="mt-4">
            <Notice>
              Password reset email delivery is not available yet. Please contact
              your school’s IT help desk.
            </Notice>
          </div>
        )}
        <div className="mt-5 rounded-lg bg-blue-50 p-4 text-xs">
          <strong className="text-slate-800">
            Can’t access your school email?
          </strong>
          <p className="mt-2 text-slate-600">
            Your school’s IT help desk can help you recover access.
          </p>
          <a
            className="mt-3 inline-block font-semibold text-[#2b5078]"
            href="mailto:student-support@campus.edu.ph"
          >
            Contact student support →
          </a>
        </div>
      </Card>
    </AuthFrame>
  );
}
