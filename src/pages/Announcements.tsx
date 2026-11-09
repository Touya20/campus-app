import { useParams, Link } from "react-router";
import { api } from "../components/features/api";
import { useResource } from "../common/useResource";
import { Page } from "../common/Page";
import { ResourceState } from "../common/ResourceState";
import { Badge, Button, Card, EmptyState, RecordRow, Notice } from "../ui/Ui";
import { field, rows, text, date } from "../lib/api";
import { useState } from "react";
export default function Announcements() {
  const { id = "" } = useParams();
  const state = useResource(
    () => (id ? api.announcement(id) : api.announcements()),
    [id],
  );
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  async function markRead() {
    if (!id) return;
    setBusy(true);
    setNotice("");
    try {
      await api.markRead(id);
      setNotice("Marked as read.");
    } catch (e) {
      setNotice(
        e instanceof Error ? e.message : "Could not update read status.",
      );
    } finally {
      setBusy(false);
    }
  }
  const items = rows(state.data);
  const item = (field(state.data, "announcement") ||
    state.data ||
    {}) as Record<string, unknown>;
  return (
    <Page
      title={id ? text(field(item, "title"), "Announcement") : "Announcements"}
      description={
        id
          ? "Announcement details for your campus or enrolled courses."
          : "Campus news and course updates."
      }
      actions={
        id ? (
          <Link
            to="/announcements"
            className="text-sm font-semibold text-[#2b5078]"
          >
            ← All announcements
          </Link>
        ) : undefined
      }
    >
      <ResourceState loading={state.loading} error={state.error} />
      {!state.loading &&
        !state.error &&
        (id ? (
          <Card>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>
                {text(
                  field(item, "courseName", "course_name", "courseCode", "course_code"),
                  "Campus announcement",
                )}
              </Badge>
              <span className="text-xs text-slate-500">
                {date(field(item, "createdAt", "created_at", "publishedAt"))}
              </span>
            </div>
            <p className="mt-6 whitespace-pre-wrap text-sm leading-7 text-slate-700">
              {text(
                field(item, "body", "content", "message"),
                "No announcement message was included.",
              )}
            </p>
            {notice && (
              <div className="mt-4">
                <Notice
                  tone={notice === "Marked as read." ? "success" : "error"}
                >
                  {notice}
                </Notice>
              </div>
            )}
            <Button
              className="mt-5"
              variant="secondary"
              disabled={busy}
              onClick={markRead}
            >
              {busy ? "Saving…" : "Mark as read"}
            </Button>
          </Card>
        ) : (
          <Card className="!p-0">
            {items.length ? (
              items.map((a, i) => {
                const key = text(
                  field(a, "id", "announcementId", "announcement_id"),
                  String(i),
                );
                return (
                  <RecordRow
                    key={key}
                    to={"/announcements/" + key}
                    title={text(field(a, "title"), "Campus announcement")}
                    description={text(
                      field(a, "courseName", "course_name", "courseCode", "course_code", "body", "content"),
                      "Announcement details",
                    )}
                    meta={
                      <span>
                        {date(field(a, "createdAt", "created_at"))}
                        <small className="mt-1 block">
                          {field(a, "isRead", "is_read") ? "Read" : "Unread"}
                        </small>
                      </span>
                    }
                  />
                );
              })
            ) : (
              <EmptyState
                title="No announcements"
                detail="New campus and course updates will appear here."
              />
            )}
          </Card>
        ))}
    </Page>
  );
}
