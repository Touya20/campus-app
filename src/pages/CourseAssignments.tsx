import { useParams, Link } from "react-router";
import { api } from "../components/features/api";
import { useResource } from "../common/useResource";
import { Page } from "../common/Page";
import { ResourceState } from "../common/ResourceState";
import { Card, EmptyState, RecordRow } from "../ui/Ui";
import { field, rows, text, date } from "../lib/api";
export default function CourseAssignments() {
  const { id = "" } = useParams();
  const state = useResource(
    () => Promise.all([api.course(id), api.assignments()]),
    [id],
  );
  const course = state.data?.[0] || {};
  const items = rows(state.data?.[1]).filter(
    (x) => text(field(x, "courseId", "course_id")) === id,
  );
  return (
    <Page
      title={text(
        field(course, "courseName", "course_name", "name"),
        "Course assignments",
      )}
      description="Assignments and due dates for this course."
      actions={
        <Link
          to={"/courses/" + id}
          className="text-sm font-semibold text-[#2b5078]"
        >
          ← Course overview
        </Link>
      }
    >
      <ResourceState loading={state.loading} error={state.error} />
      {!state.loading && !state.error && (
        <Card className="!p-0">
          {items.length ? (
            items.map((item, i) => (
              <RecordRow
                key={text(field(item, "id"), String(i))}
                to={"/assignments/" + text(field(item, "id", "assignmentId"))}
                title={text(
                  field(item, "title", "assignmentTitle"),
                  "Assignment",
                )}
                description={text(
                  field(item, "status", "submissionStatus"),
                  "Review instructions and status",
                )}
                meta={date(field(item, "dueAt", "due_at"))}
              />
            ))
          ) : (
            <EmptyState
              title="No assignments yet"
              detail="Assignments for this course will appear here."
            />
          )}
        </Card>
      )}
    </Page>
  );
}
