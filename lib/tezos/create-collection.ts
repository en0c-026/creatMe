import { TezosToolkit } from '@taquito/taquito';
import path from 'path';
import readFile from "../read-file"
import { createNftStorage } from '@oxheadalpha/tznft/dist/nft-util'
import { originateContract } from '@oxheadalpha/tezos-tools';


export async function createCollection(
  tz: TezosToolkit,
  metadata: string,
): Promise<string> {
  const ownerAddress = await tz.signer.publicKeyHash();

  const fullPath = path.join(process.cwd(), 'public', 'fa2_nft_asset.tz');
  const code = await readFile(fullPath)
    .catch((e) => {
      console.error(e)
      throw new Error("FAILED_READ_CONTRACT_FILE");
    });

  const storage = createNftStorage(ownerAddress, metadata);

  console.log(('originating new NFT contract...'));
  const contract = await originateContract(tz as any, code, storage, 'nft')
    .catch((e) => {
      console.error(e)
      throw new Error("FAILED_DEPLOY_CONTRACT");
    });

  return contract.address
}