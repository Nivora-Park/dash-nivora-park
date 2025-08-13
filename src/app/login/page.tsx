"use client";

import { useLoginForm } from "@/hooks/useLoginForm";
import {
  LoginLayout,
  LoginHeader,
  LoginCard,
  LoginForm,
  DemoCredentials,
  LoginFooter,
} from "@/components/auth";

export default function LoginPage() {
  const { credentials, isLoading, error, updateField, handleSubmit } =
    useLoginForm();

  return (
    <LoginLayout>
      <LoginHeader
        title="Nivora Park"
        subtitle="Dashboard Monitoring Transaksi"
      />

      <LoginCard>
        <LoginForm
          credentials={credentials}
          isLoading={isLoading}
          error={error}
          onFieldChange={updateField}
          onSubmit={handleSubmit}
        />

        <DemoCredentials />
      </LoginCard>

      <LoginFooter />
    </LoginLayout>
  );
}
