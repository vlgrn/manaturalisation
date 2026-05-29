import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";

export const metadata = {
  title: "Connexion · MaNaturalisation",
  description: "Connectez-vous ou créez un compte pour accéder à votre dossier.",
};

export default function ConnexionPage() {
  return (
    <div className="container max-w-md py-8 md:py-12">
      <div className="mb-8 flex items-center justify-between">
        <Link href="/" aria-label="MaNaturalisation, accueil" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="MaNaturalisation" className="h-20 w-auto" />
        </Link>
        <Link href="/" className="text-sm text-ink-500 transition hover:text-ink-900">
          Accueil
        </Link>
      </div>

      <div className="rounded-3xl border border-ink-300/50 bg-white p-6 text-center shadow-[0_30px_80px_-50px_rgba(15,23,42,0.25)] md:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-ink-900">
          Accédez à votre dossier
        </h1>
        <p className="mt-2 text-sm text-ink-600">
          Connectez-vous ou créez un compte gratuit pour suivre vos documents.
        </p>
        <div className="mt-7">
          <AuthForm next="/tableau-de-bord" />
        </div>
      </div>

      <p className="mt-5 text-center text-xs leading-relaxed text-ink-500">
        Aucune donnée n&apos;est partagée avec l&apos;administration.
      </p>
    </div>
  );
}
