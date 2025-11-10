import { Provider } from '@angular/core';
import { GANTT_GLOBAL_CONFIG, GANTT_I18N_LOCALE_TOKEN, enUsLocale } from '@worktile/gantt';

/**
 * Global configuration for @worktile/gantt v19
 * This configuration is shared across all components that use the gantt chart.
 */
export const GANTT_GLOBAL_CONFIG_PROVIDER: Provider = {
  provide: GANTT_GLOBAL_CONFIG,
  useValue: {
    linkOptions: {
      dependencyTypes: ['fs', 'ff', 'ss', 'sf']
    },
    styleOptions: {
      headerHeight: 52,
      lineHeight: 26,
      barHeight: 26
    }
  }
};

/**
 * Locale configuration for @worktile/gantt v19
 * Note: GANTT_I18N_LOCALE_TOKEN expects an array of locales
 */
export const GANTT_I18N_LOCALE_PROVIDER: Provider = {
  provide: GANTT_I18N_LOCALE_TOKEN,
  useValue: [enUsLocale]  // Must be an array
};

/**
 * All Gantt providers bundled together
 */
export const GANTT_PROVIDERS: Provider[] = [
  GANTT_GLOBAL_CONFIG_PROVIDER,
  GANTT_I18N_LOCALE_PROVIDER
];