import Base64 from 'crypto-js/enc-base64';
import TOS from '../../src/browser-index';
import { NEVER_TIMEOUT, deleteBucket } from '../utils';
import {
  isNeedDeleteBucket,
  testBucketName,
  testCallBackUrl,
  tosOptions,
} from '../utils/options';
import {
  objectKey10M,
  objectKey1K,
  objectPath10M,
  objectPath1K,
} from './utils';
import { hashMd5 } from '../../src/nodejs/crypto.nodejs';
import fsp from 'fs/promises';

const key = `getObject-${objectKey1K}`;

describe('callback test environment', () => {
  it(
    'putObject test with callback',
    async () => {
      const client = new TOS(tosOptions);

      const originInput = `
      {
        "callbackUrl" : "${testCallBackUrl}", 
        "callbackBody" : ${'"{\\"bucket\\": ${bucket}, \\"object\\": ${object}, \\"key1\\": ${x:key1}}"'}, 
        "callbackBodyType" : "application/json"                
      }`;

      const originVarInput = `
      {
        "x:key1" : "ceshi"
      }`;
      const hashCallback = Buffer.from(originInput).toString('base64');
      const hashCallbackVar = Buffer.from(originVarInput).toString('base64');
      const res = await client.putObjectFromFile({
        key,
        filePath: objectPath1K,
        callback: hashCallback,
        callbackVar: hashCallbackVar,
      });

      expect(res.data.CallbackResult?.includes('ok')).toBeTruthy();
    },
    NEVER_TIMEOUT
  );
  it(
    'completeMultipartUpload test without  callback completeAll  has partsInfo',
    async () => {
      const client = new TOS(tosOptions);

      const bucketName = testBucketName;
      const objectName = objectKey10M;
      const filePath = objectPath10M;
      const {
        data: { UploadId },
      } = await client.createMultipartUpload({
        bucket: bucketName,
        key: objectName,
      });
      console.log('UploadId', UploadId);

      // 获取本地文件信息并准备进行分片
      const stats = await fsp.stat(filePath);
      // 文件总大小
      const totalSize = stats.size;

      const partSize = 5 * 1024 * 1024;

      let offset = 0;
      let partNumber = 1;
      const partsInfo: any[] = [];

      while (offset < totalSize) {
        const uploadResult = await client.uploadPartFromFile({
          bucket: bucketName,
          key: objectName,
          filePath,
          partNumber,
          uploadId: UploadId,
          offset,
          partSize,
        });
        const eTag = uploadResult.data.ETag;
        console.log(`partNumber${partNumber} Etag:`, eTag);
        partsInfo.push({
          partNumber,
          eTag,
        });
        partNumber++;
        offset += partSize;
      }

      console.log('parts information', partsInfo);

      // 完成分片上传
      const { data } = await client.completeMultipartUpload({
        bucket: bucketName,
        key: objectName,
        parts: [],
        uploadId: UploadId,
        completeAll: true,
      });

      console.log('result data:', data);
      expect(data.CompletedParts?.length).toEqual(partsInfo.length);
      expect(data.CallbackResult).toBe(undefined);
    },
    NEVER_TIMEOUT
  );

  it(
    'completeMultipartUpload test with callback',
    async () => {
      const client = new TOS(tosOptions);

      const originInput = `
      {
        "callbackUrl" : "${testCallBackUrl}", 
        "callbackBody" : ${'"{\\"bucket\\": ${bucket}, \\"object\\": ${object}, \\"key1\\": ${x:key1}}"'}, 
        "callbackBodyType" : "application/json"                
      }`;

      const originVarInput = `
      {
        "x:key1" : "ceshi"
      }`;
      const hashCallback = Buffer.from(originInput).toString('base64');
      const hashCallbackVar = Buffer.from(originVarInput).toString('base64');

      const bucketName = testBucketName;
      const objectName = objectKey10M;
      const filePath = objectPath10M;
      const {
        data: { UploadId },
      } = await client.createMultipartUpload({
        bucket: bucketName,
        key: objectName,
      });
      console.log('callback UploadId', UploadId);

      // 获取本地文件信息并准备进行分片
      const stats = await fsp.stat(filePath);
      // 文件总大小
      const totalSize = stats.size;

      const partSize = 5 * 1024 * 1024;

      let offset = 0;
      let partNumber = 1;
      const partsInfo: any[] = [];

      while (offset < totalSize) {
        const uploadResult = await client.uploadPartFromFile({
          bucket: bucketName,
          key: objectName,
          filePath,
          partNumber,
          uploadId: UploadId,
          offset,
          partSize,
        });
        const eTag = uploadResult.data.ETag;
        console.log(`callback partNumber${partNumber} Etag:`, eTag);
        partsInfo.push({
          partNumber,
          eTag,
        });
        partNumber++;
        offset += partSize;
      }

      console.log('callback parts information', partsInfo);

      // 完成分片上传
      const { data } = await client.completeMultipartUpload({
        bucket: bucketName,
        key: objectName,
        uploadId: UploadId,
        parts: partsInfo,
        callback: hashCallback,
        callbackVar: hashCallbackVar,
      });

      console.log('callback result data:', data);
      expect(data.CallbackResult?.includes('ok')).toBeTruthy();
    },
    NEVER_TIMEOUT
  );

  it(
    'completeMultipartUpload test with callback completeAll',
    async () => {
      const client = new TOS(tosOptions);

      const originInput = `
      {
        "callbackUrl" : "${testCallBackUrl}", 
        "callbackBody" : ${'"{\\"bucket\\": ${bucket}, \\"object\\": ${object}, \\"key1\\": ${x:key1}}"'}, 
        "callbackBodyType" : "application/json"                
      }`;

      const originVarInput = `
      {
        "x:key1" : "ceshi"
      }`;
      const hashCallback = Buffer.from(originInput).toString('base64');
      const hashCallbackVar = Buffer.from(originVarInput).toString('base64');

      const bucketName = testBucketName;
      const objectName = `callback-completeAll-${objectKey10M}`;
      const filePath = objectPath10M;
      const {
        data: { UploadId },
      } = await client.createMultipartUpload({
        bucket: bucketName,
        key: objectName,
      });
      console.log('completeAll UploadId', UploadId);

      // 获取本地文件信息并准备进行分片
      const stats = await fsp.stat(filePath);
      // 文件总大小
      const totalSize = stats.size;

      const partSize = 5 * 1024 * 1024;

      let offset = 0;
      let partNumber = 1;
      const partsInfo: any[] = [];

      while (offset < totalSize) {
        const uploadResult = await client.uploadPartFromFile({
          bucket: bucketName,
          key: objectName,
          filePath,
          partNumber,
          uploadId: UploadId,
          offset,
          partSize,
        });
        const eTag = uploadResult.data.ETag;
        console.log(`completeAll partNumber${partNumber} Etag:`, eTag);
        partsInfo.push({
          partNumber,
          eTag,
        });
        partNumber++;
        offset += partSize;
      }

      console.log('completeAll parts information', partsInfo);

      // 完成分片上传
      const { data } = await client.completeMultipartUpload({
        bucket: bucketName,
        key: objectName,
        parts: [],
        uploadId: UploadId,
        callback: hashCallback,
        callbackVar: hashCallbackVar,
        completeAll: true,
      });

      console.log('completeAll result data:', data);
      expect(data.CallbackResult?.includes('ok')).toBeTruthy();
    },
    NEVER_TIMEOUT
  );
});
