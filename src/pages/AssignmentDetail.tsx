import { useParams, Link } from "react-router";
import { api } from "../components/features/api";
import { useResource } from "../common/useResource";
import { Page } from "../common/Page";
import { ResourceState } from "../common/ResourceState";
import { Badge, Card } from "../ui/Ui";
import { field, text, date } from "../lib/api";
export default function AssignmentDetail() {
  const { id = "" } = useParams();
  const state = useResource(
    () =>
      Promise.all([api.assignment(id), api.draft(id), api.mySubmission(id)]),
    [id],
  );
  const a = (state.data?.[0] || {}) as Record<string, unknown>;
  const draft = (state.data?.[1] || {}) as Record<string, unknown>;
  const submission = (state.data?.[2] || {}) as Record<string, unknown>;
  return (
    <Page
      title={text(field(a, "title", "assignmentTitle"), "Assignment details")}
      description={text(
        field(a, "description", "instructions"),
        "Review the requirements and prepare your submission.",
      )}
      actions={
        <Link
          to="/assignments"
          className="text-sm font-semibold text-[#2b5078]"
        >
          ← All assignments
        </Link>
      }
    >
      <ResourceState loading={state.loading} error={state.error} />
      {!state.loading && !state.error && (
        <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
          <Card>
            <div className="flex flex-wrap gap-2">
              <Badge>
                {text(
                  field(a, "courseName", "course_name"),
                  "Course assignment",
                )}
              </Badge>
              <Badge>Due {date(field(a, "dueAt", "due_at"))}</Badge>
            </div>
            <h2 className="mt-6 text-lg font-bold text-slate-900">
              Instructions
            </h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
              {text(
                field(a, "instructions", "description"),
                "Your instructor has not added instructions yet.",
              )}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to={"/submit-work?assignmentId=" + encodeURIComponent(id)}
                className="rounded-lg bg-[#2b5078] px-4 py-2.5 text-sm font-semibold text-white"
              >
                Start or update work
              </Link>
              {Object.keys(draft).length > 0 && (
                <Link
                  to={"/edit-draft?assignmentId=" + encodeURIComponent(id)}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700"
                >
                  Edit saved draft
                </Link>
              )}
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Text submissions are supported. File uploads are not available
              yet.
            </p>
          </Card>
          <Card>
            <h2 className="text-lg font-bold text-slate-900">
              Submission status
            </h2>
            {Object.keys(submission).length ? (
              <div className="mt-4 space-y-3 text-sm">
                <p>
                  <span className="text-slate-500">Status</span>
                  <strong className="ml-2 text-slate-900">
                    {text(field(submission, "status"), "Submitted")}
                  </strong>
                </p>
                <p>
                  <span className="text-slate-500">Submitted</span>
                  <strong className="ml-2 text-slate-900">
                    {date(field(submission, "submittedAt", "submitted_at"))}
                  </strong>
                </p>
                <Link
                  to={"/receipt?assignmentId=" + encodeURIComponent(id)}
                  className="inline-block pt-2 text-sm font-semibold text-[#2b5078]"
                >
                  View receipt →
                </Link>
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">
                No submission has been recorded for this assignment.
              </p>
            )}
          </Card>
        </div>
      )}
    </Page>
  );
}
