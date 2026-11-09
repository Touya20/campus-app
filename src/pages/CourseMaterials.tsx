import { Link, useParams } from 'react-router';
import { api } from '../components/features/api';
import { Page } from '../common/Page';
import { ResourceState } from '../common/ResourceState';
import { useResource } from '../common/useResource';
import { Card, EmptyState } from '../ui/Ui';
import { field, rows, text } from '../lib/api';

export default function CourseMaterials() {
  const { id = '' } = useParams();
  const state = useResource(
    () => Promise.all([api.course(id), api.modules(id), api.materials(id)]),
    [id],
  );

  const course = state.data?.[0] ?? {};
  const modules = rows(state.data?.[1]);
  const materials = rows(state.data?.[2]);
  const courseName = text(field(course, 'courseName', 'course_name', 'name'), 'Modules and learning resources.');

  return (
    <Page
      title="Course materials"
      description={courseName}
      actions={
        <Link to={`/courses/${id}`} className="text-sm font-semibold text-[#2b5078]">
          ← Course overview
        </Link>
      }
    >
      <ResourceState loading={state.loading} error={state.error} />
      {!state.loading && !state.error && (
        modules.length ? (
          modules.map((module, index) => {
            const moduleId = text(field(module, 'id'), String(index));
            const description = text(field(module, 'description'));
            const relatedMaterials = materials.filter(
              (material) => text(field(material, 'moduleId', 'module_id')) === moduleId,
            );

            return (
              <Card key={moduleId} className="mb-4">
                <h2 className="text-lg font-bold text-slate-900">
                  {text(field(module, 'title', 'name'), `Module ${index + 1}`)}
                </h2>
                {description && <p className="mt-2 text-sm text-slate-600">{description}</p>}
                <div className="mt-4 divide-y divide-slate-100">
                  {relatedMaterials.length ? (
                    relatedMaterials.map((material, materialIndex) => (
                      <Material
                        key={text(field(material, 'id'), String(materialIndex))}
                        item={material}
                      />
                    ))
                  ) : (
                    <p className="py-4 text-sm text-slate-500">
                      No materials added to this module yet.
                    </p>
                  )}
                </div>
              </Card>
            );
          })
        ) : (
          <Card>
            <h2 className="text-lg font-bold text-slate-900">Learning materials</h2>
            {materials.length ? (
              materials.map((material, index) => (
                <Material key={text(field(material, 'id'), String(index))} item={material} />
              ))
            ) : (
              <EmptyState title="No materials yet" detail="Course resources will appear here." />
            )}
          </Card>
        )
      )}
    </Page>
  );
}

function Material({ item }: { item: Record<string, unknown> }) {
  const href = text(field(item, 'fileUrl', 'file_url', 'url'));

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-3">
      <div>
        <p className="font-semibold text-slate-800">
          {text(field(item, 'title', 'name'), 'Learning resource')}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {text(field(item, 'type', 'materialType', 'module_title'), 'Course material')}
        </p>
      </div>
      {href.startsWith('https://') ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-semibold text-[#2b5078] hover:underline"
        >
          Open material ↗
        </a>
      ) : (
        <span className="text-xs text-slate-400">Link unavailable</span>
      )}
    </div>
  );
}
