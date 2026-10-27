'use client';

import { RoleGuard } from '@/components/RoleGuard';

export function OwnerGate({ children }) {
  return <RoleGuard allowedRoles={['landlord']}>{children}</RoleGuard>;
}

export function OwnerLayout({ children }) {
  return <OwnerGate>{children}</OwnerGate>;
}
