import { Link } from "react-router";
import { api } from "../components/features/api";
import { useResource } from "../common/useResource";
import { Page } from "../common/Page";
import { ResourceState } from "../common/ResourceState";
import { Card, EmptyState, RecordRow, Badge } from "../ui/Ui";
import { field, rows, text, date } from "../lib/api";
type Item = {
  id: string;
  title: string;
  description: string;
  meta: string;
  to: string;
};
export default function Submissions() {
  const state = useResource(async () => {
    const assignments = rows(await api.assignments());
    const results = await Promise.all(
      assignments.map(async (a) => {
        const id = text(field(a, "id", "assignmentId", "assignment_id"));
        if (!id) return null;
        const [submission, draft] = await Promise.allSettled([
          api.mySubmission(id),
          api.draft(id),
        ]);
        return {
          a,
          id,
          submission:
            submission.status === "fulfilled" ? submission.value : null,
          draft: draft.status === "fulfilled" ? draft.value : null,
        };
      }),
    );
    return results.filter(Boolean) as {
      a: Record<string, unknown>;
      id: string;
      submission: unknown;
      draft: unknown;
    }[];
  }, []);
  const items: Item[] = (state.data || []).flatMap(
    ({ a, id, submission, draft }) => {
      const result: Item[] = [];
      if (submission) {
        result.push({
          id,
          title: text(field(a, "title", "assignmentTitle"), "Assignment"),
          description:
            "Submitted · " + text(field(submission, "status"), "received"),
          meta: date(field(submission, "submittedAt", "submitted_at")),
          to: "/assignments/" + id,
        });
      }
      if (draft) {
        result.push({
          id,
          title: text(field(a, "title", "assignmentTitle"), "Assignment"),
          description: "Saved draft · continue editing",
          meta: "Draft",
          to: "/edit-draft?assignmentId=" + encodeURIComponent(id),
        });
      }
      return result;
    },
  );
  return (
    <Page
      title="My submissions"
      description="Review your submitted work and saved drafts."
      actions={
        <Link
          to="/assignments"
          className="text-sm font-semibold text-[#2b5078]"
        >
          Browse assignments →
        </Link>
      }
    >
      <ResourceState loading={state.loading} error={state.error} />
      {!state.loading && !state.error && (
        <Card className="!p-0">
          <div className="flex items-center justify-between p-5">
            <h2 className="text-lg font-bold text-slate-900">
              Submission activity
            </h2>
            <Badge>{items.length} records</Badge>
          </div>
          {items.length ? (
            items.map((item, i) => (
              <RecordRow
                key={item.id + "-" + i}
                to={item.to}
                title={item.title}
                description={item.description}
                meta={item.meta}
              />
            ))
          ) : (
            <EmptyState
              title="No submissions yet"
              detail="Your saved drafts and submitted assignments will appear here."
            />
          )}
        </Card>
      )}
    </Page>
  );
}
