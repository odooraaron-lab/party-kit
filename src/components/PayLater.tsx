'use client';
import { useEffect, useRef } from 'react';
import { loadStripe, type StripePaymentMethodMessagingElement } from '@stripe/stripe-js';
import { STRIPE_OPTIONS } from '@/lib/stripe-options';

const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = key ? loadStripe(key) : null;

// Stripe's "or 4 interest-free payments with Afterpay" line.
// Stripe decides whether the amount is eligible and hides itself if not.
export function PayLater({ amount }: { amount: number }) {
  const box = useRef<HTMLDivElement>(null);
  const el = useRef<StripePaymentMethodMessagingElement | null>(null);

  useEffect(() => {
    if (!stripePromise || STRIPE_OPTIONS.payLaterMessaging.length === 0) return;
    let cancelled = false;
    stripePromise.then((stripe) => {
      if (!stripe || cancelled || !box.current || el.current) return;
      el.current = stripe.elements().create('paymentMethodMessaging', {
        amount,
        currency: 'NZD',
        countryCode: 'NZ',
        paymentMethodTypes: STRIPE_OPTIONS.payLaterMessaging,
      });
      el.current.mount(box.current);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    el.current?.update({ amount });
  }, [amount]);

  useEffect(() => () => el.current?.destroy(), []);

  if (!stripePromise) return null;
  return <div ref={box} style={{ minHeight: 24 }} />;
}
