/**
 * @license
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const Audit = require('../audit');
const Formatter = require('../../../formatters/formatter');

class ColorContrast extends Audit {
  /**
   * @override
   */
  static get category() {
    return 'Accessibility';
  }

  /**
   * @override
   */
  static get name() {
    return 'color-contrast';
  }

  /**
   * @override
   */
  static get description() {
    return 'Background and foreground colors have a sufficient contrast ratio';
  }

  /**
   * @return {!Array<string>}
   */
  static get requiredArtifacts() {
    return ['accessibility'];
  }

  /**
   * @param {!Artifacts} artifacts
   * @return {!AuditResult}
   */
  static audit(artifacts) {
    const rule =
        artifacts.accessibility.violations.find(result => result.id === 'color-contrast');

    return ColorContrast.generateAuditResult({
      value: typeof rule === 'undefined',
      debugString: this.createDebugString(rule),
      extendedInfo: {
        formatter: Formatter.SUPPORTED_FORMATS.ACCESSIBILITY,
        value: rule
      }
    });
  }

  static createDebugString(rule) {
    if (typeof rule === 'undefined') {
      return '';
    }

    const elementsStr = rule.nodes.length === 1 ? 'element' : 'elements';
    return `${rule.help} (Failed on ${rule.nodes.length} ${elementsStr})`;
  }
}

module.exports = ColorContrast;
