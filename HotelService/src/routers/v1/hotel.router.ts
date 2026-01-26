import express from 'express';
import { validateRequestBody } from '../../validators';
import { hotelSchema } from '../../validators/hotel.validator';
import { createHotelHandler, getHotelByIdHandler,getAllHotelsHandler, deleteHotelByIdHandler } from '../../controllers/hotel.controller';

const hotelRouter = express.Router();

hotelRouter.post('/',validateRequestBody(hotelSchema), createHotelHandler); // TODO: Resolve this TS compilation issue

hotelRouter.get('/:id', getHotelByIdHandler);

// add a route to get all hotels
hotelRouter.get('/', getAllHotelsHandler);

hotelRouter.delete('/:id', deleteHotelByIdHandler);




export default hotelRouter;  