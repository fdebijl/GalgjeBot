/// <reference types="../" />

import { SpecReporter, StacktraceOption } from 'jasmine-spec-reporter'

import { games, Game } from '../src/domain/Game';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30 * 1000;
jasmine.getEnv().clearReporters()
jasmine.getEnv().addReporter(
  new SpecReporter({
    spec: {
      displayStacktrace: StacktraceOption.PRETTY
    }
  })
);

(async () => {
  games.current = Game.mock();
})();
