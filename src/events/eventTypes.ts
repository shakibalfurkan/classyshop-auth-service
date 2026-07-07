export const DomainEventTypes = {
  USER_REGISTERED: "user.registered",
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
