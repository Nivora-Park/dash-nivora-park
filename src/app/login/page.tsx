"use client";

import { useLoginForm } from "@/hooks/useLoginForm";
import { Logo } from "@/components/ui/Logo";
import {
  LoginLayout,
  LoginCard,
  LoginForm,
  LoginFooter,
} from "@/components/auth";

export default function LoginPage() {
  const { credentials, isLoading, error, updateField, handleSubmit } =
    useLoginForm();

  return (
    <LoginLayout>
      {/* Logo Section - Centered dan Rapi */}
      <div className="flex flex-col items-center justify-center mb-12 space-y-6">
        <Logo 
          size="large" 
          showText={true} 
          showTagline={true} 
          centered={true}
          className="max-w-md"
        />
      </div>

      <LoginCard>
        <LoginForm
          credentials={credentials}
          isLoading={isLoading}
          error={error}
          onFieldChange={updateField}
          onSubmit={handleSubmit}
        />
      </LoginCard>
      
      <LoginFooter />
    </LoginLayout>
  );
}
