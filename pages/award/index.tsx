import { cache, compose, errorLogger } from 'next-ssr-middleware';
import { FC } from 'react';

import { Award, AwardModel } from '../../models/Award';

export const getServerSideProps = compose(cache(), errorLogger, async () => {
  const awards = await new AwardModel().getAll();

  return { props: { awards } };
});

const AwardPage: FC<{ awards: Award[] }> = ({ awards }) => {
  return <></>;
};

export default AwardPage;
