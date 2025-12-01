import type { FastifyReply, FastifyRequest } from "fastify";
import { createTransactionsSchema } from "../../schemas/transaction.schema";
import prisma from "../../config/prisma";

const createTransaction = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  const userId = request.userId; // This should come from authenticated user context

  if (!userId) {
    reply.status(401).send({ message: "Unauthorized" });
    return;
  }

  const result = createTransactionsSchema.safeParse(request.body);

  if (!result.success) {
    const errorMessage =
      result.error.issues && result.error.issues.length > 0
        ? result.error.issues[0].message
        : "Invalid input data";

    return reply.status(400).send({ errors: errorMessage });
  }

  const transaction = result.data;

  try {
    const category = await prisma.category.findUnique({
      where: {
        id: transaction.categoryId,
        type: transaction.type as any,
      },
    });

    if (!category) {
      return reply.status(400).send({ error: "Invalid category for the transaction type" });
    }

    const parsedDate = new Date(transaction.date);

    if (isNaN(parsedDate.getTime())) {
      return reply.status(400).send({ error: "Invalid date format" });
    }

    const newTransaction = await prisma.transaction.create({
      data: {
        ...transaction,
        userId,
        date: parsedDate,
        type: transaction.type as any,
      },
      include: {
        category: true,
      },
    });

    reply.status(201).send(newTransaction);
  } catch (error) {
    request.log.error(" Error creating transaction: ");
    reply.status(500).send({ error: "Internal Server Error" });
  }
};

export default createTransaction;
