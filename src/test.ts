// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import './polyfills.ts';

import 'zone.js/long-stack-trace-zone';
import 'zone.js/proxy';
import 'zone.js/testing/sync-test';
import 'zone.js/testing/jasmine-patch';
import 'zone.js/testing/async-test';
import 'zone.js/testing/fake-async-test';

import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// Unfortunately there's no typing for the `__karma__` variable. Just declare it as any.
declare var __karma__: any;
declare var require: any;

// Prevent Karma from running prematurely.
__karma__.loaded = function () {};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(), {
    teardown: { destroyAfterEach: false }
}
);
// Finally, start Karma to run the tests.
__karma__.start();
