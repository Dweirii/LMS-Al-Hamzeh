-- Admin type label (technical support, call center, ...). All admins keep the
-- same access; this only records what each admin does.
ALTER TABLE "public"."user" ADD COLUMN "adminType" TEXT;
