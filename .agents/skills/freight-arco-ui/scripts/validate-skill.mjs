import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SKILL_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const REFERENCES = join(SKILL_ROOT, 'references');
const MAX_REFERENCE_FILES = 30;
const MAX_REFERENCE_LINES = 6100;
const MAX_SINGLE_REFERENCE_LINES = 700;
const KEY_DOCUMENT_BUDGETS = new Map([
  ['existing-project-modernization.md', 150],
  ['feature-delivery-contract.md', 110],
  ['page-spec-contract.md', 140],
  ['product-grade-evaluation.md', 80],
]);

const lineCount = (source) => source.split(/\r?\n/).length;

export function validateFreightUiSkill() {
  const errors = [];
  const skillPath = join(SKILL_ROOT, 'SKILL.md');
  const agentPath = join(SKILL_ROOT, 'agents', 'openai.yaml');

  if (!existsSync(skillPath)) return ['SKILL.md: missing required skill entry'];
  if (!existsSync(agentPath)) errors.push('agents/openai.yaml: missing Codex skill metadata');
  if (!existsSync(REFERENCES)) return [...errors, 'references/: missing reference directory'];

  const skill = readFileSync(skillPath, 'utf8');
  const agent = existsSync(agentPath) ? readFileSync(agentPath, 'utf8') : '';
  const referenceNames = readdirSync(REFERENCES).filter((name) => name.endsWith('.md')).sort();
  const references = new Map(
    referenceNames.map((name) => [name, readFileSync(join(REFERENCES, name), 'utf8')]),
  );

  if (!/^---\s*\r?\nname:\s*freight-arco-ui\s*\r?\ndescription:\s*.+\r?\n---/s.test(skill)) {
    errors.push('SKILL.md: frontmatter must contain only a valid name and description entry');
  }
  if (!/default_prompt:\s*.+/m.test(agent)) {
    errors.push('agents/openai.yaml: missing default_prompt');
  }
  if (lineCount(skill) > 140) {
    errors.push(`SKILL.md: ${lineCount(skill)} lines exceeds the 140-line entry budget`);
  }

  const requiredFragments = [
    [skill, '## Commercial Definition Of Done', 'SKILL.md: missing commercial definition of done'],
    [skill, 'No evidence means no sellable claim.', 'SKILL.md: missing no-self-certification rule'],
    [references.get('existing-project-modernization.md') || '', '## Rendered Layout Gate', 'existing-project-modernization.md: missing rendered layout authority'],
    [references.get('feature-delivery-contract.md') || '', '## Smallest Complete Contract', 'feature-delivery-contract.md: missing smallest complete contract'],
    [references.get('page-spec-contract.md') || '', 'It is not a design essay', 'page-spec-contract.md: missing decision-record boundary'],
    [references.get('product-grade-evaluation.md') || '', '## Six Blocking Gates', 'product-grade-evaluation.md: missing commercial release gates'],
    [references.get('product-grade-evaluation.md') || '', '200% zoom', 'product-grade-evaluation.md: missing accessible rendered gate'],
    [references.get('component-size.md') || '', '24×24px minimum target', 'component-size.md: missing row-action target authority'],
    [references.get('typography.md') || '', '| | Status pill | F5 Aux | 11px', 'typography.md: missing readable status-pill authority'],
  ];
  for (const [source, fragment, message] of requiredFragments) {
    if (!source.includes(fragment)) errors.push(message);
  }

  const totalReferenceLines = [...references.values()].reduce((total, source) => total + lineCount(source), 0);
  if (referenceNames.length > MAX_REFERENCE_FILES) {
    errors.push(`references/: ${referenceNames.length} files exceeds the ${MAX_REFERENCE_FILES}-file growth freeze`);
  }
  if (totalReferenceLines > MAX_REFERENCE_LINES) {
    errors.push(`references/: ${totalReferenceLines} lines exceeds the ${MAX_REFERENCE_LINES}-line growth freeze`);
  }

  const documents = new Map([['SKILL.md', skill], ...references]);
  for (const [name, source] of references) {
    if (lineCount(source) > MAX_SINGLE_REFERENCE_LINES) {
      errors.push(`${name}: ${lineCount(source)} lines exceeds the ${MAX_SINGLE_REFERENCE_LINES}-line reference budget`);
    }
    const keyBudget = KEY_DOCUMENT_BUDGETS.get(name);
    if (keyBudget && lineCount(source) > keyBudget) {
      errors.push(`${name}: ${lineCount(source)} lines exceeds its ${keyBudget}-line anti-bloat budget`);
    }

    const headings = source.split(/\r?\n/).filter((line) => line.startsWith('## '));
    const seen = new Set();
    for (const heading of headings) {
      if (seen.has(heading)) errors.push(`${name}: duplicate authority heading ${heading}`);
      seen.add(heading);
    }

    const linkedElsewhere = [...documents].some(([owner, content]) => owner !== name && content.includes(name));
    if (!linkedElsewhere) errors.push(`${name}: orphan reference has no routing link`);
    if (/shipment\/export-orders|orderWorkbench/.test(source)) {
      errors.push(`${name}: route-specific implementation leaked into the reusable skill`);
    }
  }

  for (const [owner, source] of documents) {
    const links = source.match(/(?:references\/)?[a-z0-9-]+\.md\b/g) || [];
    for (const link of links) {
      const name = link.replace('references/', '');
      if (!references.has(name)) errors.push(`${owner}: broken reference link ${link}`);
    }
  }

  const allReferences = [...references.values()].join('\n');
  const conflicts = [
    [/Widths below 1280px are not a supported project contract/, 'obsolete 1280px lower bound'],
    [/默认 \*\*常驻编辑态\*\*，禁止「先点编辑再改」/, 'obsolete always-editable detail contract'],
    [/query-filter-drawer__shell/, 'obsolete nested filter drawer shell'],
    [/!important overrides inline|global\.css` wins/, 'hidden overlay width override'],
    [/redesign-calibration\.md|checklist\.md/, 'superseded delivery authority restored'],
    [/Table row icon[^\n]*22×22px/, 'obsolete 22px row-action target'],
    [/Status pill[^\n]*F6 Micro[^\n]*10px/, 'obsolete 10px status-pill typography'],
    [/must set `outline: none`/, 'unsafe focus removal restored'],
  ];
  for (const [pattern, message] of conflicts) {
    if (pattern.test(allReferences)) errors.push(`references/: ${message}`);
  }
  if (/\| D2 Filter wide \|[^\n]*50\+/.test(allReferences)) {
    errors.push('references/: 50+ query fields must not route to a filter drawer');
  }

  return [...new Set(errors)];
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
