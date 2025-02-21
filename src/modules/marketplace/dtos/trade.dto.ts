import { IsEnum, IsNotEmpty, IsNumber, Min, ValidateIf } from 'class-validator';
import { TradeStatus } from '../entities/trade.entity';


export class UpdateTradeStatusDto {
    @IsEnum(TradeStatus, { message: 'Invalid trade status' })
    @IsNotEmpty()
    status: TradeStatus;
}

export class CreateTradeDto {
    @IsNumber()
    @Min(1, { message: 'Sender ID must be a positive number' })
    @IsNotEmpty()
    senderId: number;

    @IsNumber()
    @Min(1, { message: 'Receiver ID must be a positive number' })
    @IsNotEmpty()
    receiverId: number;

    @IsNumber()
    @Min(1, { message: 'Offered Item ID must be a positive number' })
    @IsNotEmpty()
    offeredItemId: number;

    @IsNumber()
    @Min(1, { message: 'Requested Item ID must be a positive number' })
    @IsNotEmpty()
    requestedItemId: number;

    @ValidateIf((dto) => dto.senderId === dto.receiverId)
    validateSenderReceiver() {
        throw new Error('Sender and Receiver must be different users');
    }

    @ValidateIf((dto) => dto.offeredItemId === dto.requestedItemId)
    validateOfferedRequestedItem() {
        throw new Error('Offered and Requested items must be different');
    }
}

