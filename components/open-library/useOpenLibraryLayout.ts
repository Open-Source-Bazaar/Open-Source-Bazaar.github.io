import { useEffect } from 'react';

/**
 * Hook to apply Open Library layout styles
 * This adds the open-library class to the body and html elements
 * which triggers the CSS rules in styles/open-library.css
 */
export function useOpenLibraryLayout() {
  useEffect(() => {
    // Add open-library class to body and html
    document.body.classList.add('open-library');
    document.documentElement.classList.add('open-library');

    // Clean up function to remove classes when component unmounts
    return () => {
      document.body.classList.remove('open-library');
      document.documentElement.classList.remove('open-library');
    };
  }, []);
}
