import { z } from "zod";
import { ObjectId } from "mongodb";
import { TransactionType } from "../generated/prisma/client";

const isValidObjectId = (id: string): boolean => ObjectId.isValid(id);

const transactionTypes = Object.values(TransactionType) as [string, string];

export const createTransactionsSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.number().positive("Amount must be a positive number"),
  date: z.coerce.date().refine(Boolean, {
    message: "Date is required",
  }),
  categoryId: z.string().refine(isValidObjectId, { message: "Invalid category ID" }),
  type: z.enum(transactionTypes),
  
});

export const getTransactionsSchema = z.object({
    month: z.number().optional(),
    year: z.number().optional(),
    type: z.enum(transactionTypes).refine(
    (val) => transactionTypes.includes(val),
    { message: "Invalid transaction type" }
  ).optional(),
  categoryId: z.string().refine(isValidObjectId, { message: "Invalid category ID" }).optional()

})

export const getTransactionsSummarySchema = z.object({
    month: z.number({message: "Month is required"}),
    year: z.number({message: "Year is required"}),
});

export const getHistoricalTransactionsSchema = z.object({
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2000).max(2100),
  months: z.coerce.number().min(1).max(12).optional(),
});

export const deleteTransactionSchema = z.object({
  id: z.string().refine(isValidObjectId, { message: "Invalid transaction ID" }),
});

export type GetHistoricalTransactionsQuery = z.infer<typeof getHistoricalTransactionsSchema>;
export type GetTransactionsQuery = z.infer<typeof getTransactionsSchema>;
export type GetTransactionsSummaryQuery = z.infer<typeof getTransactionsSummarySchema>;
export type DeleteTransactionParams = z.infer<typeof deleteTransactionSchema>;