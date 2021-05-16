/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { VerifyEmailInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: verifiyEmail
// ====================================================

export interface verifiyEmail_verifyEmail {
  __typename: "VerifyEmailOutput";
  ok: boolean;
  error: string | null;
}

export interface verifiyEmail {
  verifyEmail: verifiyEmail_verifyEmail;
}

export interface verifiyEmailVariables {
  input: VerifyEmailInput;
}
