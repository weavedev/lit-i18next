/**
 * @license
 * Copyright 2021 Weave B.V.
 * SPDX-License-Identifier: MIT License
 */

import type { ReactiveElement } from '@lit/reactive-element';
import type { Constructor } from '@lit/reactive-element/decorators/base';
import { LocalizeOptions, updateWhenLocaleChanges } from './localized-controller';

// From the TC39 Decorators proposal
interface ClassDescriptor {
    kind: 'class';
    elements: ClassElement[];
    finisher?: <T>(clazz: Constructor<T>) => void | Constructor<T>;
}

// From the TC39 Decorators proposal
interface ClassElement {
    kind: 'field' | 'method';
    key: PropertyKey;
    placement: 'static' | 'prototype' | 'own';
    initializer?: Function;
    extras?: ClassElement[];
    finisher?: <T>(clazz: Constructor<T>) => void | Constructor<T>;
    descriptor?: PropertyDescriptor;
}

/**
 * Class decorator to enable re-rendering the given LitElement whenever a new
 * active loaded locale has been set.
 *
 * See also {@link updateWhenLocaleChanges} for the same functionality without
 * the use of decorators.
 *
 * ```ts
 * import { LitElement, html } from 'lit';
 * import { customElement } from 'lit/decorators.js';
 * import { localized, t } from '@weavedev/lit-i18next';
 *
 * @localized()
 * @customElement('my-element')
 * class MyElement extends LitElement {
 *   render() {
 *     return html`<b>${t('key.path')}</b>`;
 *   }
 * }
 * ```
 */
export const localized =
    (options?: LocalizeOptions) =>
    (classOrDescriptor: typeof ReactiveElement | ClassDescriptor) =>
        typeof classOrDescriptor === 'function'
            ? legacyLocalized(classOrDescriptor, options)
            : standardLocalized(classOrDescriptor, options);

const standardLocalized = ({kind, elements}: ClassDescriptor, options?: LocalizeOptions) => {
    return {
        kind,
        elements,
        finisher(clazz: typeof ReactiveElement) {
            clazz.addInitializer(host => updateWhenLocaleChanges(host, options));
        },
    };
};

const legacyLocalized = (clazz: typeof ReactiveElement, options ?: LocalizeOptions) => {
    clazz.addInitializer(host => updateWhenLocaleChanges(host, options));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return clazz as any;
};
