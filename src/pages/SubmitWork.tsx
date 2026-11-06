import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { api } from "../components/features/api";
import { useResource } from "../common/useResource";
import { Page } from "../common/Page";
import { ResourceState } from "../common/ResourceState";
import { Button, Card, Notice, TextArea } from "../ui/Ui";
import { field, text } from "../lib/api";
export default function SubmitWork() {
  const [params] = useSearchParams();
  const id = params.get("assignmentId") || "";
  const state = useResource(
    () =>
      id
        ? Promise.all([api.assignment(id), api.draft(id)])
        : Promise.reject(new Error("Open this page from an assignment first.")),
    [id],
  );
  const draft = (field(state.data?.[1], "draft") ||
    state.data?.[1] ||
    {}) as Record<string, unknown>;
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const assignment = state.data?.[0] || {};
  useEffect(() => {
    setContent(text(field(draft, "content", "body")));
  }, [state.data]);
  async function save(submit: boolean) {
    if (!id) return;
    setBusy(true);
    setMessage("");
    try {
      if (submit) {
        await api.submit(id, content);
        navigate("/receipt?assignmentId=" + encodeURIComponent(id));
      } else {
        await api.saveDraft(id, content);
        setMessage("Draft saved.");
      }
    } catch (reason) {
      setMessage(
        reason instanceof Error ? reason.message : "Unable to save your work.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <Page
      title="Submit your work"
      description={text(
        field(assignment, "title"),
        "Write and submit your assignment response.",
      )}
      actions={
        <Link
          to="/assignments"
          className="text-sm font-semibold text-[#2b5078]"
        >
          ← Assignments
        </Link>
      }
    >
      <ResourceState loading={state.loading} error={state.error} />
      {!state.loading && !state.error && (
        <Card className="max-w-4xl">
          <p className="mb-5 rounded-lg bg-blue-50 p-3 text-sm text-blue-900">
            Text submission only. File uploads are not available in this
            backend.
          </p>
          <TextArea
            label="Your response"
            rows={14}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your response here…"
          />
          {message && (
            <div className="mt-4">
              <Notice tone={message === "Draft saved." ? "success" : "error"}>
                {message}
              </Notice>
            </div>
          )}
          <div className="mt-5 flex flex-wrap justify-end gap-3">
            <Button
              variant="secondary"
              disabled={busy}
              onClick={() => save(false)}
            >
              Save draft
            </Button>
            <Button
              disabled={busy || !content.trim()}
              onClick={() => save(true)}
            >
              {busy ? "Submitting…" : "Submit assignment"}
            </Button>
          </div>
        </Card>
      )}
    </Page>
  );
}
