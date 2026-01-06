import Giscus from '@giscus/react';
import { observer } from 'mobx-react';
import { useContext } from 'react';

import { I18nContext } from '../../models/Translation';

export const CommentBox = observer(() => {
  const { currentLanguage } = useContext(I18nContext);

  return (
    <Giscus
      repo="Open-Source-Bazaar/Open-Source-Bazaar.github.io"
      repoId="R_kgDOGzCrLg"
      category="Comments"
      categoryId="DIC_kwDOGzCrLs4C0g_6"
      mapping="pathname"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      theme="preferred_color_scheme"
      lang={currentLanguage.startsWith('zh-') ? currentLanguage : currentLanguage.split('-')[0]}
    />
  );
});
