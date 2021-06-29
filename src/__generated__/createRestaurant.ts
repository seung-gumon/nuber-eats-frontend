/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateRestaurantInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createRestaurant
// ====================================================

export interface createRestaurant_createRestaurant {
  __typename: "CoreOutput";
  ok: boolean;
  error: string | null;
}

export interface createRestaurant {
  createRestaurant: createRestaurant_createRestaurant;
}

export interface createRestaurantVariables {
  input: CreateRestaurantInput;
}
