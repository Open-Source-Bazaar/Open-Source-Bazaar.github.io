import { openLibraryBooks } from '../../../../models/open-library-books';

export const GET = () => Response.json(openLibraryBooks);
