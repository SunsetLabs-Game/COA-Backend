import { Controller, Get, Post, Body, Param, Res } from '@nestjs/common';
import { Starknet } from './starknet.service';
import { Response } from 'express';

@Controller('starknet')
export class StarknetController {
  constructor(private readonly contractService: Starknet) {}

  @Get('block')
  async getBlock(@Res() res: Response) {
    try {
      const block = await this.contractService.getBlock();
      return res.status(200).json(block);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  @Get('uri')
  async getUri(@Body('tokenId') tokenId: string, @Res() res: Response) {
    try {
      const uri = await this.contractService.getTokenURI(tokenId);

      return res.status(200).json(uri);
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  }

  @Get('contract-status')
  async getContractStatus(@Res() res: Response) {
    try {
      const status = await this.contractService.getContractStatus();
      return res.status(200).json(status);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  @Get('balance/:account/:tokenId')
  async getBalance(
    @Param('account') account: string,
    @Param('tokenId') tokenId: string,
    @Res() res: Response,
  ) {
    try {
      const balance = await this.contractService.getBalance(account, tokenId);
      return res.status(200).json(balance);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  @Post('mint/FT')
  async mint(
    @Body('recipient') recipient: string,
    @Body('tokenId') tokenId: string,
    @Body('amount') amount: number,
    @Res() res: Response,
  ) {
    try {
      const txHash = await this.contractService.mintFToken(
        recipient,
        tokenId,
        amount,
      );
      return res.status(200).json({
        message: 'Fungable Token minted successfully',
        hash: txHash,
        explorer: `https://sepolia.starkscan.co/tx/${txHash}`,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: `FT Minting failed: ${error.message}` });
    }
  }

  @Post('mint/NFT')
  async mintNFT(
    @Body('recipient') recipient: string,
    @Body('tokenId') tokenId: string,
    @Res() res: Response,
  ) {
    try {
      const txHash = await this.contractService.mintNFToken(recipient, tokenId);
      return res.status(200).json({
        message: 'Non_Fungable_Token_mintedsuccessfully',
        hash: txHash,
        explorer: `https://sepolia.starkscan.co/tx/${txHash}`,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: `NFTMinting_failed: ${error.message}` });
    }
  }

  @Post('batch/mint')
  async batchMint(
    @Body('tokenIds') tokenIds: string[],
    @Body('amounts') amounts: number[],
    @Body('recipient') recipient: string,
    @Res() res: Response,
  ) {
    if (!tokenIds || !amounts) {
      return res.status(400).json({
        message: 'Both_tokenIds_and_amountsarrays_are_required',
      });
    }

    if (!Array.isArray(tokenIds) || !Array.isArray(amounts)) {
      return res.status(400).json({
        message: 'tokenIds and amounts must be arrays',
      });
    }

    if (tokenIds.length !== amounts.length) {
      return res.status(400).json({
        message: 'tokenIds and amounts arrays must have the same length',
      });
    }

    try {
      const txHash = await this.contractService.batchMint(
        tokenIds,
        amounts,
        recipient,
      );
      return res.status(200).json({
        message: 'Tokens_batchminted_successfully',
        hash: txHash,
        explorer: `https://sepolia.starkscan.co/tx/${txHash}`,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: `Batch mint failed: ${error.message}` });
    }
  }

  @Post('transfer')
  async transferNFT(
    @Body('to') to: string,
    @Body('tokenId') tokenId: string,
    @Body('amount') amount: number,
    @Res() res: Response,
  ) {
    try {
      const txHash = await this.contractService.transferNFT(
        to,
        tokenId,
        amount,
      );
      return res.status(200).json({
        message: 'Token transferred successfully',
        hash: txHash,
        explorer: `https://sepolia.starkscan.co/tx/${txHash}`,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: `Transfer failed: ${error.message}` });
    }
  }
}
