import logger from "../config/logger.config";
import Hotel from "../db/models/hotel";
import { createHotelDTO } from "../dto/hotel.dto";
import { NotFoundError } from "../utils/errors/app.error";


export async function createHotel(hotelData: createHotelDTO ) {
    const hotel = await Hotel.create({
        name: hotelData.name,
        address: hotelData.address,
        location: hotelData.location,
        rating: hotelData.rating || 0,
        ratingCount: hotelData.ratingCount || 0,
    });
    logger.info(`Hotel created successfully: ${hotel.id}`);
    return hotel;
}    
export async function getHotelById(id:number){
    const hotel = await Hotel.findByPk(id);
    if(!hotel){
        logger.error(`Hotel not found with id: ${id}`);
        throw new NotFoundError('Hotel not found');
    }
    return hotel;
}

export async function getAllHotels(){
    const hotels = await Hotel.findAll();
    logger.info(`Fetched all hotels, count: ${hotels.length}`);
    return hotels;
}


export async function deleteHotelById(id: number) {
    const hotel = await getHotelById(id);
    await hotel.destroy();
    logger.info(`Hotel deleted successfully: ${id}`);
    return;
}
