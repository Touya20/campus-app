import { useState } from "react";
import { api } from "../components/features/api";
import { useResource } from "../common/useResource";
import { Page } from "../common/Page";
import { ResourceState } from "../common/ResourceState";
import { Button, Card, Field, Notice } from "../ui/Ui";
import { field, text } from "../lib/api";
export default function Profile() {
  const state = useResource(() => api.profile(), []);
  const profile = (field(state.data, "user", "profile") ||
    state.data ||
    {}) as Record<string, unknown>;
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setNotice("");
    const d = new FormData(e.currentTarget);
    try {
      await api.updateProfile({
        fullName: d.get("fullName"),
        program: d.get("program") || null,
        yearLevel: d.get("yearLevel") ? Number(d.get("yearLevel")) : null,
        section: d.get("section") || null,
      });
      setNotice("Profile changes saved.");
    } catch (x) {
      setNotice(
        x instanceof Error ? x.message : "Could not save your profile.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <Page
      title="My profile"
      description="Update the profile details associated with your student account."
    >
      <ResourceState loading={state.loading} error={state.error} />
      {!state.loading && !state.error && (
        <Card className="max-w-2xl">
          <div className="mb-6 flex items-center gap-4">
            <span className="grid size-14 place-items-center rounded-full bg-blue-50 text-xl font-bold text-[#2b5078]">
              {text(field(profile, "fullName", "full_name"), "S").slice(0, 1)}
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {text(field(profile, "fullName", "full_name"), "Student")}
              </h2>
              <p className="text-sm text-slate-500">
                {text(field(profile, "studentNumber", "student_number"))} ·{" "}
                {text(field(profile, "email"))}
              </p>
            </div>
          </div>
          <form onSubmit={save} className="space-y-4">
            <Field
              label="Full name"
              name="fullName"
              defaultValue={text(field(profile, "fullName", "full_name"))}
              required
            />
            <Field
              label="Program"
              name="program"
              defaultValue={text(field(profile, "program"))}
            />
            <Field
              label="Year level"
              name="yearLevel"
              type="number"
              min={1}
              max={10}
              defaultValue={text(field(profile, "yearLevel", "year_level"))}
            />
            <Field
              label="Section"
              name="section"
              defaultValue={text(field(profile, "section"))}
            />
            {notice && (
              <Notice
                tone={notice === "Profile changes saved." ? "success" : "error"}
              >
                {notice}
              </Notice>
            )}
            <Button disabled={busy}>{busy ? "Saving…" : "Save profile"}</Button>
          </form>
          <p className="mt-5 text-xs text-slate-500">
            Student number, email, role, and course enrollment are managed by
            your campus.
          </p>
        </Card>
      )}
    </Page>
  );
}
