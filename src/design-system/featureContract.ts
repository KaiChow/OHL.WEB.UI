export interface BusinessFeatureContract {
  id: string;
  actorRoles: readonly string[];
  visibleWhen: string;
  enabledWhen: string;
  request: string;
  successResult: string;
  errorResult: string;
  refreshScope: string;
}

export function defineFeatureContracts<const T extends readonly BusinessFeatureContract[]>(contracts: T): T {
  return contracts;
}
