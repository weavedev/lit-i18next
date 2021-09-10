import i18next, { i18n, InitOptions, TFunction } from 'i18next';

type UpdatingElement = {
    connectedCallback(): void
    disconnectedCallback(): void

    requestUpdate(...args: any[]): void
}

export function localized(init?: InitOptions | ((i18next: i18n) => InitOptions)) {
  return function <T extends { new (...args: any[]): UpdatingElement}>(constructor: T) {
      return class extends constructor {
          public languageChangeHandler = () => this.requestUpdate();

          constructor(...args: any[]) {
              super(...args);

              const initOptions = typeof init === 'function' ? init(i18next) : init;
              if (initOptions && !i18next.isInitialized) {
                  i18next.init(initOptions).catch(console.error);
              }
          }

          public connectedCallback() {
              super.connectedCallback();
              i18next.on('languageChanged', this.languageChangeHandler);
          }

          public disconnectedCallback(): void {
              super.disconnectedCallback();
              i18next.off('languageChanged', this.languageChangeHandler);
          }
      }
  }
}

export function t(...args: Parameters<TFunction>): ReturnType<TFunction> {
    return i18next.t(...args);
}
