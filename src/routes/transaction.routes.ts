import { FastifyInstance } from "fastify";
import createTransaction from "../controllers/transactions/createTransaction.controller";
import { zodToJsonSchema } from "zod-to-json-schema";
import { createTransactionsSchema, deleteTransactionSchema, getHistoricalTransactionsSchema, getTransactionsSchema, getTransactionsSummarySchema } from "../schemas/transaction.schema";
import { getTransactions } from "../controllers/transactions/getTransactions.controller";
import { getTransactionsSummary } from "../controllers/transactions/getTransactionsSummary.controller";
import { deleteTransaction } from "../controllers/transactions/deleteTransaction.controller";
import { authMiddlewares } from "../middlewares/auth.middlewares";
import { getHistoricalTransactions } from "../controllers/transactions/getHistoricalTransactions.controller";



const transactionRoutes = async (fastify: FastifyInstance) => {

  fastify.addHook("preHandler", authMiddlewares); 


   fastify.route({
    method: 'POST',
       url: '/',
       schema: {
         //body: zodToJsonSchema(createTransactionsSchema),
         
       },
      
       handler: createTransaction,
   });

   fastify.route({
    method: 'GET',
       url: '/',
       schema: {
         //querystring: zodToJsonSchema(getTransactionsSchema),
       },

       handler: getTransactions
   });

   fastify.route({
    method: 'GET',
       url: '/summary',
        schema: {
        //querystring: zodToJsonSchema(getTransactionsSummarySchema),
       },
       handler: getTransactionsSummary

   })

    fastify.route({
    method: "GET",
    url: "/historical",
    schema: {
      //querystring: zodToJsonSchema(getHistoricalTransactionsSchema),
    },
    handler: getHistoricalTransactions,
  });

   fastify.route({
    method: 'DELETE',
       url: '/:id',
       schema: {
         //params: zodToJsonSchema(deleteTransactionSchema),         
       },
      
       handler: deleteTransaction,
       
   })
};
export default transactionRoutes;


  