import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Get,
} from '@nestjs/common';
import { LootboxService } from '@/modules/marketplace/services/lootbox.service';
import { CreateLootboxDto } from '@/modules/marketplace/dtos/lootbox.dto';

@Controller('lootboxes')
export class LootboxController {
  constructor(private readonly lootboxService: LootboxService) {}

  @Post('purchase')
  async purchaseLootbox(@Body() createLootboxDto: CreateLootboxDto) {
    const lootbox = await this.lootboxService.purchaseLootbox(createLootboxDto);
    return lootbox;
  }

  @Post('open/:id')
  async openLootbox(@Param('id', ParseIntPipe) id: number) {
    const result = await this.lootboxService.openLootbox(id);
    return result;
  }

  @Get(':id')
  async getLootbox(@Param('id', ParseIntPipe) id: number) {
    return await this.lootboxService.getLootboxById(id);
  }
}
