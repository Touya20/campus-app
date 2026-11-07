import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { api } from "../components/features/api";
import { useResource } from "../common/useResource";
import { Page } from "../common/Page";
import { ResourceState } from "../common/ResourceState";
import { Button, Card, Dialog, Notice, TextArea } from "../ui/Ui";
import { field, text } from "../lib/api";
export default function EditDraft() {
  const [params] = useSearchParams();
  const assignmentId = params.get("assignmentId") || "";
  const state = useResource(
    () =>
      assignmentId
        ? api.draft(assignmentId)
        : Promise.reject(new Error("Select an assignment to open its draft.")),
    [assignmentId],
  );
  const [draftId, setDraftId] = useState("");
  const [content, setContent] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const value = (field(state.data, "draft") || state.data || {}) as Record<
      string,
      unknown
    >;
    setDraftId(text(field(value, "id", "draftId", "draft_id")));
    setContent(text(field(value, "content", "body")));
  }, [state.data]);
  async function save() {
    setBusy(true);
    try {
      if (draftId) await api.updateDraft(draftId, content);
      else {
        await api.saveDraft(assignmentId, content);
        const fresh = await api.draft(assignmentId);
        const value = (field(fresh, "draft") || fresh) as Record<
          string,
          unknown
        >;
        setDraftId(text(field(value, "id", "draftId", "draft_id")));
      }
      setMessage("Draft saved.");
    } catch (reason) {
      setMessage(
        reason instanceof Error ? reason.message : "Could not save draft.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function remove() {
    if (!draftId) {
      setConfirm(false);
      setMessage("There is no saved draft to delete.");
      return;
    }
    setBusy(true);
    try {
      await api.deleteDraft(draftId);
      setDraftId("");
      setContent("");
      setConfirm(false);
      setMessage("Draft deleted.");
    } catch (reason) {
      setMessage(
        reason instanceof Error ? reason.message : "Could not delete draft.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <Page
      title="Edit draft"
      description="Continue working on your saved response."
      actions={
        <Link
          to="/submissions"
          className="text-sm font-semibold text-[#2b5078]"
        >
          ← My submissions
        </Link>
      }
    >
      <ResourceState loading={state.loading} error={state.error} />
      {!state.loading && !state.error && (
        <Card className="max-w-4xl">
          <TextArea
            label="Draft response"
            rows={14}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Your saved response…"
          />
          {message && (
            <div className="mt-4">
              <Notice
                tone={
                  message.includes("saved") || message.includes("deleted")
                    ? "success"
                    : "error"
                }
              >
                {message}
              </Notice>
            </div>
          )}
          <div className="mt-5 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setConfirm(true)}>
              Delete draft
            </Button>
            <Button disabled={busy} onClick={save}>
              Save changes
            </Button>
          </div>
        </Card>
      )}
      {confirm && (
        <Dialog title="Delete this draft?" onClose={() => setConfirm(false)}>
          <p className="text-sm text-slate-600">
            This action cannot be undone.
          </p>
          <div className="mt-5 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setConfirm(false)}>
              Keep draft
            </Button>
            <Button variant="danger" disabled={busy} onClick={remove}>
              Delete draft
            </Button>
          </div>
        </Dialog>
      )}
    </Page>
  );
}
