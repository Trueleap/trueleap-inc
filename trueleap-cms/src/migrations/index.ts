import * as migration_20260209_190333_add_drafts from './20260209_190333_add_drafts';
import * as migration_20260210_104720_ai_plugin from './20260210_104720_ai_plugin';

export const migrations = [
  {
    up: migration_20260209_190333_add_drafts.up,
    down: migration_20260209_190333_add_drafts.down,
    name: '20260209_190333_add_drafts',
  },
  {
    up: migration_20260210_104720_ai_plugin.up,
    down: migration_20260210_104720_ai_plugin.down,
    name: '20260210_104720_ai_plugin'
  },
];
