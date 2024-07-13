import cors from '@fastify/cors'
import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { ZodError } from 'zod'

import { env } from './env'
import { confirmParticipant } from './routes/confirm-participant'
import { confirmTrip } from './routes/confirm-trip'
import { createActivity } from './routes/create-activity'
import { createInvite } from './routes/create-invite'
import { createLink } from './routes/create-link'
import { createTrip } from './routes/create-trip'
import { getActivities } from './routes/get-activities'
import { getLinks } from './routes/get-links'
import { getParticipants } from './routes/get-participants'
import { getTripDetails } from './routes/get-trip-details'
import { getParticipant } from './routes/getParticipant'
import { updateTrip } from './routes/update-trip'

export const app = fastify()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createTrip)

app.register(confirmTrip)

app.register(confirmParticipant)

app.register(createActivity)

app.register(getActivities)

app.register(createLink)

app.register(getLinks)

app.register(getParticipants)

app.register(createInvite)

app.register(updateTrip)

app.register(getTripDetails)

app.register(getParticipant)

app.register(cors, {
  origin: '*',
})

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: error.format(),
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    console.error(error.message)
  }

  return reply.status(500).send({
    message: 'Internal server error.',
  })
})
