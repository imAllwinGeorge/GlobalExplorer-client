import type { VideoEvents } from "../shared/types/videoCallEvent";
import { EventBus } from "./eventBus";


export const eventBus = new EventBus<VideoEvents>();
