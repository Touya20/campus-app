import { Link } from "react-router";
import { api } from "../components/features/api";
import { useResource } from "../common/useResource";
import { Page } from "../common/Page";
import { ResourceState } from "../common/ResourceState";
import { Badge, Card, EmptyState, RecordRow } from "../ui/Ui";
import { field, rows, text, date } from "../lib/api";
export default function Dashboard() {
  const state = useResource(
    () =>
      Promise.all([
        api.dashboard(),
        api.courses(),
        api.upcoming(),
        api.recentAnnouncements(),
      ]),
    [],
  );
  const summary = state.data?.[0] || {};
  const courses = rows(state.data?.[1]);
  const upcoming = rows(state.data?.[2]);
  const announcements = rows(state.data?.[3]);
  return (
    <Page
      title="Welcome back."
      description="Your courses, deadlines, and campus updates in one place."
      actions={
        <Link
          to="/schedule"
          className="inline-flex rounded-lg bg-[#2b5078] px-4 py-2.5 text-sm font-semibold text-white"
        >
          View class schedule →
        </Link>
      }
    >
      <ResourceState loading={state.loading} error={state.error} variant="dashboard" />
      {!state.loading && !state.error && (
        <>
          <section className="rounded-xl bg-[#2b5078] p-6 text-white sm:p-8">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-100">
              A new week. A clear next step.
            </p>
            <h2 className="mt-3 text-2xl font-bold">
              Keep your semester moving.
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-blue-100">
              Review upcoming work and stay connected to your classes.
            </p>
            <Link
              to="/assignments"
              className="mt-5 inline-flex rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-[#2b5078]"
            >
              Continue to assignments →
            </Link>
          </section>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <Metric
              label="Enrolled courses"
              value={
                field(summary, "courseCount", "enrolledCourses") ??
                courses.length
              }
            />
            <Metric
              label="Active assignments"
              value={
                field(summary, "pendingAssignments", "assignmentCount") ??
                upcoming.length
              }
            />
            <Metric label="Upcoming deadlines" value={upcoming.length} />
          </div>
          <div className="mt-6 grid gap-5 xl:grid-cols-2">
            <Card className="!p-0">
              <div className="flex items-center justify-between p-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Your courses
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Keep your learning moving.
                  </p>
                </div>
                <Link
                  to="/courses"
                  className="text-sm font-semibold text-[#2b5078]"
                >
                  All courses →
                </Link>
              </div>
              {courses.length ? (
                courses
                  .slice(0, 5)
                  .map((item, i) => (
                    <RecordRow
                      key={text(
                        field(item, "id", "courseId", "course_id"),
                        String(i),
                      )}
                      to={
                        "/courses/" +
                        text(field(item, "id", "courseId", "course_id"))
                      }
                      title={text(
                        field(
                          item,
                          "courseName",
                          "course_name",
                          "name",
                          "title",
                        ),
                        "Course",
                      )}
                      description={text(
                        field(item, "courseCode", "course_code", "section"),
                        "Open course overview",
                      )}
                    />
                  ))
              ) : (
                <EmptyState
                  title="No courses yet"
                  detail="Your enrolled courses will appear here."
                />
              )}
            </Card>
            <div className="space-y-5">
              <Card className="!p-0">
                <div className="p-5">
                  <h2 className="text-lg font-bold text-slate-900">
                    Upcoming work
                  </h2>
                </div>
                {upcoming.length ? (
                  upcoming
                    .slice(0, 4)
                    .map((item, i) => (
                      <RecordRow
                        key={text(field(item, "id", "assignmentId"), String(i))}
                        to={
                          "/assignments/" +
                          text(field(item, "id", "assignmentId"))
                        }
                        title={text(
                          field(item, "title", "assignmentTitle"),
                          "Assignment",
                        )}
                        description={text(
                          field(item, "courseName", "course_name", "courseCode", "course_code"),
                          "Assignment deadline",
                        )}
                        meta={date(field(item, "dueAt", "due_at"))}
                      />
                    ))
                ) : (
                  <EmptyState
                    title="All caught up"
                    detail="Upcoming deadlines will show here."
                  />
                )}
              </Card>
              <Card className="!p-0">
                <div className="flex items-center justify-between p-5">
                  <h2 className="text-lg font-bold text-slate-900">
                    Recent announcements
                  </h2>
                  <Link
                    to="/announcements"
                    className="text-sm font-semibold text-[#2b5078]"
                  >
                    View all →
                  </Link>
                </div>
                {announcements.length ? (
                  announcements
                    .slice(0, 3)
                    .map((item, i) => (
                      <RecordRow
                        key={text(
                          field(item, "id", "announcementId"),
                          String(i),
                        )}
                        to={
                          "/announcements/" +
                          text(field(item, "id", "announcementId"))
                        }
                        title={text(field(item, "title"), "Campus update")}
                        description={text(
                          field(item, "courseName", "course_name", "courseCode", "course_code"),
                          "Campus announcement",
                        )}
                        meta={
                          field(item, "isRead", "is_read") ? (
                            <Badge>Read</Badge>
                          ) : (
                            <Badge>New</Badge>
                          )
                        }
                      />
                    ))
                ) : (
                  <EmptyState
                    title="No announcements"
                    detail="Campus news will appear here."
                  />
                )}
              </Card>
            </div>
          </div>
        </>
      )}
    </Page>
  );
}
function Metric({ label, value }: { label: string; value: unknown }) {
  return (
    <Card>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-3 text-3xl font-bold text-slate-900">
        {String(value ?? "—")}
      </p>
    </Card>
  );
}
