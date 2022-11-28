/**
 * @license
 * Copyright 2021 Weave B.V.
 * SPDX-License-Identifier: MIT License
 */

import type { ReactiveController, ReactiveControllerHost } from '@lit/reactive-element';
import { default as i18next } from 'i18next';

type Event = 'added' | 'initialized' | 'languageChanged' | 'loaded';

export type LocalizeOptions = {
    event?: Event | Event[];
}

export class LocalizeController implements ReactiveController {
    public static readonly events: ReadonlyArray<Event> = ['languageChanged'];

    public readonly host: ReactiveControllerHost;

    private readonly events: ReadonlyArray<Event>;
    private readonly localizeEventHandler = () => this.host.requestUpdate();

    constructor(host: ReactiveControllerHost, options?: LocalizeOptions) {
        this.host = host;

        const events = options?.event !== undefined ? options.event : LocalizeController.events;
        this.events = typeof events === 'string' ? [events] : events;
    }

    hostConnected() {
        for (const event of this.events) {
            if (event == 'initialized' && i18next.isInitialized) continue;
            i18next.on(event, this.localizeEventHandler);
        }
    }

    hostDisconnected() {
        for (const event of this.events) {
            i18next.off(event, this.localizeEventHandler);
        }
    }
}

/**
 * Re-render the given LitElement whenever a new locale has set active.
 *
 * See also {@link localized} for the same functionality as a decorator.
 *
 * ```js
 * import { LitElement, html } from 'lit';
 * import { t, updateWhenLocaleChanges } from '@weavedev/lit-i18next';
 *
 * class MyElement extends LitElement {
 *   constructor() {
 *     super();
 *     updateWhenLocaleChanges(this);
 *   }
 *
 *   render() {
 *     return html`<b>${t('key.path')}</b>`;
 *   }
 * }
 */
export const updateWhenLocaleChanges = (host: ReactiveControllerHost, options?: LocalizeOptions) =>
    host.addController(new LocalizeController(host, options));
