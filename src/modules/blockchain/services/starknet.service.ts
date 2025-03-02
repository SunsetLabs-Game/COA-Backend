import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { RpcProvider, Contract, Account, CairoVersion } from 'starknet';
import { ConfigService } from '@/common/config.service';
import { NFTBalanceDto, NFTMetadataDto } from '../dtos/nft.dto';
import { TransferDto } from '../dtos/transfer.dto';
import erc1155Abi from '@/common/Abi';
@Injectable()
export class StarknetService implements OnModuleInit {
  private readonly logger = new Logger(StarknetService.name);
  private provider: RpcProvider;
  private contract: Contract;

  constructor(private readonly configService: ConfigService) { }

  async onModuleInit() {
    try {
      await this.initializeStarknet();
    } catch (error) {
      this.logger.error('Failed to initialize Starknet service', error);
      throw error;
    }
  }

  private async initializeStarknet() {
    // Validate configuration
    const contractAddress = this.configService.contractAddress;
    const walletAddress = this.configService.walletAddress;

    if (!contractAddress) {
      throw new Error('Contract address is not defined in configuration');
    }

    if (!walletAddress) {
      throw new Error('Wallet address is not defined in configuration');
    }

    // Initialize provider
    const nodeUrl = this.configService.getNodeUrl();

    this.provider = new RpcProvider({ nodeUrl });
    this.logger.log(
      `Initialized Starknet provider with network: ${this.configService.starknetNetwork}`,
    );

    try {

      this.contract = new Contract(erc1155Abi, contractAddress, this.provider).typedv2(erc1155Abi);

      this.logger.log('Successfully initialized Starknet contract');
    } catch (error) {
      this.logger.error('Failed to initialize contract', error);
      throw new Error(
        'Failed to initialize Starknet contract: ' + error.message,
      );
    }
  }

  async getBlock(): Promise<any> {
    try {
      return await this.provider.getBlock('latest');
    } catch (error) {
      this.logger.error('Error fetching latest block:', error.message);
      throw new Error('Failed to fetch latest block');
    }
  }

  async getContractStatus(): Promise<any> {
    try {
      const tokenId = { low: BigInt(1), high: BigInt(0) };

      // Ensure walletAddress is properly converted
      const walletAddress = BigInt(
        this.configService.walletAddress.startsWith('0x'),
      );

      const balance = await this.contract.call('balance_of', [
        walletAddress,
        tokenId,
      ]);

      // Convert BigInt results to string before returning
      return JSON.parse(
        JSON.stringify(balance, (_, v) =>
          typeof v === 'bigint' ? v.toString() : v,
        ),
      );
    } catch (error) {
      this.logger.error(`Error fetching contract status: ${error.message}`);
      throw new Error('Failed to fetch contract status');
    }
  }

  async getBalance(account: string, tokenId: string): Promise<NFTBalanceDto> {
    try {
      const balance = await this.contract.call('balance_of', [
        BigInt(account),
        { low: BigInt(tokenId), high: BigInt(0) },
      ]);

      const bal = JSON.parse(
        JSON.stringify(balance, (_, v) =>
          typeof v === 'bigint' ? v.toString() : v,
        ),
      );

      return { account, tokenId, balance: bal };
    } catch (error) {
      this.logger.error(`Error fetching balance: ${error.message}`);
      throw new Error('Failed to fetch balance');
    }
  }

  async getTokenURI(tokenId: string): Promise<NFTMetadataDto> {
    try {
      const uriResponse = await this.contract.callStatic.uri(
        { low: BigInt(tokenId), high: BigInt(0) },
      );

      if (!uriResponse) {
        return { tokenId, uri: "" };
      }

      return { tokenId, uri: uriResponse };
    } catch (error) {
      this.logger.error(`Error fetching token URI: ${error.message}`);
      throw new Error(`Failed to fetch token URI for ID ${tokenId}`);
    }
  }

  async transferNFT(transferDto: TransferDto): Promise<{ hash: string }> {
    try {
      const { to, tokenId, amount = 1 } = transferDto;
  
      // Validate recipient address
      if (!to.startsWith('0x')) {
        throw new Error('Invalid recipient address format: must start with 0x');
      }
  
      // Get admin account from config
      const adminAddress = this.configService.walletAddress;
      const adminPrivateKey = this.configService.walletPrivateKey;
  
      if (!adminPrivateKey) {
        throw new Error('Admin private key is not configured');
      }
  
      // Check the token balance before transfer
      try {
        const balanceResult = await this.getBalance(adminAddress, tokenId);
        const currentBalance = Number(balanceResult.balance);
        
        if (currentBalance < amount) {
          throw new Error(`Insufficient token balance. Available: ${currentBalance}, Requested: ${amount}`);
        }
      } catch (error) {
        this.logger.error(`Error checking token balance: ${error.message}`);
        throw new Error(`Failed to verify token balance: ${error.message}`);
      }
  
      // Create account object for signing
      const account = new Account(
        this.provider,
        adminAddress,
        adminPrivateKey,
        '1'
      );
  
      this.logger.log(`Attempting to transfer ${amount} token(s) with ID ${tokenId} from ${adminAddress} to ${to}`);
  
      // Execute a transfer using the safe_transfer_from entrypoint
      const tx = await account.execute([
        {
          contractAddress: this.contract.address,
          entrypoint: "safe_transfer_from",
          calldata: [
            adminAddress,  // from
            to,            // to
            tokenId,       // token_id low
            "0",           // token_id high
            amount.toString(),  // value low (amount of tokens)
            "0",           // value high
            "0"            // empty data array length
          ]
        }
      ]);
  
      // Wait for transaction confirmation
      try {
        const receipt = await this.provider.waitForTransaction(tx.transaction_hash, { retryInterval: 2000 });
        this.logger.log(`Transaction receipt received: ${JSON.stringify(receipt)}`);
        
        if (receipt.execution_status !== 'SUCCEEDED') {
          throw new Error(`Transaction failed with status: ${receipt.execution_status}`);
        }
      } catch (error) {
        this.logger.error(`Transaction confirmation failed: ${error.message}`);
        throw new Error(`Transaction could not be confirmed: ${error.message}`);
      }
  
      this.logger.log(
        `Successfully transferred ${amount} token(s) with ID ${tokenId} from ${adminAddress} to ${to}. Transaction hash: ${tx.transaction_hash}`,
      );
  
      return { hash: tx.transaction_hash };
    } catch (error) {
      this.logger.error(`Error transferring token: ${error.message}`, error.stack);
      throw new Error(`Failed to transfer token ${transferDto.tokenId}: ${error.message}`);
    }
  }
}
