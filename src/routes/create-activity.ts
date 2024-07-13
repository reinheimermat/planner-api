/* eslint-disable camelcase */

import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { dayjs } from '../lib/dayjs'
import { prisma } from '../lib/prisma'

export async function createActivity(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/trips/:tripId/activities',
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
        body: z.object({
          title: z.string().min(4),
          occurs_at: z.coerce.date(),
        }),
      },
    },
    async (request, reply) => {
      const { tripId } = request.params
      const { title, occurs_at } = request.body

      const trip = await prisma.trip.findUnique({
        where: {
          id: tripId,
        },
      })

      if (!trip) {
        reply.status(404)
        throw new Error('Trip not found')
      }

      if (dayjs(occurs_at).isBefore(trip.starts_at)) {
        reply.status(400)
        throw new Error('Activity cannot occur before trip starts')
      }

      if (dayjs(occurs_at).isAfter(trip.ends_at)) {
        reply.status(400)
        throw new Error('Activity cannot occur after trip ends')
      }

      const activity = await prisma.activity.create({
        data: {
          title,
          occurs_at,
          trip_id: tripId,
        },
      })

      return { activityId: activity.id }
    },
  )
}
