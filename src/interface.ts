import {
  ACLType,
  CannedType,
  PermissionType,
  StorageClassType,
} from './TosExportEnum';

export type Headers = { [key: string]: string | undefined };

export interface AclInterface {
  Owner: { ID: string };
  Grants: {
    Grantee: {
      ID?: string;
      DisplayName?: string;
      Type: string;
      Canned?: CannedType;
    };
    Permission: PermissionType;
  }[];
}

export type Acl = ACLType;
export type StorageClass = StorageClassType;

export type ServerSideEncryption = 'AES256';

export interface DataTransferStatus {
  /**
   * has read or wrote bytes
   */
  consumedBytes: number;

  /**
   * totalBytes maybe 0
   */
  totalBytes: number;

  /**
   * transferred bytes in this transfer
   */
  rwOnceBytes: number;

  type: DataTransferType;
}

export enum DataTransferType {
  Started = 1, // data transfer start
  Rw = 2, // one transfer
  Succeed = 3, // data transfer succeed
  Failed = 4, // data transfer failed
}

export type SupportObjectBody =
  | File
  | Blob
  | Buffer
  | NodeJS.ReadableStream
  | undefined;
