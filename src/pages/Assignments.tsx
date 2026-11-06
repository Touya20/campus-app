import { Link } from "react-router";
import { api } from "../components/features/api";
import { useResource } from "../common/useResource";
import { Page } from "../common/Page";
import { ResourceState } from "../common/ResourceState";
import { Card, EmptyState, RecordRow, Badge } from "../ui/Ui";
import { field, rows, text, date } from "../lib/api";
export default function Assignments() {
  const state = useResource(
    () => Promise.all([api.assignments(), api.upcomingAssignments()]),
    [],
  );
  const items = rows(state.data?.[0]);
  const upcoming = rows(state.data?.[1]);
  return (
    <Page
      title="Assignments"
      description="Stay on top of coursework and upcoming deadlines."
      actions={
        <Link
          to="/submissions"
          className="text-sm font-semibold text-[#2b5078]"
        >
          My submissions →
        </Link>
      }
    >
      <ResourceState loading={state.loading} error={state.error} />
      {!state.loading && !state.error && (
        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          <Card className="!p-0">
            <div className="p-5">
              <h2 className="text-lg font-bold text-slate-900">
                All assignments
              </h2>
            </div>
            {items.length ? (
              items.map((item, i) => (
                <RecordRow
                  key={text(field(item, "id", "assignmentId"), String(i))}
                  to={"/assignments/" + text(field(item, "id", "assignmentId"))}
                  title={text(
                    field(item, "title", "assignmentTitle"),
                    "Assignment",
                  )}
                  description={text(
                    field(
                      item,
                      "courseName",
                      "course_name",
                      "status",
                      "submissionStatus",
                    ),
                    "Open assignment details",
                  )}
                  meta={date(field(item, "dueAt", "due_at"))}
                />
              ))
            ) : (
              <EmptyState
                title="No assignments"
                detail="Your assignments will appear here."
              />
            )}
          </Card>
          <Card>
            <h2 className="text-lg font-bold text-slate-900">Coming up</h2>
            <div className="mt-4 space-y-3">
              {upcoming.length ? (
                upcoming.slice(0, 5).map((item, i) => (
                  <Link
                    key={text(field(item, "id"), String(i))}
                    to={
                      "/assignments/" + text(field(item, "id", "assignmentId"))
                    }
                    className="block rounded-lg bg-blue-50 p-3 hover:bg-blue-100"
                  >
                    <Badge>Due {date(field(item, "dueAt", "due_at"))}</Badge>
                    <p className="mt-2 text-sm font-semibold text-slate-800">
                      {text(field(item, "title"), "Assignment")}
                    </p>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-slate-500">No upcoming deadlines.</p>
              )}
            </div>
          </Card>
        </div>
      )}
    </Page>
  );
}
