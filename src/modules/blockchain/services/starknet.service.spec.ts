import { Test, TestingModule } from '@nestjs/testing';
import { StarknetService } from './starknet.service';
import { ConfigService } from '../../../common/config.service';
import { TransferDto } from '../dtos/transfer.dto';

// Mock the dependencies
jest.mock('starknet', () => {
  const originalModule = jest.requireActual('starknet');
  
  return {
    ...originalModule,
    RpcProvider: jest.fn().mockImplementation(() => ({
      getBlock: jest.fn().mockResolvedValue({ block_hash: "0x1234" }),
      waitForTransaction: jest.fn().mockResolvedValue({ execution_status: 'SUCCEEDED' })
    })),
    Account: jest.fn().mockImplementation(() => ({
      execute: jest.fn().mockResolvedValue({ transaction_hash: '0xabcd1234' })
    })),
    Contract: jest.fn().mockImplementation(() => ({
      call: jest.fn().mockImplementation((method, args) => {
        if (method === "balance_of") {
          return [{ low: BigInt(100), high: BigInt(0) }]; // Mock a balance of 100 tokens
        } else if (method === "uri") {
          return [{ data: ["68747470733a2f2f6578616d706c652e636f6d2f6e66742e6a7067"] }];
        }
      })
    }))
  };
});

describe('StarknetService', () => {
  let service: StarknetService;
  let configService: ConfigService;

  const TEST_ACCOUNT = "0x040811bb6636316c9f1809e2898285976d2a0db66e33703defbfb0c7572b87ad"; 
  const TEST_CONTRACT = "0x040811bb6636316c9f1809e2898285976d2a0db66e33703defbfb0c7572b87ad";
  const TEST_PRIVATE_KEY = "0x0363c39930af5bfd1890d94963a503fec02cc4965080517dc2888c1671a5e25a";

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StarknetService,
        {
          provide: ConfigService,
          useValue: {
            starknetNetwork: "sepolia-alpha",
            contractAddress: TEST_CONTRACT,
            walletAddress: TEST_ACCOUNT,
            walletPrivateKey: TEST_PRIVATE_KEY,
            getNodeUrl: () => "https://starknet-sepolia.public.blastapi.io"
          }
        }
      ],
    }).compile();

    service = module.get<StarknetService>(StarknetService);
    configService = module.get<ConfigService>(ConfigService);
    
    // Initialize the service
    await service.onModuleInit();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('transferNFT', () => {
    it('should transfer a single token successfully', async () => {
      const transferDto: TransferDto = {
        to: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        tokenId: '1'
      };

      const result = await service.transferNFT(transferDto);
      
      expect(result).toBeDefined();
      expect(result.hash).toBe('0xabcd1234');
    });

    it('should transfer multiple tokens successfully', async () => {
      const transferDto: TransferDto = {
        to: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        tokenId: '1',
        amount: 5
      };

      const result = await service.transferNFT(transferDto);
      
      expect(result).toBeDefined();
      expect(result.hash).toBe('0xabcd1234');
    });

    it('should throw an error with invalid recipient address', async () => {
      const transferDto: TransferDto = {
        to: 'invalid-address',
        tokenId: '1',
        amount: 1
      };

      await expect(service.transferNFT(transferDto)).rejects.toThrow('Invalid recipient address');
    });

    it('should throw an error when trying to transfer more tokens than available', async () => {
      // Mock the getBalance method to return a smaller balance
      jest.spyOn(service, 'getBalance').mockResolvedValueOnce({
        account: TEST_ACCOUNT,
        tokenId: '1',
        balance: 5
      });

      const transferDto: TransferDto = {
        to: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        tokenId: '1',
        amount: 10 // More than available
      };

      await expect(service.transferNFT(transferDto)).rejects.toThrow('Insufficient token balance');
    });

    it('should throw an error when transaction confirmation fails', async () => {
      // Mock the provider to simulate a failed transaction
      const mockProvider = {
        waitForTransaction: jest.fn().mockResolvedValue({ execution_status: 'REJECTED' })
      };
      
      jest.spyOn(service as any, 'provider', 'get').mockReturnValue(mockProvider);

      const transferDto: TransferDto = {
        to: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        tokenId: '1',
        amount: 1
      };

      await expect(service.transferNFT(transferDto)).rejects.toThrow('Transaction failed with status');
    });
  });
});