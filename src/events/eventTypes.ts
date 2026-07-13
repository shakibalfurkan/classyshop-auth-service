import { z } from "zod";
import { UserRoles } from "../generated/prisma/enums.js";

// ─── Event Name Constants ───
export const DomainEventTypes = {
  EMAIL_VERIFICATION_OTP_SENT: "email.verification.otp.sent",
  PASSWORD_RESET_REQUESTED: "password.reset.requested",
} as const;

export const DLQEventTypes = {
  DEAD_LETTER_EVENT: "dead_letter.event",
} as const;

export type TDomainEventType =
  (typeof DomainEventTypes)[keyof typeof DomainEventTypes];

// ─── Event Payload Schemas (Zod-validated) ───

const EmailVerificationOtpSchema = z.object({
  eventName: z.literal(DomainEventTypes.EMAIL_VERIFICATION_OTP_SENT),
  aggregateId: z.uuid(),
  payload: z.object({
    firstName: z.string(),
    email: z.email(),
    role: z.enum([UserRoles.SELLER, UserRoles.CUSTOMER]),
  }),
  metadata: z.object({
    emittedAt: z.iso.datetime(),
    source: z.string().default("auth-service"),
    version: z.number().int().positive().default(1),
  }),
});

export type EmailVerificationOtpEvent = z.infer<
  typeof EmailVerificationOtpSchema
>;

const PasswordResetRequestedSchema = z.object({
  eventName: z.literal(DomainEventTypes.PASSWORD_RESET_REQUESTED),
  aggregateId: z.uuid(),
  payload: z.object({
    email: z.email(),
    credentialId: z.uuid(),
    resetToken: z.string(),
  }),
  metadata: z.object({
    emittedAt: z.iso.datetime(),
    source: z.string().default("auth-service"),
    version: z.number().int().positive().default(1),
  }),
});

export type PasswordResetRequestedEvent = z.infer<
  typeof PasswordResetRequestedSchema
>;

// ─── Union Type for All Domain Events ───
export const DomainEventSchema = z.discriminatedUnion("eventName", [
  EmailVerificationOtpSchema,
  PasswordResetRequestedSchema,
]);

export type TDomainEvent = z.infer<typeof DomainEventSchema>;

// ─── Helper to create event metadata ───

export function createEventMetadata(): {
  emittedAt: string;
  source: string;
  version: number;
} {
  return {
    emittedAt: new Date().toISOString(),
    source: "auth-service",
    version: 1,
  };
}
