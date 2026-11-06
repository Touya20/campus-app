import { Link, useParams } from "react-router";
import { api } from "../components/features/api";
import { useResource } from "../common/useResource";
import { Page } from "../common/Page";
import { ResourceState } from "../common/ResourceState";
import { Badge, Card, RecordRow, EmptyState } from "../ui/Ui";
import { field, rows, text } from "../lib/api";
export default function CourseOverview() {
  const { id = "" } = useParams();
  const state = useResource(
    () => Promise.all([api.course(id), api.modules(id), api.assignments()]),
    [id],
  );
  const course = state.data?.[0] || {};
  const modules = rows(state.data?.[1]);
  const assignments = rows(state.data?.[2]).filter(
    (x) => text(field(x, "courseId", "course_id")) === id,
  );
  const title = text(
    field(course, "courseName", "course_name", "name", "title"),
    "Course overview",
  );
  return (
    <Page
      title={title}
      description={text(
        field(course, "description"),
        "Your course content, learning materials, and upcoming work.",
      )}
    >
      <ResourceState loading={state.loading} error={state.error} />
      {!state.loading && !state.error && (
        <>
          <div className="mb-5 flex flex-wrap gap-2">
            <Badge>
              {text(field(course, "courseCode", "course_code"), "Enrolled")}
            </Badge>
            <Badge>
              {text(
                field(course, "section", "semesterName", "semester_name"),
                "Current semester",
              )}
            </Badge>
          </div>
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="space-y-5">
              <Card>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Learning modules
                    </p>
                    <h2 className="mt-2 text-xl font-bold text-slate-900">
                      Continue learning
                    </h2>
                  </div>
                  <Link
                    to={"/courses/" + id + "/materials"}
                    className="text-sm font-semibold text-[#2b5078]"
                  >
                    All materials →
                  </Link>
                </div>
                {modules.length ? (
                  modules.map((item, i) => (
                    <RecordRow
                      key={text(field(item, "id"), String(i))}
                      to={"/courses/" + id + "/materials"}
                      title={text(
                        field(item, "title", "name"),
                        "Module " + (i + 1),
                      )}
                      description={text(
                        field(item, "description"),
                        "Open course materials",
                      )}
                    />
                  ))
                ) : (
                  <EmptyState
                    title="Modules are being prepared"
                    detail="Course modules will appear here."
                  />
                )}
              </Card>
              <Card className="!p-0">
                <div className="p-5">
                  <h2 className="text-lg font-bold text-slate-900">
                    Upcoming assignments
                  </h2>
                </div>
                {assignments.slice(0, 4).map((a, i) => (
                  <RecordRow
                    key={text(field(a, "id"), String(i))}
                    to={"/assignments/" + text(field(a, "id", "assignmentId"))}
                    title={text(field(a, "title"), "Assignment")}
                    description={text(field(a, "description"), "View details")}
                    meta={text(field(a, "dueAt", "due_at"), "")}
                  />
                ))}
              </Card>
            </div>
            <Card>
              <h2 className="text-lg font-bold text-slate-900">
                Course details
              </h2>
              <dl className="mt-4 space-y-4 text-sm">
                <Fact
                  label="Course code"
                  value={field(course, "courseCode", "course_code")}
                />
                <Fact
                  label="Instructor"
                  value={field(course, "instructorName", "instructor_name")}
                />
                <Fact label="Section" value={field(course, "section")} />
              </dl>
            </Card>
          </div>
        </>
      )}
    </Page>
  );
}
function Fact({ label, value }: { label: string; value: unknown }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 font-medium text-slate-800">
        {text(value, "Not provided")}
      </dd>
    </div>
  );
}
