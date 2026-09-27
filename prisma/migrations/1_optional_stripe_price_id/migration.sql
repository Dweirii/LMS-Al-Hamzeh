-- Free courses (price 0) have no Stripe price.
ALTER TABLE "public"."course" ALTER COLUMN "stripePriceId" DROP NOT NULL;
