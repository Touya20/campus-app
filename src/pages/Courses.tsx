import { api } from "../components/features/api";
import { useResource } from "../common/useResource";
import { Page } from "../common/Page";
import { ResourceState } from "../common/ResourceState";
import { Card, EmptyState, RecordRow } from "../ui/Ui";
import { field, rows, text } from "../lib/api";
export default function Courses() {
  const state = useResource(() => api.courses(), []);
  const items = rows(state.data);
  return (
    <Page
      title="My courses"
      description="Browse courses you are enrolled in this semester."
    >
      <ResourceState loading={state.loading} error={state.error} />
      {!state.loading && !state.error && (
        <Card className="!p-0">
          {items.length ? (
            items.map((course, i) => {
              const id = text(
                field(course, "id", "courseId", "course_id"),
                String(i),
              );
              return (
                <RecordRow
                  key={id}
                  to={"/courses/" + id}
                  title={text(
                    field(course, "courseName", "course_name", "name", "title"),
                    "Course",
                  )}
                  description={text(
                    field(course, "courseCode", "course_code"),
                    "Course overview",
                  )}
                  meta={<span>{text(field(course, "section"), "")}</span>}
                />
              );
            })
          ) : (
            <EmptyState
              title="No courses found"
              detail="Your current enrollments will appear here once they are available."
            />
          )}
        </Card>
      )}
    </Page>
  );
}
