import { Job, Worker } from "bullmq";
import { getRedisConnObject } from "../config/redis.config";
import { NotificationDTO } from "../dto/notification.dto";
import { MAILER_QUEUE } from "../queues/mailer.queue";
import { MAILER_PAYLOAD } from "../producers/email.producer";

export const setupMailerWorker = () => {

  const emailProcessor = new Worker<NotificationDTO>(
    MAILER_QUEUE, 
    async (job : Job) => {
        if(job.name !== MAILER_PAYLOAD){
            throw new Error("Invalid job name");
        }
        // call the service layer from here
        const  payload = job.data;
        console.log(`Processing email with payload: ${JSON.stringify(payload)}`);
        
    },
    {
      connection:  getRedisConnObject(),
    },
  );

  emailProcessor.on("failed", (job) => {
    console.error("Email processing failed");
  });

  emailProcessor.on("completed", (job) => {
    console.log("Email processing completed");
  });
}
