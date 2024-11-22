'use client';

import { ReactNode } from 'react';
import { RecoilRoot } from 'recoil';

type RecoilRootProviderProps = {
  children: ReactNode;
};

export default function RecoilRootProvider({
  children,
}: RecoilRootProviderProps) {
  return <RecoilRoot>{children}</RecoilRoot>;
}
