import { useParams, Link } from "react-router";
import { api } from "../components/features/api";
import { useResource } from "../common/useResource";
import { Page } from "../common/Page";
import { ResourceState } from "../common/ResourceState";
import { Badge, Card, EmptyState } from "../ui/Ui";
import { field, rows, text, date } from "../lib/api";
export default function Grades() {
  const { id = "" } = useParams();
  const state = useResource(
    () =>
      Promise.all([
        id ? api.courseGrades(id) : api.grades(),
        api.gradeSummary(),
      ]),
    [id],
  );
  const grades = rows(state.data?.[0]);
  const summaries = rows(state.data?.[1]);
  return (
    <Page
      title={id ? "Course grades" : "Grades"}
      description="Only grades released by your instructors are shown."
      actions={
        id ? (
          <Link to="/grades" className="text-sm font-semibold text-[#2b5078]">
            ← All grades
          </Link>
        ) : undefined
      }
    >
      <ResourceState loading={state.loading} error={state.error} />
      {!state.loading && !state.error && (
        <>
          <div className="mb-5 grid gap-4 md:grid-cols-2">
            {summaries.map((item, i) => {
              const courseId = text(field(item, "courseId", "course_id"));
              return (
                <Link
                  to={"/grades/" + courseId}
                  key={courseId || i}
                  className="block rounded-xl transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <Card>
                    <p className="text-sm font-semibold text-slate-700">
                      {text(
                        field(item, "courseName", "course_name", "courseCode"),
                        "Course",
                      )}
                    </p>
                    <div className="mt-3 flex items-baseline gap-2">
                      <strong className="text-2xl text-slate-900">
                        {field(item, "percentage") === null
                          ? "—"
                          : text(field(item, "percentage")) + "%"}
                      </strong>
                      <span className="text-xs text-slate-500">
                        {text(
                          field(item, "earnedPoints", "earned_points"),
                          "0",
                        )}{" "}
                        /{" "}
                        {text(
                          field(item, "possiblePoints", "possible_points"),
                          "0",
                        )}{" "}
                        points
                      </span>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
          <Card className="!p-0">
            <div className="p-5">
              <h2 className="text-lg font-bold text-slate-900">
                Released results
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Point totals are not a GPA.
              </p>
            </div>
            {grades.length ? (
              grades.map((grade, i) => (
                <div
                  key={text(field(grade, "id", "gradeId"), String(i))}
                  className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4"
                >
                  <div>
                    <p className="font-semibold text-slate-800">
                      {text(
                        field(
                          grade,
                          "assignmentTitle",
                          "assignment_title",
                          "title",
                        ),
                        "Assignment grade",
                      )}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {text(
                        field(grade, "courseName", "course_name"),
                        "Course",
                      )}{" "}
                      · {date(field(grade, "gradedAt", "graded_at"))}
                    </p>
                  </div>
                  <Badge>
                    {text(field(grade, "score"), "—")} /{" "}
                    {text(field(grade, "maxScore", "max_score"), "—")}
                  </Badge>
                </div>
              ))
            ) : (
              <EmptyState
                title="No released grades"
                detail="Released grades will appear here."
              />
            )}
          </Card>
        </>
      )}
    </Page>
  );
}
