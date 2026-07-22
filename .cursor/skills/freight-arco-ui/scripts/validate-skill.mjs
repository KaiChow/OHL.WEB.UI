import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SKILL_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const REFERENCES = join(SKILL_ROOT, 'references');

export function validateFreightUiSkill() {
  const errors = [];
  const read = (relativePath) => {
    const path = join(SKILL_ROOT, relativePath);
    if (!existsSync(path)) {
      errors.push(`${relativePath}: missing required skill file`);
      return '';
    }
    return readFileSync(path, 'utf8');
  };

  const skill = read('SKILL.md');
  const pageSpec = read('references/page-spec-contract.md');
  const generation = read('references/ai-generation-contract.md');
  const filter = read('references/filter-layout.md');
  const overlay = read('references/overlay-dimensions.md');
  const arcoFirst = read('references/arco-first.md');
  const table = read('references/table.md');
  const responsive = read('references/responsive.md');
  const list = read('references/list-page.md');
  const detail = read('references/detail-form.md');
  const formRules = read('references/form-rules.md');
  const agent = read('agents/openai.yaml');

  const requirements = [
    [skill, '## Mandatory PESDP Execution Gate', 'SKILL.md must make PESDP execution a blocking gate'],
    [skill, 'page-spec-contract.md', 'SKILL.md must route page generation through the page spec'],
    [pageSpec, '## PESDP Traceability Gate', 'page spec must define PESDP traceability'],
    [pageSpec, 'Skipping step 2 is a blocking process violation', 'page spec must block template-first generation'],
    [generation, '## PESDP Trace Gate', 'AI generation contract must reconcile PESDP evidence'],
    [filter, '| `9-16` | **S2**', 'filter authority must retain the S2 decision row'],
    [filter, '## Advanced Filter Overlay Contract', 'filter authority must define the advanced-filter overlay contract'],
    [filter, 'The component width prop is authoritative', 'filter authority must keep Drawer width ownership on the component prop'],
    [filter, 'one vertical scroll owner', 'filter authority must define one vertical scroll owner'],
    [filter, 'data-ui-surface="advanced-filter"', 'filter authority must provide non-visual audit evidence'],
    [filter, ':xs="24" :sm="12"', 'filter authority must retain the one-column/two-column Arco Grid breakpoint example'],
    [filter, '| `50+` | **workspace**', 'filter authority must route 50+ conditions to a query workspace'],
    [overlay, 'The component `width` prop is authoritative', 'overlay authority must keep width ownership on the component prop'],
    [overlay, '| D2 Filter wide |', 'overlay authority must retain the D2 advanced-filter tier'],
    [table, 'do **not** set `row-config.height` on `detail-mini-vxe`', 'table authority must retain the pinned VXE detail rule'],
    [responsive, 'supported minimum viewport width of **1024px**', 'responsive authority must retain the 1024 lower bound'],
    [list, 'data-workbench-scope', 'list authority must distinguish work scope from status queues'],
    [detail, '## Object Workspace Mode Contract', 'detail authority must define display/edit workspace behavior'],
    [formRules, '### 7.1 对象详情工作区（展示优先）', 'form rules must route object details to display-first workspace behavior'],
    [agent, 'typed pageSpec.ts', 'agent default prompt must activate the page-spec gate'],
  ];
  for (const [source, needle, message] of requirements) {
    if (!source.includes(needle)) errors.push(message);
  }

  const forbidden = [
    [generation, 'row-config.height = 38', 'AI generation contract duplicates the forbidden detail row-height rule'],
    [generation, '9-16 core row + drawer', 'AI generation contract duplicates an obsolete query threshold'],
    [generation, '17-32 grouped drawer', 'AI generation contract duplicates query thresholds instead of routing to authority'],
    [generation, 'supported 1280px baseline', 'AI generation contract restores the obsolete responsive baseline'],
    [list, 'Widths below 1280px are not a supported project contract', 'list reference conflicts with the 1024 lower bound'],
    [formRules, '默认 **常驻编辑态**，禁止「先点编辑再改」', 'form rules restore the obsolete always-editable object detail contract'],
    [pageSpec, 'decisions: []', 'page-spec example contains an empty PESDP decision trace'],
    [pageSpec, 'evidence: []', 'page-spec example contains an empty PESDP evidence trace'],
    [pageSpec, 'surfaces: []', 'page-spec example contains no surface ownership'],
    [pageSpec, 'actions: []', 'page-spec example contains no action contract binding'],
    [filter, 'Body structure is fixed', 'filter authority restores the obsolete copied drawer DOM'],
    [filter, 'query-filter-drawer__shell', 'filter authority restores the obsolete nested drawer shell'],
    [overlay, 'documentation only', 'overlay authority restores false width ownership wording'],
    [overlay, 'CSS wins', 'overlay authority restores false CSS width ownership'],
    [overlay, '!important overrides inline', 'overlay authority restores a hidden width override'],
    [detail, 'global.css` wins', 'detail authority restores a hidden width override'],
    [arcoFirst, 'shipment/export-orders', 'framework authority contains a route-specific page instruction'],
  ];
  for (const [source, needle, message] of forbidden) {
    if (source.includes(needle)) errors.push(message);
  }
  if (/\| D2 Filter wide \|[^\n]*50\+/.test(overlay)) {
    errors.push('overlay authority routes 50+ query fields back into a wide drawer');
  }

  for (const file of readdirSync(REFERENCES).filter((name) => name.endsWith('.md'))) {
    const content = readFileSync(join(REFERENCES, file), 'utf8');
    const headings = content
      .split(/\r?\n/)
      .filter((line) => line.startsWith('## '));
    const seen = new Set();
    for (const heading of headings) {
      if (seen.has(heading)) errors.push(`${file}: duplicate authority heading ${heading}`);
      seen.add(heading);
    }
    if (/shipment\/export-orders|orderWorkbench/.test(content)) {
      errors.push(`${file}: route-specific implementation leaked into the reusable skill`);
    }
  }

  return errors;
}

const invokedDirectly = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase() === process.argv[1].toLowerCase();

if (invokedDirectly) {
  const errors = validateFreightUiSkill();
  if (errors.length) {
    console.error('\nFreight UI skill validation failed:\n');
    for (const error of errors) console.error(`- ${error}`);
    console.error('');
    process.exit(1);
  }
  console.log('\nFreight UI skill validation passed.\n');
}
