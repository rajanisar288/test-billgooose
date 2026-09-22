export type AdditionalParameters = Record<string, string>;

export interface Journey {
  id?: string;
  address?: Address | null;
  lastUrl?: string;
  uuid?: string;
  source?: string;
  sourceType?: null | string;
  sourceName?: string;
  sourceId?: string;
  networkId?: string;
  programmeId?: string;
  affiliateId?: string;
  publisherId?: string;
  clickId?: string;
  referralId?: string;
  campaignId?: string;
  subAffiliateId?: string;
  placementId?: string;
  networkSpecificId?: string;
  landingUrl?: string;
  referrerUrl?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  tduid?: string;
  tdclidSn?: string;
  additionalParameters?: AdditionalParameters;
  journeyId?: string;
  customer?: CustomerDetails | null;
  serviceType?: string;
  cart?: Array<Record<string, unknown>> | null;
  consumption?: {
    gas?: GasConsumption;
    electricity?: ElectricityConsumption;
  };
}

export type GasConsumption =
  | { method: 'mprn'; mprn: string }
  | { method: 'usage'; usageKwh: number; usagePeriod: 'monthly' | 'yearly' }
  | { method: 'estimateBand'; estimateBand: string };

export type ElectricityConsumption =
  | { method: 'mpan'; mpan: string }
  | { method: 'usage'; usageKwh: number; usagePeriod: 'monthly' | 'yearly' }
  | { method: 'estimateBand'; estimateBand: string };

//address
export interface Address {
  buildingName?: string | null;
  buildingNumber?: string | null;
  countryCode?: string | null;
  county?: string | null;
  dependentThoroughfare?: string | null;
  fullAddress?: string | null;
  locality?: string | null;
  postTown?: string | null;
  postcode?: string | null;
  providerReference?: string | null;
  source?: string | null;
  subBuildingName?: string | null;
  thoroughfare?: string | null;
  uprn?: string | null;
}

export enum MoveStatus {
  ALREADY_MOVED_IN = 'alreadyMovedIn',
  MOVING_IN = 'movingIn',
}

export enum OccupancyStatus {
  HOMEOWNER = 'homeowner',
  RENTAL = 'rental',
}

export interface CustomerDetails {
  bedrooms?: string | null;
  consentCapturedAtUtc?: string | null;
  consentVersion?: string | null;
  contactPreference?: string | null;
  contractEndDate?: string | null;
  dateOfBirth?: string | null;
  emailAddress?: string | null;
  energySupplyType?: string | null;
  firstName?: string | null;
  id?: string | null;
  isVulnerablePerson?: boolean;
  marketingConsent?: boolean;
  moveInDate?: string | null;
  moveStatus?: MoveStatus;
  numberOfBillPayers?: number | null;
  occupancyStatus?: OccupancyStatus;
  occupants?: number | null;
  paymentPreference?: string | null;
  phoneNumber?: string | null;
  preferredStartDate?: string | null;
  privacyConsentAccepted?: boolean;
  propertyType?: string | null;
  psrAuthorisedContactDateOfBirth?: string | null;
  psrAuthorisedContactEmail?: string | null;
  psrAuthorisedContactName?: string | null;
  psrCategory?: string | null;
  secondaryPhoneNumber?: string | null;
  supplierDataSharingConsentAccepted?: boolean;
  surname?: string | null;
  title?: string | null;
  insuranceType?: string;
  insuranceHomeOwnershipStatus?: string;
  insuranceCoverStartWindow?: string;
  insurancePaymentFrequency?: string;
  insuredHomeType?: string;
  insuranceHouseStyle?: string;
  hasWorkingSmokeDetectors?: boolean;
}
