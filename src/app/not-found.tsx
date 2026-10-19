// Unmatched URLs render the root not-found (outside the (site) layout), so reuse
// the designed one rather than falling back to the Next.js default page.
export { default } from "./(site)/not-found";
