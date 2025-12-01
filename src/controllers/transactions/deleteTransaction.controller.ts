import { FastifyReply, FastifyRequest } from "fastify";
import { DeleteTransactionParams } from "../../schemas/transaction.schema";
import prisma from "../../config/prisma";



export const deleteTransaction = async (
    request: FastifyRequest<{ Params: DeleteTransactionParams}>,
    reply: FastifyReply

): Promise<void> => {
     const userId = request.userId; // This should come from authenticated user context

     const { id } = request.params;

     if (!userId) {
    reply.status(401).send({ message: "Unauthorized" });
    return;
  }

  try {

    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!transaction) {
      reply.status(400).send({ message: "Transaction not found" });
      return;
    }

    await prisma.transaction.delete({
      where: {
        id,
      },
    });

    reply.status(200).send( { message: "Transaction deleted successfully" });

  } catch (err) {
    request.log.error("Error deleting transaction: ");
    reply.status(500).send({ message: "Internal Server Error" });
  }
}