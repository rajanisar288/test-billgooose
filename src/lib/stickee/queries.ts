/**
 * GraphQL queries for the Stickee comparison engine.
 *
 * NOTE: Mobile and Broadband are completely distinct services in Stickee with
 * different schemas. MOBILE_DEALS_QUERY queries tariffs, models, brands, and networks.
 * BROADBAND_DEALS_QUERY queries suppliers, connection types, download speeds, and fees.
 */

/* =========================================================
   MOBILE & SIM-ONLY GRAPHQL QUERY
========================================================= */

export const MOBILE_DEALS_QUERY = /* GraphQL */ `
  query mobileDeals(
    $sort: Sort
    $reverse: Boolean
    $first: Int
    $page: Int
    $filters: FilterDeal
    $fixed_filters: FilterDeal
  ) {
    deal_filters(filters: $filters, fixed_filters: $fixed_filters) {
      hardware_types
      tariff_types
      release_dates {
        min
        max
      }
      resellers
      cashback_types
      refurbished
      price_increases
      contract_lengths_new
      upfront_prices {
        min
        max
      }
      effective_line_rentals {
        min
        max
      }
      texts {
        min
        max
      }
      data {
        min
        max
      }
      minutes {
        min
        max
      }
      networks {
        id
        name
        image
      }
      brands {
        id
        name
        image
      }
      families {
        id
        name
        brand {
          id
        }
        image
      }
      models {
        id
        name
        release_date
        brand {
          id
        }
      }
      colours {
        id
        name
      }
      gift_types {
        id
        name
      }
      retailers {
        id
        name
        image
        is_reseller
      }
      internal_memories
      model_data_types
      tariff_data_types
    }
    deals(
      first: $first
      page: $page
      sort: $sort
      reverse: $reverse
      filters: $filters
      fixed_filters: $fixed_filters
    ) {
      data {
        ...MobileDealParts
      }
      paginatorInfo {
        hasMorePages
      }
    }
    feature_flags {
      json
    }
  }

  fragment MobileDealParts on Deal {
    id
    price
    total_cost
    featured_status
    is_featured
    is_exclusive
    is_refurbished
    is_sim_only
    url
    main_model_image
    cashback
    cashback_type
    discount_line_rental
    discount_months
    price_increases {
      date
      price
    }
    tags {
      title
      type
    }
    promos
    gift {
      name
    }
    model {
      name
      release_date
      brand {
        name
      }
    }
    tariff {
      network {
        id
        name
        image
        score
      }
      data
      line_rental
      contract_length
      minutes
      texts
      data_type
    }
    retailer {
      id
      name
      image
      is_reseller
    }
  }
`;

/** Backward-compatible alias for MOBILE_DEALS_QUERY */
export const DEALS_QUERY = MOBILE_DEALS_QUERY;

/* =========================================================
   BROADBAND GRAPHQL QUERY
========================================================= */

export const BROADBAND_DEALS_QUERY = /* GraphQL */ `
  query broadbandDeals(
    $first: Int
    $page: Int
    $sort: Sort
    $reverse: Boolean
    $filters: FilterDeal
    $fixed_filters: FilterDeal
    $postcode: String
    $uprn: ID
  ) {
    deal_filters(
      filters: $filters
      fixed_filters: $fixed_filters
      postcode: $postcode
      uprn: $uprn
    ) {
      suppliers {
        id
        name
        image
      }
      contract_lengths
      package_types
      connection_types
      download_speeds {
        min
        max
      }
      monthly_prices {
        min
        max
      }
      headline_prices {
        min
        max
      }
      includes_home_bb
      includes_mobile_bb
      includes_tv
      includes_phone
      includes_sim
      social_tariffs
    }
    deals(
      first: $first
      page: $page
      sort: $sort
      reverse: $reverse
      filters: $filters
      fixed_filters: $fixed_filters
      postcode: $postcode
      uprn: $uprn
    ) {
      paginatorInfo {
        hasMorePages
      }
      data {
        id
        name
        sku
        download_speed
        upload_speed
        monthly_price
        initial_price
        headline_price
        discount_price
        discount_months
        min_contract_length
        delivery_price
        connection_price
        equipment_price
        total_first_year_cost
        full_contract_cost
        url
        supplier {
          id
          name
          image
        }
        supplier_image
        package_type
        connection_type
        bullet_1
        bullet_2
        bullet_3
        gift
        openreach
        technology
        score
      }
    }
  }
`;
