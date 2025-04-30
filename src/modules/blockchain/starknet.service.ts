import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { cairo } from 'starknet';
import { config } from '../../common/config';
import utils from './utils';

@Injectable()
export class Starknet {
  async getBlock(): Promise<any> {
    try {
      return await utils.initializeProvider().getBlock('latest');
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getContractStatus(): Promise<any> {
    try {
      const tokenId = { low: BigInt(1), high: BigInt(0) };
      const walletAddress = BigInt(config.walletAddress);
      const balance = await utils
        .initializeContract()
        .call('balance_of', [walletAddress, tokenId]);

      return this.formatBigInts(balance);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getBalance(account: string, tokenId: string): Promise<any> {
    try {
      const balance = await utils
        .initializeContract()
        .call('Balance_of', [BigInt(account), cairo.uint256(BigInt(tokenId))]);
      return this.formatBigInts(balance);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getTokenURI(tokenId: string): Promise<any> {
    try {
      return await utils
        .initializeContract()
        .callStatic.uri(cairo.uint256(BigInt(tokenId)));
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async mintFToken(
    account: string,
    tokenId: string,
    amount: number,
  ): Promise<string> {
    try {
      if (!account) {
        throw new Error('Account is required for minting FT');
      }

      const mintCall = {
        contractAddress: utils.initializeContract().address,
        entrypoint: 'mint_FT',
        calldata: [
          account,
          cairo.uint256(BigInt(tokenId)),
          cairo.uint256(BigInt(amount)),
        ],
      };

      const { transaction_hash: mintTxHash } = await utils
        .initializeAccount()
        .execute(mintCall);
      await utils.initializeProvider().waitForTransaction(mintTxHash);
      return mintTxHash;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async mintNFToken(account: string, tokenId: string): Promise<string> {
    try {
      if (!account) {
        throw new Error('Account is required for minting NFT');
      }

      const mintCall = {
        contractAddress: utils.initializeContract().address,
        entrypoint: 'mint_NFT',
        calldata: [account, cairo.uint256(BigInt(tokenId))],
      };

      const { transaction_hash: mintTxHash } = await utils
        .initializeAccount()
        .execute(mintCall);

      await utils.initializeProvider().waitForTransaction(mintTxHash);
      return mintTxHash;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async transferNFT(
    to: string,
    tokenId: string,
    amount: number,
  ): Promise<string> {
    try {
      const account = utils.initializeAccount();
      const balance = await this.getBalance(config.walletAddress, tokenId);

      if (BigInt(balance) === BigInt(0)) {
        throw new Error(`Sender does not have token ${tokenId}`);
      }

      const calldata = [
        config.walletAddress,
        to,
        cairo.uint256(BigInt(tokenId)),
        cairo.uint256(BigInt(amount)),
        0,
      ];

      const tx = await account.execute([
        {
          contractAddress: config.contractAddress,
          entrypoint: 'safe_transfer_from',
          calldata,
        },
      ]);

      return tx.transaction_hash;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async batchMint(
    tokenIds: string[],
    amounts: number[],
    recipient?: string,
  ): Promise<string> {
    try {
      if (tokenIds.length !== amounts.length) {
        throw new Error(
          'tokenIds and amounts arrays must have the same length',
        );
      }

      const account = utils.initializeAccount();
      const recipientAddress = recipient || config.walletAddress;

      const flattenedTokenIds = tokenIds
        .map((id) => cairo.uint256(BigInt(id)))
        .flatMap((u256) => Object.values(u256));

      const flattenedAmounts = amounts
        .map((amt) => cairo.uint256(BigInt(amt)))
        .flatMap((u256) => Object.values(u256));

      const mintCall = {
        contractAddress: config.contractAddress,
        entrypoint: 'Batch_mint',
        calldata: [
          recipientAddress,
          tokenIds.length.toString(),
          ...flattenedTokenIds,
          amounts.length.toString(),
          ...flattenedAmounts,
          '0',
        ],
      };

      const { transaction_hash: mintTxHash } = await account.execute(mintCall);
      await utils.initializeProvider().waitForTransaction(mintTxHash);
      return mintTxHash;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  private formatBigInts(data: any): any {
    return JSON.parse(
      JSON.stringify(data, (_, v) =>
        typeof v === 'bigint' ? v.toString() : v,
      ),
    );
  }
}
