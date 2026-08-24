import { FEATURED_PROJECTS, PROJECTS } from './data';
import { dictionaries } from '@/app/i18n/dictionaries';

type Copy = Record<
  string,
  { home: string; full: string; outcome: string; stack: string }
>;

// Project copy is keyed by id and lives outside `data.ts`, so a project can be
// added — or a locale extended — while leaving a field silently empty. That is
// exactly what happened to `curio.outcome`, which rendered nothing on /projects
// for as long as it stayed ''. These tests make that a failing build instead.
describe('project copy', () => {
  const locales = ['es', 'en'] as const;
  const fields = ['home', 'full', 'outcome', 'stack'] as const;

  locales.forEach((locale) => {
    describe(locale, () => {
      const copy = dictionaries[locale].projectCopy as Copy;

      PROJECTS.forEach((project) => {
        fields.forEach((field) => {
          it(`has non-empty ${field} copy for "${project.id}"`, () => {
            expect(copy[project.id]?.[field]?.trim()).toBeTruthy();
          });
        });
      });
    });
  });

  it('defines copy for every project and no orphan entries', () => {
    const ids = PROJECTS.map((p) => p.id).sort();
    locales.forEach((locale) => {
      const keys = Object.keys(dictionaries[locale].projectCopy).sort();
      expect(keys).toEqual(ids);
    });
  });
});

// The home is where someone arriving from the CV lands first, so every project
// it features has to be openable. Nexfit led the list for a while with
// `linkLive: '#'`, which sent that visitor straight to a login wall. Featuring
// a project with no public demo is now a failing test, not a judgement call.
describe('featured projects', () => {
  it('only features projects with a real public link', () => {
    for (const project of FEATURED_PROJECTS) {
      expect(project.linkLive).not.toBe('#');
      expect(project.linkLive).toMatch(/^https:\/\//);
    }
  });
});
