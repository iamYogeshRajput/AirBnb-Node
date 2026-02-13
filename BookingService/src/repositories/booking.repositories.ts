import { Prisma, IdempotencyKey } from "@prisma/client";
import prismaClient from "../prisma/client";
import { validate as isValidUUID } from "uuid";
import { BadRequestError, NotFoundError } from "../utils/errors/app.error";

export async function createBooking(bookingInput: Prisma.BookingCreateInput) {
  const booking = await prismaClient.booking.create({
    data: bookingInput,
  });
  return booking;
}

export async function createIdempotencyKey(key: string, bookingId: number) {
  const idempotencyKey = await prismaClient.idempotencyKey.create({
    data: {
      idemKey: key,
      booking: {
        connect: {
          id: bookingId,
        },
      },
    },
  });
  return idempotencyKey;
}
export async function getIdempotencyKeyWithLock(
  tx: Prisma.TransactionClient,
  key: string,
) {
  if (!isValidUUID(key)) {
    throw new BadRequestError("Invalid idempotency key");
  }
  const idempotencyKey: Array<IdempotencyKey> = await tx.$queryRaw`
        SELECT * FROM IdempotencyKey 
        WHERE idemKey = ${key} 
        FOR UPDATE;
    `;
  console.log("idempotencyKey", idempotencyKey);
  if (!idempotencyKey || idempotencyKey.length === 0) {
    throw new NotFoundError("Idempotency key not found");
  }

  return idempotencyKey[0];
}

export async function getBookingById(bookingId: number) {
  const booking = await prismaClient.booking.findUnique({
    where: {
      id: bookingId,
    },
  });
  return booking;
}

export async function confirmBooking(
  tx: Prisma.TransactionClient,
  bookingId: number,
) {
  const booking = await tx.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status: "CONFIRMED",
    },
  });
  return booking;
}

export async function cancelBooking(bookingId: number) {
  const booking = await prismaClient.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status: "CANCELLED",
    },
  });
  return booking;
}

export async function finalizeIdempotencyKey(
  tx: Prisma.TransactionClient,
  key: string,
) {
  const idempotencyKey = await tx.idempotencyKey.update({
    where: {
      idemKey: key,
    },
    data: {
      finalizedAt: true,
    },
  });
  return idempotencyKey;
}

// 1. booking => idempotencykey   this will make two db calls first for booking then for idempotency key ( bad user experience as things will take time)
// 2. booking | idempptencyKey + update IdempotencyKey add the bookings ( we need to keep retry mechanism here as maybe the  update fails)
