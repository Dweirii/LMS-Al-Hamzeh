import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature");

  if (!signature) {
    return new Response("Missing Stripe-Signature header", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    // Signature verification failed: the request did not come from Stripe.
    return new Response("Webhook signature verification failed", { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return new Response(null, { status: 200 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const enrollmentId = session.metadata?.enrollmentId;
  const courseId = session.metadata?.courseId;
  const userId = session.metadata?.userId;

  // A malformed event is not retryable, so acknowledge it. Throwing here would
  // return a 500 and make Stripe redeliver the same broken event indefinitely.
  if (!enrollmentId || !courseId || !userId) {
    console.error("Stripe webhook: checkout session is missing metadata", {
      eventId: event.id,
      sessionId: session.id,
      enrollmentId,
      courseId,
      userId,
    });
    return new Response(null, { status: 200 });
  }

  try {
    // Scope the update to the enrollment that this checkout session was created
    // for. The previous version looked the user up by Stripe customer id and
    // then overwrote userId and courseId on whatever row the id pointed at.
    const updated = await prisma.enrollment.updateMany({
      where: { id: enrollmentId, userId, courseId },
      data: {
        amount: session.amount_total ?? undefined,
        status: "Active",
      },
    });

    if (updated.count === 0) {
      console.error("Stripe webhook: no enrollment matched the session metadata", {
        eventId: event.id,
        enrollmentId,
        userId,
        courseId,
      });
    }
  } catch (error) {
    // A database failure is worth retrying, so let Stripe redeliver this one.
    console.error("Stripe webhook: failed to activate enrollment", {
      eventId: event.id,
      enrollmentId,
      error,
    });
    return new Response("Failed to activate enrollment", { status: 500 });
  }

  return new Response(null, { status: 200 });
}
