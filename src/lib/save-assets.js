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

const fs = require('fs');
const log = require('./log.js');
const stringify = require('json-stringify-safe');

function getAssetFilename(assetName, url) {
  const date = new Date();
  const hostname = url.match(/^.*?\/\/(.*?)(:?\/|$)/)[1];
  const filenamePrefix = hostname + '_' + date.toISOString();
  return (filenamePrefix + assetName).replace(/[\/\?<>\\:\*\|":]/g, '-');
}

// Some trace events are particularly large, and not only consume a LOT of disk
// space, but also cause problems for the JSON stringifier. For simplicity, we exclude them
function filterForSize(traceData) {
  return traceData.filter(e => e.name !== 'LayoutTree');
}

function screenshotDump(filename, screenshots) {
  return `
  <!doctype html>
  <title>${filename}</title>
  <style>
html {
    overflow-x: scroll;
    overflow-y: hidden;
    height: 100%;
    background: linear-gradient(to left, #4CA1AF , #C4E0E5);
    background-attachment: fixed;
    padding: 10px;
}
body {
    white-space: nowrap;
    background: linear-gradient(to left, #4CA1AF , #C4E0E5);
    width: 100%;
    margin: 0;
}
img {
    margin: 4px;
}
</style>
  <body>
    <script>
      var shots = ${JSON.stringify(screenshots)};

  shots.forEach(s => {
    var i = document.createElement('img');
    i.src = s.datauri;
    i.title = s.timestamp;
    document.body.appendChild(i);
  });
  </script>
  `;
}

module.exports = {
  saveArtifacts: function(artifacts) {
    const artifactsFilename = 'artifacts.log';
    fs.writeFileSync(artifactsFilename, stringify(artifacts));
    log.log('info', 'artifacts file saved to disk', artifactsFilename);
  },

  saveAssets: function(options, artifacts) {
    const url = options.url;

    const traceFilename = getAssetFilename('.trace.json', url);
    const traceData = filterForSize(artifacts.traceContents);
    fs.writeFileSync(traceFilename, stringify(traceData, null, 2));
    log.log('info', 'trace file saved to disk', traceFilename);

    const screenshotsFilename = getAssetFilename('.screenshots.html', url);
    const html = screenshotDump(screenshotsFilename, artifacts.screenshots);
    fs.writeFileSync(screenshotsFilename, html);
    log.log('info', 'screenshots saved to disk', screenshotsFilename);
  }
};
