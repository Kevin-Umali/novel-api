import { FastifyReply, RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression } from "fastify";
import { RouteGenericInterface } from "fastify/types/route";

export interface FastifyReplyWithPayload<Payload extends RouteGenericInterface> extends FastifyReply<RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression, Payload> {}
