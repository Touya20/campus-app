import { useSearchParams, Link } from "react-router";
import { api } from "../components/features/api";
import { useResource } from "../common/useResource";
import { Page } from "../common/Page";
import { ResourceState } from "../common/ResourceState";
import { Card } from "../ui/Ui";
import { field, text, date } from "../lib/api";
export default function Receipt() {
  const [params] = useSearchParams();
  const id = params.get("assignmentId") || "";
  const state = useResource(
    () =>
      id
        ? Promise.all([api.assignment(id), api.mySubmission(id)])
        : Promise.reject(new Error("No assignment was selected.")),
    [id],
  );
  const assignment = state.data?.[0] || {};
  const submission = state.data?.[1] || {};
  return (
    <Page
      title="Submission receipt"
      description="Confirmation for your assignment submission."
    >
      <ResourceState loading={state.loading} error={state.error} />
      {!state.loading && !state.error && (
        <Card className="mx-auto max-w-xl py-12 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-50 text-2xl text-emerald-700">
            ✓
          </div>
          <h2 className="mt-5 text-2xl font-bold text-slate-900">
            Submission received
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {text(field(assignment, "title"), "Your assignment")} was submitted
            successfully.
          </p>
          <div className="mt-6 rounded-lg bg-slate-50 p-4 text-sm">
            <p>
              <span className="text-slate-500">Status:</span>{" "}
              <strong>{text(field(submission, "status"), "Submitted")}</strong>
            </p>
            <p className="mt-2">
              <span className="text-slate-500">Submitted:</span>{" "}
              <strong>
                {date(field(submission, "submittedAt", "submitted_at"))}
              </strong>
            </p>
          </div>
          <Link
            className="mt-6 inline-flex rounded-lg bg-[#2b5078] px-4 py-2.5 text-sm font-semibold text-white"
            to="/assignments"
          >
            Back to assignments
          </Link>
        </Card>
      )}
    </Page>
  );
}
