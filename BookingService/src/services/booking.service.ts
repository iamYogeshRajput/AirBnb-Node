
import { CreateBookingDTO } from '../dto/booking.dto';
import { confirmBooking, createBooking, createIdempotencyKey, finalizeIdempotencyKey, getIdempotencyKey } from '../repositories/booking.repositories';
import { BadRequestError, NotFoundError } from '../utils/errors/app.error';
import { generateIdempotencyKey } from '../utils/generateIdempotencyKey';

export async function createBookingService(createBookingDTO:CreateBookingDTO) {
    const booking = await createBooking({
        userId:createBookingDTO.userId,
        hotelId:createBookingDTO.hotelId,
        totalGuest:createBookingDTO.totalGuests,
        bookingAmount:createBookingDTO.bookingAmount,
    });
    const IdempotencyKey= generateIdempotencyKey();
    await createIdempotencyKey(IdempotencyKey,booking.id);

    return {
        bookingId:booking.id,
        idempotencyKey:IdempotencyKey,
    };
}

export async function confirmBookingService(idempotencyKey:string){
    // Finalize the idempotency key
    const idempotencyKeyData = await getIdempotencyKey(idempotencyKey);
    if(!idempotencyKeyData){
        throw new NotFoundError("Idempotency key not found");
    }
    if(idempotencyKeyData.finalizedAt){
        throw new BadRequestError("Idempotency key already finalized"); 
    }   
    const booking = await confirmBooking(idempotencyKeyData.bookingId);
    await finalizeIdempotencyKey(idempotencyKey);
    return booking;
}