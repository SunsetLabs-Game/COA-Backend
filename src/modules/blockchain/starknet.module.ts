import { Module } from '@nestjs/common';
import { Starknet } from './starknet.service';
import { StarknetController } from './starknet.controller';

@Module({
  providers: [Starknet],
  controllers: [StarknetController],
  exports: [Starknet],
})
export class StarknetModule {}
