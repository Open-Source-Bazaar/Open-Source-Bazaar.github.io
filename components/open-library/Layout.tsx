import { FC, PropsWithChildren } from 'react';

const ContentContainer: FC<PropsWithChildren> = ({ children }) => (
  <div className="container-xl px-3">{children}</div>
);

export default ContentContainer;
export { ContentContainer };
