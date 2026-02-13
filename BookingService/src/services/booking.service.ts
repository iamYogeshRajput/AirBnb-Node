import { CreateBookingDTO } from "../dto/booking.dto";
import {
  confirmBooking,
  createBooking,
  createIdempotencyKey,
  finalizeIdempotencyKey,
  getIdempotencyKeyWithLock,
} from "../repositories/booking.repositories";
import { BadRequestError, NotFoundError } from "../utils/errors/app.error";
import { generateIdempotencyKey } from "../utils/generateIdempotencyKey";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function createBookingService(createBookingDTO: CreateBookingDTO) {
  const booking = await createBooking({
    userId: createBookingDTO.userId,
    hotelId: createBookingDTO.hotelId,
    totalGuest: createBookingDTO.totalGuests,
    bookingAmount: createBookingDTO.bookingAmount,
  });
  const IdempotencyKey = generateIdempotencyKey();
  await createIdempotencyKey(IdempotencyKey, booking.id);

  return {
    bookingId: booking.id,
    idempotencyKey: IdempotencyKey,
  };
}

export async function confirmBookingService(idempotencyKey: string) {
  // Finalize the idempotency key
  return await prisma.$transaction(async (tx) => {
    const idempotencyKeyData = await getIdempotencyKeyWithLock(tx,idempotencyKey);
    if (!idempotencyKeyData || !idempotencyKeyData.bookingId) {
      throw new NotFoundError("Idempotency key not found");
    }
    if (idempotencyKeyData.finalizedAt) {
      throw new BadRequestError("Idempotency key already finalized");
    }
    const booking = await confirmBooking(tx,idempotencyKeyData.bookingId);
    await finalizeIdempotencyKey(tx,idempotencyKey);
    return booking;
  });
}
