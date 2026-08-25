import { withSafeKoa } from '../../../core';
import { proxyLarkAll } from '../../core';

export const config = { api: { bodyParser: false } };

export default withSafeKoa(proxyLarkAll);
