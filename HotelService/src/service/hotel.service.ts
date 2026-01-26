import { createHotelDTO } from "../dto/hotel.dto";
import { createHotel, deleteHotelById, getAllHotels, getHotelById } from "../repositories/hotel.repositories";

// we can add additional business logic here if needed in future
export async function createHotelService(hotelData: createHotelDTO) {
    const hotel= await createHotel(hotelData);
    return hotel;
}

export async function getHotelByIdService(id: number) {
    const hotel = await getHotelById(id);
    return hotel;
}

// add a function getAllHotelsService to fetch all hotels
export async function getAllHotelsService() {
    const hotels = await getAllHotels();
    return hotels;
}

export async function deleteHotelByIdService(id: number) {
    await deleteHotelById(id);
    return;
}
    
