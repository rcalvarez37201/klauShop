import { env } from "@/env.mjs";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const relevantEvents = new Set([
  "product.created",
  "product.updated",
  "price.created",
  "price.updated",
  "payment_intent.succeeded",
  "checkout.session.completed",
]);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = headers().get("Stripe-Signature");

  const webhookSecret = env.STRIPE_WEBHOOK_SECERT_KEY;

  let event: Stripe.Event;
  try {
    if (!sig || !webhookSecret) return;
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }
  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case "product.created":
          break;
        case "payment_intent.succeeded":
          // TODO:Update the Order payment Status

          break;
        case "checkout.session.completed":
          const checkoutSession = event.data.object as Stripe.Checkout.Session;

          if (checkoutSession.status === "complete") {
            // TODO: Handle successful checkout session
          } else {
            // TODO: Handle cancelled/failed checkout session
          }
          break;
        default:
          throw new Error("Unhandled relevant event!");
      }
    } catch (error) {
      console.log(error);
      return new NextResponse(
        'Webhook error: "Webhook handler failed. View logs."',
        { status: 400 },
      );
    }
  }
  return NextResponse.json({ received: true }, { status: 200 });
}
