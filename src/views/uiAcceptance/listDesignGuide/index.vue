<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { Message } from '@arco-design/web-vue';
import { IconCheckCircle, IconLaunch } from '@arco-design/web-vue/es/icon';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { LIST_DESIGN_GUIDE_FEATURE_CONTRACTS } from './featureContracts';
import { LIST_DESIGN_GUIDE_PAGE_SPEC } from './pageSpec';

void LIST_DESIGN_GUIDE_FEATURE_CONTRACTS;
void LIST_DESIGN_GUIDE_PAGE_SPEC;

type SectionId = 'principles' | 'archetypes' | 'anatomy' | 'query-actions' | 'table' | 'localization' | 'acceptance';

const { t } = useI18n();
const router = useRouter();
const scrollOwner = ref<HTMLElement>();
const openingExample = ref(false);
const activeSection = ref<SectionId>('principles');
let sectionObserver: IntersectionObserver | undefined;

const sections = computed<Array<{ id: SectionId; label: string }>>(() => [
  { id: 'principles', label: t('listDesignGuide.nav.principles') },
  { id: 'archetypes', label: t('listDesignGuide.nav.archetypes') },
  { id: 'anatomy', label: t('listDesignGuide.nav.anatomy') },
  { id: 'query-actions', label: t('listDesignGuide.nav.queryActions') },
  { id: 'table', label: t('listDesignGuide.nav.table') },
  { id: 'localization', label: t('listDesignGuide.nav.localization') },
  { id: 'acceptance', label: t('listDesignGuide.nav.acceptance') },
]);

const principleRules = computed(() => [
  t('listDesignGuide.section.principles.rule1'),
  t('listDesignGuide.section.principles.rule2'),
  t('listDesignGuide.section.principles.rule3'),
]);

const archetypes = computed(() => ['query', 'management', 'workbench'].map((key) => ({
  key,
  title: t(`listDesignGuide.section.archetypes.${key}.title`),
  job: t(`listDesignGuide.section.archetypes.${key}.job`),
  structure: t(`listDesignGuide.section.archetypes.${key}.structure`),
  avoid: t(`listDesignGuide.section.archetypes.${key}.avoid`),
})));

const anatomySteps = computed(() => ['mode', 'query', 'workflow', 'toolbar', 'data', 'feedback'].map((key, index) => ({
  key,
  index: String(index + 1).padStart(2, '0'),
  title: t(`listDesignGuide.section.anatomy.${key}`),
  description: t(`listDesignGuide.section.anatomy.${key}Desc`),
})));

const queryRules = computed(() => [1, 2, 3].map((index) => t(`listDesignGuide.section.queryActions.query${index}`)));
const actionRules = computed(() => [1, 2, 3].map((index) => t(`listDesignGuide.section.queryActions.action${index}`)));
const localizationRules = computed(() => [1, 2, 3, 4].map((index) => t(`listDesignGuide.section.localization.rule${index}`)));
const acceptanceRules = computed(() => [1, 2, 3, 4, 5, 6].map((index) => t(`listDesignGuide.section.acceptance.item${index}`)));

const hasExampleRoute = computed(() => router.resolve({ name: 'ShipmentOrderWorkbench' }).matched.length > 0);

function scrollToSection(id: SectionId) {
  activeSection.value = id;
  document.getElementById(`list-guide-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function openExample() {
  if (!hasExampleRoute.value || openingExample.value) return;
  openingExample.value = true;
  try {
    await router.push({ name: 'ShipmentOrderWorkbench' });
  } catch {
    Message.error(t('listDesignGuide.actions.openFailed'));
  } finally {
    openingExample.value = false;
  }
}

onMounted(async () => {
  await nextTick();
  if (!scrollOwner.value) return;
  sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top)[0];
    if (visible) activeSection.value = visible.target.id.replace('list-guide-', '') as SectionId;
  }, { root: scrollOwner.value, rootMargin: '-16px 0px -70% 0px', threshold: [0, 0.1] });
  sections.value.forEach(({ id }) => {
    const element = document.getElementById(`list-guide-${id}`);
    if (element) sectionObserver?.observe(element);
  });
});

onBeforeUnmount(() => sectionObserver?.disconnect());
</script>

<template>
  <div ref="scrollOwner" class="list-design-guide" data-pesdp-page="ui-acceptance-list-design-guide" data-detail-workspace="list-page-design-standard">
    <header class="guide-identity">
      <div class="guide-identity__main">
        <div class="guide-identity__copy">
          <div class="guide-identity__eyebrow">{{ t('listDesignGuide.eyebrow') }}</div>
          <div class="guide-identity__title-row">
            <h1>{{ t('listDesignGuide.title') }}</h1>
            <a-tag size="small">{{ t('listDesignGuide.scope') }}</a-tag>
          </div>
          <p>{{ t('listDesignGuide.summary') }}</p>
        </div>
        <a-button v-if="hasExampleRoute" type="outline" :loading="openingExample" @click="openExample">
          <template #icon><icon-launch /></template>
          {{ t('listDesignGuide.actions.openExample') }}
        </a-button>
      </div>
      <div class="guide-identity__facts">
        <div class="guide-fact">
          <span>{{ t('listDesignGuide.facts.archetypeLabel') }}</span>
          <strong>{{ t('listDesignGuide.facts.archetypeValue') }}</strong>
        </div>
        <div class="guide-fact">
          <span>{{ t('listDesignGuide.facts.viewportLabel') }}</span>
          <strong>{{ t('listDesignGuide.facts.viewportValue') }}</strong>
        </div>
        <div class="guide-fact">
          <span>{{ t('listDesignGuide.facts.localeLabel') }}</span>
          <strong>{{ t('listDesignGuide.facts.localeValue') }}</strong>
        </div>
      </div>
    </header>

    <div class="guide-workspace">
      <aside class="guide-index" :aria-label="t('listDesignGuide.title')">
        <div class="guide-index__inner">
          <a-link
            v-for="section in sections"
            :key="section.id"
            :href="`#list-guide-${section.id}`"
            :class="{ 'guide-index__link--active': activeSection === section.id }"
            @click.prevent="scrollToSection(section.id)"
          >
            {{ section.label }}
          </a-link>
        </div>
      </aside>

      <main class="guide-content">
        <section id="list-guide-principles" class="guide-section">
          <div class="guide-section__head">
            <h2>{{ t('listDesignGuide.section.principles.title') }}</h2>
            <p>{{ t('listDesignGuide.section.principles.description') }}</p>
          </div>
          <a-descriptions :column="1" size="small" bordered>
            <a-descriptions-item :label="t('listDesignGuide.section.principles.priorityLabel')">
              <strong>{{ t('listDesignGuide.section.principles.priorityValue') }}</strong>
            </a-descriptions-item>
          </a-descriptions>
          <a-list class="guide-rule-list" :bordered="false" size="small">
            <a-list-item v-for="rule in principleRules" :key="rule">
              <template #extra><icon-check-circle class="guide-rule-icon" /></template>
              {{ rule }}
            </a-list-item>
          </a-list>
        </section>

        <a-divider :margin="0" />

        <section id="list-guide-archetypes" class="guide-section">
          <div class="guide-section__head">
            <h2>{{ t('listDesignGuide.section.archetypes.title') }}</h2>
            <p>{{ t('listDesignGuide.section.archetypes.description') }}</p>
          </div>
          <div class="archetype-grid">
            <article v-for="item in archetypes" :key="item.key" class="archetype-item">
              <h3>{{ item.title }}</h3>
              <dl>
                <dt>{{ t('listDesignGuide.section.archetypes.job') }}</dt><dd>{{ item.job }}</dd>
                <dt>{{ t('listDesignGuide.section.archetypes.structure') }}</dt><dd>{{ item.structure }}</dd>
                <dt>{{ t('listDesignGuide.section.archetypes.avoid') }}</dt><dd>{{ item.avoid }}</dd>
              </dl>
            </article>
          </div>
        </section>

        <a-divider :margin="0" />

        <section id="list-guide-anatomy" class="guide-section">
          <div class="guide-section__head">
            <h2>{{ t('listDesignGuide.section.anatomy.title') }}</h2>
            <p>{{ t('listDesignGuide.section.anatomy.description') }}</p>
          </div>
          <ol class="anatomy-list">
            <li v-for="step in anatomySteps" :key="step.key">
              <span class="anatomy-list__index">{{ step.index }}</span>
              <div><strong>{{ step.title }}</strong><p>{{ step.description }}</p></div>
            </li>
          </ol>
        </section>

        <a-divider :margin="0" />

        <section id="list-guide-query-actions" class="guide-section">
          <div class="guide-section__head">
            <h2>{{ t('listDesignGuide.section.queryActions.title') }}</h2>
            <p>{{ t('listDesignGuide.section.queryActions.description') }}</p>
          </div>
          <div class="rule-columns">
            <div>
              <h3>{{ t('listDesignGuide.section.queryActions.queryTitle') }}</h3>
              <a-list class="guide-rule-list" :bordered="false" size="small">
                <a-list-item v-for="rule in queryRules" :key="rule">{{ rule }}</a-list-item>
              </a-list>
            </div>
            <div>
              <h3>{{ t('listDesignGuide.section.queryActions.actionTitle') }}</h3>
              <a-list class="guide-rule-list" :bordered="false" size="small">
                <a-list-item v-for="rule in actionRules" :key="rule">{{ rule }}</a-list-item>
              </a-list>
            </div>
          </div>
        </section>

        <a-divider :margin="0" />

        <section id="list-guide-table" class="guide-section">
          <div class="guide-section__head">
            <h2>{{ t('listDesignGuide.section.table.title') }}</h2>
            <p>{{ t('listDesignGuide.section.table.description') }}</p>
          </div>
          <a-descriptions class="guide-descriptions" :column="2" size="small" bordered>
            <a-descriptions-item :label="t('listDesignGuide.section.table.baselineLabel')">{{ t('listDesignGuide.section.table.baselineValue') }}</a-descriptions-item>
            <a-descriptions-item :label="t('listDesignGuide.section.table.orderLabel')">{{ t('listDesignGuide.section.table.orderValue') }}</a-descriptions-item>
            <a-descriptions-item :label="t('listDesignGuide.section.table.widthLabel')">{{ t('listDesignGuide.section.table.widthValue') }}</a-descriptions-item>
            <a-descriptions-item :label="t('listDesignGuide.section.table.operationLabel')">{{ t('listDesignGuide.section.table.operationValue') }}</a-descriptions-item>
            <a-descriptions-item :label="t('listDesignGuide.section.table.settingsLabel')">{{ t('listDesignGuide.section.table.settingsValue') }}</a-descriptions-item>
            <a-descriptions-item :label="t('listDesignGuide.section.table.statusLabel')">{{ t('listDesignGuide.section.table.statusValue') }}</a-descriptions-item>
          </a-descriptions>
        </section>

        <a-divider :margin="0" />

        <section id="list-guide-localization" class="guide-section">
          <div class="guide-section__head">
            <h2>{{ t('listDesignGuide.section.localization.title') }}</h2>
            <p>{{ t('listDesignGuide.section.localization.description') }}</p>
          </div>
          <a-alert type="info" :title="t('listDesignGuide.section.localization.alertTitle')">
            {{ t('listDesignGuide.section.localization.alertBody') }}
          </a-alert>
          <a-list class="guide-rule-list" :bordered="false" size="small">
            <a-list-item v-for="rule in localizationRules" :key="rule">{{ rule }}</a-list-item>
          </a-list>
        </section>

        <a-divider :margin="0" />

        <section id="list-guide-acceptance" class="guide-section">
          <div class="guide-section__head">
            <h2>{{ t('listDesignGuide.section.acceptance.title') }}</h2>
            <p>{{ t('listDesignGuide.section.acceptance.description') }}</p>
          </div>
          <div class="acceptance-grid">
            <div v-for="rule in acceptanceRules" :key="rule" class="acceptance-item">
              <icon-check-circle class="acceptance-item__icon" />
              <span>{{ rule }}</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
.list-design-guide {
  height: 100%;
  min-width: 0;
  overflow: auto;
  background: var(--color-bg-card);
  color: var(--color-text-1);
}

.guide-identity {
  padding: var(--dense-pad-section-y) var(--dense-pad-section-x);
  border-bottom: 1px solid var(--color-border-2);
}

.guide-identity__main {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--dense-gap-module);
}

.guide-identity__copy { min-width: 0; }
.guide-identity__eyebrow { color: var(--color-text-3); font-size: var(--dense-font-aux); line-height: 1.4; }
.guide-identity__title-row { display: flex; align-items: center; flex-wrap: wrap; gap: var(--dense-gap-inline); margin-top: 2px; }
.guide-identity h1 { margin: 0; font-size: var(--dense-font-hero); font-weight: var(--dense-weight-overlay); line-height: 1.4; letter-spacing: 0; }
.guide-identity p { max-width: 920px; margin: 4px 0 0; color: var(--color-text-2); font-size: var(--dense-font-data); line-height: 1.55; }

.guide-identity__facts {
  display: flex;
  flex-wrap: wrap;
  gap: 4px var(--dense-gap-module);
  margin-top: var(--dense-gap-inline);
}

.guide-fact { display: inline-flex; align-items: baseline; gap: 6px; min-width: 0; }
.guide-fact span { color: var(--color-text-3); font-size: var(--dense-font-aux); }
.guide-fact strong { color: var(--color-text-1); font-size: var(--dense-font-data); font-weight: var(--dense-weight-control); }

.guide-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  min-width: 0;
}

.guide-index { display: none; }
.guide-content { min-width: 0; }
.guide-section { scroll-margin-top: var(--dense-gap-zone); padding: 18px var(--dense-pad-section-x); }
.guide-section__head { margin-bottom: var(--dense-gap-module); }
.guide-section__head h2,
.guide-section h3 { margin: 0; letter-spacing: 0; }
.guide-section__head h2 { font-size: var(--dense-font-nav); font-weight: var(--dense-weight-nav-active); line-height: 1.4; }
.guide-section__head p { margin: 4px 0 0; color: var(--color-text-3); font-size: var(--dense-font-aux); line-height: 1.5; }
.guide-section h3 { font-size: var(--dense-font-title); font-weight: var(--dense-weight-title); line-height: 1.4; }

.guide-rule-list { margin-top: var(--dense-gap-inline); }
.guide-rule-icon,
.acceptance-item__icon { flex: 0 0 auto; color: var(--dense-success-6); font-size: var(--dense-icon-action); }

.archetype-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0;
}

.archetype-item { min-width: 0; padding: 0 var(--dense-pad-section-x); }
.archetype-item:first-child { padding-inline-start: 0; }
.archetype-item + .archetype-item { border-inline-start: 1px solid var(--color-border-2); }
.archetype-item dl { display: grid; grid-template-columns: minmax(72px, auto) minmax(0, 1fr); gap: 6px var(--dense-gap-inline); margin: var(--dense-gap-inline) 0 0; }
.archetype-item dt { color: var(--color-text-3); font-size: var(--dense-font-aux); }
.archetype-item dd { min-width: 0; margin: 0; color: var(--color-text-2); font-size: var(--dense-font-data); line-height: 1.5; }

.anatomy-list { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--dense-gap-module); margin: 0; padding: 0; list-style: none; }
.anatomy-list li { display: grid; grid-template-columns: 28px minmax(0, 1fr); gap: var(--dense-gap-inline); min-width: 0; }
.anatomy-list__index { color: var(--dense-primary-6); font-size: var(--dense-font-micro); font-weight: var(--dense-weight-nav-active); line-height: 20px; font-variant-numeric: tabular-nums; }
.anatomy-list strong { font-size: var(--dense-font-title); font-weight: var(--dense-weight-title); }
.anatomy-list p { margin: 3px 0 0; color: var(--color-text-2); font-size: var(--dense-font-data); line-height: 1.5; }

.rule-columns { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: calc(var(--dense-gap-module) * 2); }
.rule-columns > div { min-width: 0; }
.guide-descriptions { width: 100%; }

.acceptance-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--dense-gap-module) calc(var(--dense-gap-module) * 2); }
.acceptance-item { display: flex; align-items: flex-start; gap: var(--dense-gap-inline); min-width: 0; color: var(--color-text-2); font-size: var(--dense-font-data); line-height: 1.5; }
.acceptance-item__icon { margin-top: 2px; }

@media (min-width: 1440px) {
  .guide-workspace { grid-template-columns: 168px minmax(0, 1fr); }
  .guide-index { display: block; border-inline-end: 1px solid var(--color-border-2); }
  .guide-index__inner { position: sticky; top: 0; display: flex; flex-direction: column; gap: 2px; padding: var(--dense-pad-section-y) var(--dense-pad-section-x); }
  .guide-index__inner :deep(.arco-link) { justify-content: flex-start; min-height: var(--dense-control-h-nav); padding: 0 8px; color: var(--color-text-2); font-size: var(--dense-font-data); }
  .guide-index__inner :deep(.guide-index__link--active) { color: var(--dense-primary-6); background: var(--dense-primary-1); font-weight: var(--dense-weight-control); }
}

@media (max-width: 1199px) {
  .guide-identity__main { align-items: stretch; }
  .guide-identity__main > :deep(.arco-btn) { flex: 0 0 auto; }
  .archetype-grid { grid-template-columns: minmax(0, 1fr); }
  .archetype-item { padding: var(--dense-pad-section-y) 0; }
  .archetype-item:first-child { padding-top: 0; }
  .archetype-item + .archetype-item { border-inline-start: 0; border-top: 1px solid var(--color-border-2); }
  .anatomy-list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
</style>
