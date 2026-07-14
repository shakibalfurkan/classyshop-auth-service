import { v4 as uuidv4 } from "uuid";
import type { PrismaTransaction } from "../types/database.types.js";
import type { TDomainEvent } from "./eventTypes.js";
import { KafkaTopics } from "../config/kafka.js";
import { prisma } from "../lib/prisma.js";

// ─── Topic Router ───
const eventTopicMap: Record<
  string,
  (typeof KafkaTopics)[keyof typeof KafkaTopics]
> = {
  "user.registered": KafkaTopics.DOMAIN_EVENTS,
  "user.deleted": KafkaTopics.DOMAIN_EVENTS,
  "user.hard_deleted": KafkaTopics.DOMAIN_EVENTS,
  "user.restored": KafkaTopics.DOMAIN_EVENTS,
  "user.profile_updated": KafkaTopics.DOMAIN_EVENTS,
  "user.password_changed": KafkaTopics.DOMAIN_EVENTS,
  "user.email_changed": KafkaTopics.DOMAIN_EVENTS,
  "user.role_changed": KafkaTopics.DOMAIN_EVENTS,
  "user.locked": KafkaTopics.DOMAIN_EVENTS,
  "user.unlocked": KafkaTopics.DOMAIN_EVENTS,
  "order.placed": KafkaTopics.DOMAIN_EVENTS,
  "payment.succeeded": KafkaTopics.DOMAIN_EVENTS,
  "dead_letter.event": KafkaTopics.DLQ,
};

export function resolveTopic(eventName: string): string {
  const topic = eventTopicMap[eventName];
  if (!topic) {
    return KafkaTopics.DOMAIN_EVENTS;
  }
  return topic;
}

// ─── Outbox Writer ───

export async function writeOutboxEvent(
  event: TDomainEvent,
  tx?: PrismaTransaction,
  traceparent?: string,
): Promise<string> {
  const id = uuidv4();

  const prismaClient = tx ? tx : prisma;

  await prismaClient.outboxEvent.create({
    data: {
      id,
      aggregateId: event.aggregateId,
      eventType: event.eventName,
      payload: event as any,
      traceparent: traceparent ?? null,
      status: "PENDING",
      retryCount: 0,
      maxRetries: 5,
    },
  });

  return id;
}

export async function emitDomainEvent(
  event: TDomainEvent,
  tx?: PrismaTransaction,
  traceparent?: string,
): Promise<string> {
  return writeOutboxEvent(event, tx, traceparent);
}
