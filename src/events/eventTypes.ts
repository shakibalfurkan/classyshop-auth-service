export const DomainEventTypes = {
  USER_REGISTERED: "user.registered",
  USER_DELETED: "user.deleted",
  USER_HARD_DELETED: "user.hard_deleted",
  USER_RESTORED: "user.restored",
  USER_PROFILE_UPDATED: "user.profile_updated",
  USER_PASSWORD_CHANGED: "user.password_changed",
  USER_EMAIL_CHANGED: "user.email_changed",
  USER_ROLE_CHANGED: "user.role_changed",
  USER_LOCKED: "user.locked",
  USER_UNLOCKED: "user.unlocked",
  ORDER_PLACED: "order.placed",
  PAYMENT_SUCCEEDED: "payment.succeeded",
} as const;

export const CommandTypes = {
  GENERATE_PDF_INVOICE: "generate.pdf_invoice",
  SYNC_USER_TO_CRM: "sync.user_to_crm",
} as const;

export const NotificationTypes = {
  EMAIL_SEND_WELCOME: "email.send_welcome",
  SMS_SEND_OTP: "sms.send_otp",
} as const;

export const DLQEventTypes = {
  DEAD_LETTER_EVENT: "dead_letter.event",
} as const;
