import { StatusCodes } from 'http-status-codes';
import { Request,Response,NextFunction } from "express";
import { createHotelService, deleteHotelByIdService, getAllHotelsService, getHotelByIdService } from "../service/hotel.service";

export async function createHotelHandler(req : Request, res:Response, next:NextFunction){
     // 1.call the service function
     const hotelResponse = await createHotelService(req.body);
    // 2.send the response
    res.status(StatusCodes.CREATED).json({
        message : "Hotel created successfully",
        data:hotelResponse,
        success:true
    });
}

export async function getHotelByIdHandler(req : Request, res:Response, next:NextFunction){
     // 1.call the service function
     const hotelResponse = await getHotelByIdService(Number(req.params.id));
    // 2.send the response
    res.status(StatusCodes.OK).json({
        message : "Hotel found successfully",
        data:hotelResponse,
        success:true
    });
}

// make a function getAllHotelsHandler to fetch all hotels
export async function getAllHotelsHandler(req : Request, res:Response, next:NextFunction){
        // 1.call the service function
        const hotelsResponse = await getAllHotelsService();
         // 2.send the response
        res.status(StatusCodes.OK).json({
            message : "Hotels fetched successfully",
            data:hotelsResponse,
            success:true
        });
}

export async function d (req : Request, res:Response, next:NextFunction){
    // 1.call the service function
    await deleteHotelByIdService(Number(req.params.id));
    // 2.send the response
    res.status(StatusCodes.OK).json({
        message : "Hotel deleted successfully",
        success:true
    });
}

