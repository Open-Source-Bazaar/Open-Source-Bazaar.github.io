import { FC } from 'react';

import { Project } from '../../models/Project';
import { GitCard } from '../Git/Card';

export const ProjectCard: FC<Project> = ({ name, sourceLink, link, languages, tags, summary }) => (
  <GitCard
    full_name={name as string}
    html_url={sourceLink as string}
    homepage={link as string}
    languages={languages as string[]}
    topics={tags as string[]}
    description={summary as string}
  />
);
