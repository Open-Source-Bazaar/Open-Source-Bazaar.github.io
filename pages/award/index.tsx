import { GetStaticProps } from 'next';
import { FC } from 'react';

import { Award, AwardModel } from '../../models/Award';
import { lark } from '../api/Lark/core';

export const getStaticProps: GetStaticProps<{ awards: Award[] }> = async () => {
  await lark.getAccessToken();

  const store = new AwardModel();
  store.client = lark.client;

  const awards = await store.getAll();

  return { props: { awards } };
};

const AwardPage: FC<{ awards: Award[] }> = ({ awards }) => {
  return <></>;
};

export default AwardPage;
