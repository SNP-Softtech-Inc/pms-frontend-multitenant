// State transitions for the IMAP connect form.
//
// Extracted from MyAccount.js so it can be tested. That file is 2,860 lines
// with 930 of them commented out, and this logic was wrong in a way no
// amount of reading would have caught - it needed a test.

/**
 * Apply a change to the email field.
 *
 * Deliberately does NOT derive the username. The previous version did:
 *
 *   { ...prev, email, username: prev.username || email }
 *
 * which ran on every keystroke, so the first character typed became the
 * username and then stayed - `prev.username` was truthy from that point on.
 * Every IMAP connection was attempted as user "v", and every provider
 * rejected it as invalid credentials.
 *
 * The username defaults to the address on the server (`username || email`),
 * which is the right place for it: one decision, made once, at the point it
 * is used. Nothing in the UI sets this field, but a username already present
 * is preserved in case an input is added later.
 */
export const nextImapFormForEmail = (prev, email) => ({ ...prev, email });
