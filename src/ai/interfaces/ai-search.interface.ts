export interface BeerSearchCriteria {
  country?: string[];
  brand?: string[];
  details?: {
    style?: string[];
    minABV?: number;
    maxABV?: number;
    minIBU?: number;
    maxIBU?: number;
    OG?: number;
  };
}

export interface SnackSearchCriteria {
  country?: string[];
  brand?: string[];
  details?: {
    flavor?: string[];
  };
}
