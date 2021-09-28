import i18next, { i18n, InitOptions, TFunction } from 'i18next';

type UpdatingElement = {
    connectedCallback(): void
    disconnectedCallback(): void

    performUpdate(): void | Promise<any>
    requestUpdate(...args: any[]): void
}

export function localized(init?: InitOptions | ((i18next: i18n) => InitOptions)) {
    return function <T extends { new(...args: any[]): UpdatingElement }>(constructor: T) {
        return class extends constructor {
            public languageChangeHandler = this.requestUpdate.bind(this);
            public isI18nInitialized?: Promise<unknown>;

            constructor(...args: any[]) {
                super(...args);

                const initOptions = typeof init === 'function' ? init(i18next) : {...init};
                if (!this.isI18nInitialized && !i18next.isInitialized) {
                    this.isI18nInitialized = i18next.init(initOptions);
                    this.isI18nInitialized.catch(console.warn);
                }
            }

            connectedCallback() {
                super.connectedCallback();
                i18next.on('languageChanged', this.languageChangeHandler);
            }

            disconnectedCallback(): void {
                i18next.off('languageChanged', this.languageChangeHandler);
                super.disconnectedCallback();
            }

            async performUpdate(): Promise<unknown> {
                await this.isI18nInitialized;

                return super.performUpdate();
            }
        };
    };
}

export function t(...args: Parameters<TFunction>): ReturnType<TFunction> {
    return i18next.t(...args);
}
