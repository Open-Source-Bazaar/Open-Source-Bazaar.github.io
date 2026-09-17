import { GetStaticProps } from 'next';
import { FC } from 'react';
import { Minute, Second } from 'web-utility';

import { Award, AwardModel } from '../../models/Award';
import { hasLarkServerAccess } from '../../models/configuration';
import { lark } from '../api/Lark/core';

export const getStaticProps: GetStaticProps<{ awards: Award[] }> = async () => {
  if (!hasLarkServerAccess) return { props: { awards: [] }, revalidate: Minute / Second };

  await lark.getAccessToken();

  const store = new AwardModel();
  store.client = lark.client;

  const awards = await store.getAll();

  return { props: { awards }, revalidate: Minute / Second };
};

const AwardPage: FC = () => <></>;

export default AwardPage;
