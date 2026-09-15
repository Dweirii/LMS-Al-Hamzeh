import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { env } from "./env";
import { emailOTP } from "better-auth/plugins";
import { resend } from "./resend";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  socialProviders: {
    github: {
      clientId: env.AUTH_GITHUB_ID,
      clientSecret: env.AUTH_GITHUB_SECRET,
    },
  },

  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        // Outside production the OTP is printed to the server console, so the app
        // can be signed into locally without a verified Resend sending domain.
        if (process.env.NODE_ENV !== "production") {
          console.log(`\n  [dev] Sign-in OTP for ${email}: ${otp}\n`);
        }

        try {
          await resend.emails.send({
            from: "GATA3A  <onboarding@resend.dev>",
            to: [email],
            subject: "GATA3A  - Verify your email",
            html: `<p>Your OTP is <strong>${otp}</strong></p>`,
          });
        } catch (error) {
          // A placeholder or unverified Resend key must not block local sign-in,
          // but in production a delivery failure is a real error.
          if (process.env.NODE_ENV === "production") throw error;
          console.warn("  [dev] Resend delivery failed; use the OTP logged above.");
        }
      },
    }),
    admin(),
  ],
});
