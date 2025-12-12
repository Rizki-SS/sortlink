import Cache from "ioredis-cache";
import { redisClient } from "./redis";

export const cache = new Cache(redisClient);