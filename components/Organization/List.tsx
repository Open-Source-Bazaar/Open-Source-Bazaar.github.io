import { FC } from 'react';

import { Organization } from '../../models/Organization';

export interface OrganizationListLayoutProps {
  defaultData: Organization[];
  onSwitch?: (filter: { type?: string; tags?: string; city?: string }) => void;
}

// Placeholder for now - this will be implemented based on actual data structure
export const OrganizationListLayout: FC<OrganizationListLayoutProps> = ({ defaultData }) => (
  <div>List layout with {defaultData.length} organizations</div>
);