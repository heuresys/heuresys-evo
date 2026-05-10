import Link from 'next/link';

/**
 * Forgot-password placeholder page (S28 Wave 2 M9 fix).
 *
 * Replace with full reset-password flow when feature is implemented.
 * Currently informs the user that the feature is not yet available and
 * directs them back to login. Avoids 404 from login forgot-link click.
 */
export default function ForgotPasswordPage() {
  return (
    <main
      className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6 py-12"
      aria-labelledby="forgot-title"
    >
      <h1 id="forgot-title" className="text-2xl font-semibold">
        Recupero password
      </h1>
      <p className="text-base text-neutral-700">
        La procedura di self-service per il recupero password è in fase di implementazione. Per ora,
        contatta il tuo amministratore IT (o l'HR director del tuo tenant) per ricevere una nuova
        password temporanea.
      </p>
      <p className="text-sm text-neutral-600">
        L'amministratore può resettare la tua password tramite l'interfaccia Admin → Users → [tuo
        account] → Reset password.
      </p>
      <Link
        href="/login"
        className="inline-flex h-11 items-center justify-center rounded-md bg-neutral-900 px-4 text-sm font-medium text-white hover:bg-neutral-800"
      >
        Torna al login
      </Link>
    </main>
  );
}

export const metadata = {
  title: 'Recupero password | Heuresys',
};
