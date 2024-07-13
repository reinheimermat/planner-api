/* eslint-disable camelcase */
import 'dayjs/locale/pt-br'

import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

dayjs.extend(localizedFormat)
dayjs.locale('pt-br')

export async function confirmTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/trips/:tripId/confirm',
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
      },
    },
    async (request) => {
      return { tripId: request.params.tripId }
    },
  )
}
