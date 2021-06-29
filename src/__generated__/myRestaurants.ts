/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: myRestaurants
// ====================================================

export interface myRestaurants_myRestaurant_restaurants_category {
  __typename: "Category";
  id: number;
  name: string;
}

export interface myRestaurants_myRestaurant_restaurants {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImg: string;
  category: myRestaurants_myRestaurant_restaurants_category | null;
  address: string;
  isPromoted: boolean;
}

export interface myRestaurants_myRestaurant {
  __typename: "MyRestaurantOutput";
  ok: boolean;
  error: string | null;
  restaurants: myRestaurants_myRestaurant_restaurants[] | null;
}

export interface myRestaurants {
  myRestaurant: myRestaurants_myRestaurant;
}
