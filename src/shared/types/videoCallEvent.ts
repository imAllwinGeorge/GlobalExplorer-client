// src/shared/videoCallEvents.ts
export interface CallRequestPayload {
  callerId: string;
  callerName?: string;
  calleeId: string;
  callId?: string;
}

export interface OfferPayload {
  sdp: RTCSessionDescriptionInit;
  callerId: string;
  calleeId: string;
}

export interface AnswerPayload {
  sdp: RTCSessionDescriptionInit;
  callerId: string;
  calleeId: string;
}

export interface IceCandidatePayload {
  candidate: RTCIceCandidateInit;
  from: string;
  to: string;
}

export interface CallAcceptPayload {
  callerId: string;
  calleeId: string;
}

export interface CallRejectPayload {
  callerId: string;
  calleeId: string;
}

export interface CallEndPayload {
  from: string;
  to: string;
}

export type VideoEvents = {
  CALL_REQUEST: CallRequestPayload;
  OFFER: OfferPayload;
  ANSWER: AnswerPayload;
  ICECANDIDATE: IceCandidatePayload;
  CALL_ACCEPT: CallAcceptPayload;
  CALL_REJECT: CallRejectPayload;
  CALL_END: CallEndPayload;
};
