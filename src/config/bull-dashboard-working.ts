import { Elysia } from "elysia";
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ElysiaAdapter } from '@bull-board/elysia';
import { videoEncodeQueue } from '../modules/video/queue/videoEncodeWorker';

// Create a separate Elysia app for Bull Dashboard
const createBullDashboard = () => {
  const serverAdapter = new ElysiaAdapter();
  
  createBullBoard({
    queues: [new BullMQAdapter(videoEncodeQueue)],
    serverAdapter,
  });

  // Return the plugin directly
  return serverAdapter.registerPlugin();
};

export const bullDashboard = createBullDashboard();