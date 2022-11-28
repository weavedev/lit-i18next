[![npm version](https://img.shields.io/npm/v/@weavedev%2Flit-i18next.svg)](https://www.npmjs.com/package/@weavedev/lit-i18next)
[![Downloads](http://img.shields.io/npm/dm/@weavedev%2Flit-i18next.svg)](https://www.npmjs.com/package/@weavedev/lit-i18next)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![License](https://img.shields.io/github/license/weavedev/lit-i18next.svg)](https://github.com/weavedev/lit-i18next/blob/master/LICENSE)

# @weavedev/lit-i18next

## Usage

### Install
```bash
npm install --save @weavedev/lit-i18next
```
### Initialization

```typescript
import { i18next } from '@weavedev/lit-i18next';
import { LitElement } from 'lit';

class MyApp extends LitElment {
  i18nInit = i18next.init({
     ...options
  });

  protected async performUpdate(): Promise<unknown> {
    await this.i18nInit;

    return super.performUpdate();
  }
}
```

### Implementation

#### TypeScript (Decorator)

```typescript
import { localized, t } from '@weavedev/lit-i18next';
import { LitElement, html, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('my-element')
@localized({...options})
class MyElement extends LitElement {
  protected render(): TemplateResult {
    return html`<b>${t('path.to.translation_key')}</b>`;
  }
}
```

#### JavaScript

```javascript
import { t, updateWhenLocaleChanges } from '@weavedev/lit-i18next';
import { LitElement, html } from 'lit';

class MyElement extends LitElement {
  constructor() {
    super();
    updateWhenLocaleChanges(this, {
        ...options
    });
  }

  render() {
    return html`<b>${t('path.to.translation_key')}</b>!`;
  }
}
customElements.define('my-element', MyElement);
```

#### Options
Options can be passed optionally to the `localized` decorator or the `updateWhenLocaleChanges` callback.
```ts
type Event = 'added' | 'initialized' | 'languageChanged' | 'loaded';
type LocalizeOptions = {
    event?: Event | Event[]; // Event or events which will trigger a rerender
};
```


## License

This project is released under the [MIT license](LICENSE).
