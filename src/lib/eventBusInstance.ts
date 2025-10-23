// src/lib/eventBusInstance.ts
import { EventBus } from "@/lib/eventBus";
import type { VideoEvents } from "@/shared/types/videoCallEvent";

export const eventBus = new EventBus<VideoEvents>();
