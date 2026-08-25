import { observable } from 'mobx';
import { BaseModel, persist, restore, toggle } from 'mobx-restful';

import { isServer } from './configuration';

export const buffer2hex = (buffer: ArrayBufferLike) =>
  Array.from(new Uint8Array(buffer), x => x.toString(16).padStart(2, '0')).join('');

export class SignatureModel extends BaseModel {
  algorithm = { name: 'ECDSA', namedCurve: 'P-384', hash: { name: 'SHA-256' } };

  @persist()
  @observable
  accessor privateKey: CryptoKey | undefined;

  @persist()
  @observable
  accessor publicKey = '';

  @persist()
  @observable
  accessor signatureMap = {} as Record<string, string>;

  restored = !isServer() && restore(this, 'Signature');

  @toggle('uploading')
  async makeKeyPair() {
    await this.restored;

    if (this.publicKey) return this.publicKey;

    const { publicKey, privateKey } = await crypto.subtle.generateKey(this.algorithm, true, [
      'sign',
      'verify',
    ]);
    this.privateKey = privateKey;

    const JWK = await crypto.subtle.exportKey('jwk', publicKey);

    return (this.publicKey = btoa(JSON.stringify(JWK)));
  }

  @toggle('uploading')
  async sign(value: string) {
    await this.restored;

    let signature = this.signatureMap[value];

    if (signature) return signature;

    if (!this.publicKey) await this.makeKeyPair();

    const rawSignature = await crypto.subtle.sign(
      this.algorithm,
      this.privateKey!,
      new TextEncoder().encode(value),
    );
    signature = buffer2hex(rawSignature);

    this.signatureMap = { ...this.signatureMap, [value]: signature };

    return signature;
  }
}
