import TOS from '../../src/browser-index';
import { NEVER_TIMEOUT, sleepCache } from '../utils';
import { testBucketName, tosOptions } from '../utils/options';
const CommonTestCasePrefix = 'CustomDomain';

describe(`bucket ${CommonTestCasePrefix} methods`, () => {
  it(
    `${CommonTestCasePrefix} getBucketCustomDomain empty case`,
    async () => {
      const client = new TOS({
        ...tosOptions,
      });

      const result = await client.getBucketCustomDomain({
        bucket: testBucketName,
      });

      expect(result.data.CustomDomainRules.length).toBe(0);
    },
    NEVER_TIMEOUT
  );
  it(
    `${CommonTestCasePrefix} putBucketCustomDomain`,
    async () => {
      const client = new TOS({
        ...tosOptions,
      });

      const result = await client.putBucketCustomDomain({
        bucket: testBucketName,
        customDomainRule: {
          Domain: 'douyin.com',
        },
      });

      expect(result.data).toBe('');
    },
    NEVER_TIMEOUT
  );

  it(
    `${CommonTestCasePrefix} getBucketCustomDomain`,
    async () => {
      const client = new TOS({
        ...tosOptions,
      });

      const result = await client.getBucketCustomDomain({
        bucket: testBucketName,
      });

      expect(result.data.CustomDomainRules).toBeTruthy();
      expect(result.data.CustomDomainRules.at(0)?.Domain).toBe('douyin.com');
      // expect(result.data.IndexDocument?.Suffix).toBe('index.html');
      // expect(result.data.RoutingRules?.length).toBe(1);
    },
    NEVER_TIMEOUT
  );

  it(
    `${CommonTestCasePrefix} deleteBucketCustomDomain`,
    async () => {
      const client = new TOS({
        ...tosOptions,
      });

      const result = await client.deleteBucketCustomDomain({
        bucket: testBucketName,
        customDomain: 'douyin.com',
      });

      expect(result.data).toBe('');
    },
    NEVER_TIMEOUT
  );
});
