/**
 * @license
 * Copyright 2021 Weave B.V.
 * SPDX-License-Identifier: MIT License
 */

import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { i18next } from './localized-helpers';

class LocalizeController implements ReactiveController {
    public readonly host: ReactiveControllerHost;

    private readonly localizeEventHandler = () => this.host.requestUpdate();

    constructor(host: ReactiveControllerHost) {
        this.host = host;
    }

    hostConnected() {
        if(!i18next.isInitialized) {
            i18next.on('initialized', this.localizeEventHandler);
        }
        i18next.on('languageChanged', this.localizeEventHandler);
    }

    hostDisconnected() {
        i18next.off('initialized', this.localizeEventHandler)
        i18next.off('languageChanged', this.localizeEventHandler);
    }
}

/**
 * Re-render the given LitElement whenever a new locale has set active.
 *
 * See also {@link localized} for the same functionality as a decorator.
 *
  * Usage:
 *
 *   import { LitElement, html } from 'lit';
 *   import { t, updateWhenLocaleChanges } from '@weavedev/lit-i18next';
 *
 *   class MyElement extends LitElement {
 *     constructor() {
 *       super();
 *       updateWhenLocaleChanges(this);
 *     }
 *
 *     render() {
 *       return html`<b>${t('key.path')}</b>`;
 *     }
 *   }
 */
const _updateWhenLocaleChanges = (host: ReactiveControllerHost) =>
    host.addController(new LocalizeController(host));

export const updateWhenLocaleChanges: typeof _updateWhenLocaleChanges & {
    _LIT_I18NEXT_LOCALIZE_CONTROLLER_FN_?: never;
} = _updateWhenLocaleChanges;
