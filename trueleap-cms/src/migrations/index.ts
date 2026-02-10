import * as migration_20260209_190333_add_drafts from './20260209_190333_add_drafts';

export const migrations = [
  {
    up: migration_20260209_190333_add_drafts.up,
    down: migration_20260209_190333_add_drafts.down,
    name: '20260209_190333_add_drafts'
  },
];
