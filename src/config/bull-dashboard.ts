import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ElysiaAdapter } from '@bull-board/elysia';
import { videoEncodeQueue } from '../@modules/video/queue/videoEncodeWorker';

// Create the Bull Dashboard with the video encode queue
const serverAdapter = new ElysiaAdapter();

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [new BullMQAdapter(videoEncodeQueue)],
  serverAdapter,
});

export { serverAdapter, addQueue, removeQueue, setQueues, replaceQueues };