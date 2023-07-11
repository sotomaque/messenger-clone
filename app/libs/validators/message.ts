import { z } from 'zod';

export const MessageValidator = z.object({
  message: z.string().min(1).max(1000),
  conversationId: z.string(),
  image: z.string().optional(),
});

export type MessageValidatorType = z.infer<typeof MessageValidator>;
