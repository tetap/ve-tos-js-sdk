import { TOS } from '../../src';
import { initAutoGeneratedObjects } from './utils';
import { createAllTestBuckets } from '../utils';

module.exports = async function () {
  initAutoGeneratedObjects();
  await createAllTestBuckets();
};
