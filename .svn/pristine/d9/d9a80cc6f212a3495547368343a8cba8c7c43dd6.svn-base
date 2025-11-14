const cpx = require('cpx');
const rimraf = require('rimraf')
const fs = require('fs')
const process = require('process')
const bestzip = require('bestzip')

function callback(err) {
  if (err) throw err;
}

const WORK_DIR = 'release_work';
const TEMPLATE_WORK_DIR = WORK_DIR + '/eim-task-client-template';

// クリア
rimraf.sync('release/eim-task-client-template.zip')
rimraf.sync(TEMPLATE_WORK_DIR)

// ルートフォルダのコピー
cpx.copySync('.*', TEMPLATE_WORK_DIR)
cpx.copySync('*', TEMPLATE_WORK_DIR)
rimraf.sync(TEMPLATE_WORK_DIR + '/create-eim-task-client-template.js')

// srcのコピー
cpx.copySync('src/*', TEMPLATE_WORK_DIR + '/src')
fs.copyFileSync('src/eim-task-client-template-main.ts', TEMPLATE_WORK_DIR + '/src/main.ts')

// src/appのコピー
cpx.copySync('src/app/app.component.css', TEMPLATE_WORK_DIR + '/src/app')
cpx.copySync('src/app/app.component.html', TEMPLATE_WORK_DIR + '/src/app')
cpx.copySync('src/app/app.component.ts', TEMPLATE_WORK_DIR + '/src/app')
cpx.copySync('src/app/eim-task-client-template-app-routing.ts', TEMPLATE_WORK_DIR + '/src/app')

cpx.copySync('src/app/admins/**', TEMPLATE_WORK_DIR + '/src/app/admins')
cpx.copySync('src/app/documents/**', TEMPLATE_WORK_DIR + '/src/app/documents')
cpx.copySync('src/app/forms/**', TEMPLATE_WORK_DIR + '/src/app/forms')
cpx.copySync('src/app/tasks/**', TEMPLATE_WORK_DIR + '/src/app/tasks')
cpx.copySync('src/app/portals/**', TEMPLATE_WORK_DIR + '/src/app/portals')
cpx.copySync('src/app/shared/**', TEMPLATE_WORK_DIR + '/src/app/shared')

// src/assetsのコピー
cpx.copySync('src/assets/i18n/eim.*', TEMPLATE_WORK_DIR + '/src/assets/i18n')
cpx.copySync('src/assets/i18n/tasks.*', TEMPLATE_WORK_DIR + '/src/assets/i18n')
cpx.copySync('src/assets/icon/**', TEMPLATE_WORK_DIR + '/src/assets/icon')
cpx.copySync('src/assets/config.json', TEMPLATE_WORK_DIR + '/src/assets')
cpx.copySync('src/assets/EIM_logo.svg', TEMPLATE_WORK_DIR + '/src/assets')

// src/environmentsのコピー
cpx.copySync('src/environments/**', TEMPLATE_WORK_DIR + '/src/environments')

// src/sassのコピー
cpx.copySync('src/sass/**', TEMPLATE_WORK_DIR + '/src/sass')

process.chdir(WORK_DIR)

bestzip.zip({
  source: 'eim-task-client-template/**',
  destination: '../release/eim-task-client-template.zip'
})
