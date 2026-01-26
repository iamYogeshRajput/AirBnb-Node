import express from 'express';
import pingRouter from './ping.router';
import hotelRouter from './hotel.router';

const v1Router = express.Router();



v1Router.use('/ping',  pingRouter);

v1Router.use('/hotels', hotelRouter); // Use require to import CommonJS module
export default v1Router;