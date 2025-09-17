import { InferGetStaticPropsType } from 'next';

import { ZodiacBar } from '../../components/Base/ZodiacBar';
import { OrganizationModel } from '../../models/Organization';

export const getStaticProps = async () => {
  const [startYear, endYear] = await new OrganizationModel().getYearRange();

  return { props: { startYear, endYear } };
};

export default function OrganizationHomePage(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  return <ZodiacBar {...props} itemOf={year => ({ title: year, link: `/NGO/${year}` })} />;
}
