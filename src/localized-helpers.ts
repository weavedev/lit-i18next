/**
 * @license
 * Copyright 2021 Weave B.V.
 * SPDX-License-Identifier: MIT License
 */

import type { TFunction } from 'i18next';
import { default as i18next } from 'i18next';

export { default as i18next } from 'i18next';
export const t: TFunction = i18next.t.bind(i18next);
