import type { i18n, TFunction } from 'i18next';
import { default as localizer } from 'i18next';

window.i18next = window.i18next || localizer;
export const i18next: i18n = window.i18next;
export const t: TFunction = i18next.t.bind(i18next);

declare global {
    interface Window {
        i18next?: i18n;
    }
}
