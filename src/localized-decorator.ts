/**
 * @license
 * Copyright 2021 Weave B.V.
 * SPDX-License-Identifier: MIT License
 */

import type { ReactiveElement } from '@lit/reactive-element';
import type { ClassDescriptor, Constructor } from '@lit/reactive-element/decorators/base';
import { updateWhenLocaleChanges } from './localized-controller';

const _localized =
    () => (classOrDescriptor: Constructor<ReactiveElement> | ClassDescriptor) =>
        typeof classOrDescriptor === 'function'
            ? legacyLocalized(classOrDescriptor as unknown as typeof ReactiveElement)
            : standardLocalized(classOrDescriptor);


/**
 * Class decorator to enable re-rendering the given LitElement whenever a new
 * active loaded locale has ben set.
 *
 * See also {@link updateWhenLocaleChanges} for the same functionality without
 * the use of decorators.
 *
 * Usage:
 *
 *   import { LitElement, html } from 'lit';
 *   import { customElement } from 'lit/decorators.js';
 *   import { localized, t } from '@weavedev/lit-i18next';
 *
 *   @localized()
 *   @customElement('my-element')
 *   class MyElement extends LitElement {
 *     render() {
 *       return html`<b>${t('key.path')}</b>`;
 *     }
 *   }
 */
export const localized: typeof _localized & {
    _LIT_I18NEXT_LOCALIZE_DECORATOR_?: never;
} = _localized;

const standardLocalized = ({kind, elements}: ClassDescriptor) => {
    return {
        kind,
        elements,
        finisher(clazz: typeof ReactiveElement) {
            clazz.addInitializer(updateWhenLocaleChanges);
        },
    };
};

const legacyLocalized = (clazz: typeof ReactiveElement) => {
    clazz.addInitializer(updateWhenLocaleChanges);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return clazz as any;
};
