export type ModuleStatus = {
  module: string;
  phase: 'Phase 1';
  status: 'scaffolded';
  description: string;
};

export function moduleStatus(module: string, description: string): ModuleStatus {
  return {
    module,
    phase: 'Phase 1',
    status: 'scaffolded',
    description,
  };
}
