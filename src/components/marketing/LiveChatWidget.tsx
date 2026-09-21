'use client';

import { useState } from 'react';

import Image from 'next/image';

import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

/* =========================================================
   CHAT TREE — 3 LEVELS
========================================================= */

type LeafOption = { id: string; label: string };

type Level3Node = {
  id: string;
  question: string;
  answers: LeafOption[];
};

type Level2Node = {
  id: string;
  label: string;
  question: string;
  options: Level3Node[];
};

type Level1Node = {
  id: string;
  question: string;
  followUpQuestion: string;
  options: Level2Node[];
};

/* =========================================================
   HELPER
========================================================= */

function answersFor(prefix: string): LeafOption[] {
  return [
    { id: `${prefix}-a`, label: 'Show me the best options' },
    { id: `${prefix}-b`, label: 'Explain the key differences' },
    { id: `${prefix}-c`, label: 'Estimate my costs' },
    { id: `${prefix}-d`, label: 'Help me decide' },
    { id: `${prefix}-e`, label: 'Talk to a human' },
  ];
}

/* =========================================================
   ROOT TREE
========================================================= */

const ROOT_QUESTIONS: Level1Node[] = [
  {
    id: 'compare-energy',
    question: 'I want to compare energy',
    followUpQuestion: 'What would you like to compare?',
    options: [
      {
        id: 'ce-prices',
        label: 'Compare electricity and gas prices',
        question: 'Which region is your property in?',
        options: [
          {
            id: 'ce-prices-london',
            question: 'Which tariff type do you prefer?',
            answers: answersFor('ce-prices-london'),
          },
          {
            id: 'ce-prices-scotland',
            question: 'Which tariff type do you prefer?',
            answers: answersFor('ce-prices-scotland'),
          },
          {
            id: 'ce-prices-wales',
            question: 'Which tariff type do you prefer?',
            answers: answersFor('ce-prices-wales'),
          },
          {
            id: 'ce-prices-ni',
            question: 'Which tariff type do you prefer?',
            answers: answersFor('ce-prices-ni'),
          },
          {
            id: 'ce-prices-other',
            question: 'Which tariff type do you prefer?',
            answers: answersFor('ce-prices-other'),
          },
        ],
      },
      {
        id: 'ce-green',
        label: 'Compare green energy tariffs',
        question: 'How green do you want to go?',
        options: [
          {
            id: 'ce-green-100',
            question: 'Which contract length suits you?',
            answers: answersFor('ce-green-100'),
          },
          {
            id: 'ce-green-offset',
            question: 'Which contract length suits you?',
            answers: answersFor('ce-green-offset'),
          },
          {
            id: 'ce-green-mixed',
            question: 'Which contract length suits you?',
            answers: answersFor('ce-green-mixed'),
          },
          {
            id: 'ce-green-local',
            question: 'Which contract length suits you?',
            answers: answersFor('ce-green-local'),
          },
          {
            id: 'ce-green-any',
            question: 'Which contract length suits you?',
            answers: answersFor('ce-green-any'),
          },
        ],
      },
      {
        id: 'ce-fixed-variable',
        label: 'Compare fixed vs variable deals',
        question: 'How long do you want to fix for?',
        options: [
          {
            id: 'ce-fv-12',
            question: 'How much risk can you take?',
            answers: answersFor('ce-fv-12'),
          },
          {
            id: 'ce-fv-24',
            question: 'How much risk can you take?',
            answers: answersFor('ce-fv-24'),
          },
          {
            id: 'ce-fv-36',
            question: 'How much risk can you take?',
            answers: answersFor('ce-fv-36'),
          },
          {
            id: 'ce-fv-flex',
            question: 'How much risk can you take?',
            answers: answersFor('ce-fv-flex'),
          },
          {
            id: 'ce-fv-unsure',
            question: 'How much risk can you take?',
            answers: answersFor('ce-fv-unsure'),
          },
        ],
      },
      {
        id: 'ce-business',
        label: 'Compare business energy deals',
        question: 'Is this for a small or large business?',
        options: [
          {
            id: 'ce-biz-micro',
            question: 'What is your annual kWh use?',
            answers: answersFor('ce-biz-micro'),
          },
          {
            id: 'ce-biz-small',
            question: 'What is your annual kWh use?',
            answers: answersFor('ce-biz-small'),
          },
          {
            id: 'ce-biz-medium',
            question: 'What is your annual kWh use?',
            answers: answersFor('ce-biz-medium'),
          },
          {
            id: 'ce-biz-large',
            question: 'What is your annual kWh use?',
            answers: answersFor('ce-biz-large'),
          },
          {
            id: 'ce-biz-enterprise',
            question: 'What is your annual kWh use?',
            answers: answersFor('ce-biz-enterprise'),
          },
        ],
      },
      {
        id: 'ce-prepay',
        label: 'Compare prepayment tariffs',
        question: 'Do you have a prepayment meter installed?',
        options: [
          {
            id: 'ce-pp-yes',
            question: 'Would you switch to direct debit?',
            answers: answersFor('ce-pp-yes'),
          },
          {
            id: 'ce-pp-no',
            question: 'Would you switch to direct debit?',
            answers: answersFor('ce-pp-no'),
          },
          {
            id: 'ce-pp-install',
            question: 'Would you switch to direct debit?',
            answers: answersFor('ce-pp-install'),
          },
          {
            id: 'ce-pp-remove',
            question: 'Would you switch to direct debit?',
            answers: answersFor('ce-pp-remove'),
          },
          {
            id: 'ce-pp-unsure',
            question: 'Would you switch to direct debit?',
            answers: answersFor('ce-pp-unsure'),
          },
        ],
      },
    ],
  },
  {
    id: 'compare-efficiency',
    question: 'I want to compare energy efficiency across devices',
    followUpQuestion: 'Which device would you like to compare?',
    options: [
      {
        id: 'cf-washing',
        label: 'Compare washing machines',
        question: 'What size drum do you need?',
        options: [
          {
            id: 'cf-wash-7',
            question: 'What is your budget range?',
            answers: answersFor('cf-wash-7'),
          },
          {
            id: 'cf-wash-8',
            question: 'What is your budget range?',
            answers: answersFor('cf-wash-8'),
          },
          {
            id: 'cf-wash-9',
            question: 'What is your budget range?',
            answers: answersFor('cf-wash-9'),
          },
          {
            id: 'cf-wash-10',
            question: 'What is your budget range?',
            answers: answersFor('cf-wash-10'),
          },
          {
            id: 'cf-wash-unsure',
            question: 'What is your budget range?',
            answers: answersFor('cf-wash-unsure'),
          },
        ],
      },
      {
        id: 'cf-fridge',
        label: 'Compare fridge freezers',
        question: 'What capacity are you looking for?',
        options: [
          {
            id: 'cf-fridge-small',
            question: 'Which style do you prefer?',
            answers: answersFor('cf-fridge-small'),
          },
          {
            id: 'cf-fridge-medium',
            question: 'Which style do you prefer?',
            answers: answersFor('cf-fridge-medium'),
          },
          {
            id: 'cf-fridge-large',
            question: 'Which style do you prefer?',
            answers: answersFor('cf-fridge-large'),
          },
          {
            id: 'cf-fridge-american',
            question: 'Which style do you prefer?',
            answers: answersFor('cf-fridge-american'),
          },
          {
            id: 'cf-fridge-unsure',
            question: 'Which style do you prefer?',
            answers: answersFor('cf-fridge-unsure'),
          },
        ],
      },
      {
        id: 'cf-dishwasher',
        label: 'Compare dishwashers',
        question: 'How many place settings do you need?',
        options: [
          {
            id: 'cf-dw-9',
            question: 'Do you need a slimline model?',
            answers: answersFor('cf-dw-9'),
          },
          {
            id: 'cf-dw-12',
            question: 'Do you need a slimline model?',
            answers: answersFor('cf-dw-12'),
          },
          {
            id: 'cf-dw-14',
            question: 'Do you need a slimline model?',
            answers: answersFor('cf-dw-14'),
          },
          {
            id: 'cf-dw-16',
            question: 'Do you need a slimline model?',
            answers: answersFor('cf-dw-16'),
          },
          {
            id: 'cf-dw-unsure',
            question: 'Do you need a slimline model?',
            answers: answersFor('cf-dw-unsure'),
          },
        ],
      },
      {
        id: 'cf-dryer',
        label: 'Compare tumble dryers',
        question: 'Vented, condenser or heat pump?',
        options: [
          {
            id: 'cf-dry-vented',
            question: 'How much space do you have?',
            answers: answersFor('cf-dry-vented'),
          },
          {
            id: 'cf-dry-condenser',
            question: 'How much space do you have?',
            answers: answersFor('cf-dry-condenser'),
          },
          {
            id: 'cf-dry-heatpump',
            question: 'How much space do you have?',
            answers: answersFor('cf-dry-heatpump'),
          },
          {
            id: 'cf-dry-washer',
            question: 'How much space do you have?',
            answers: answersFor('cf-dry-washer'),
          },
          {
            id: 'cf-dry-unsure',
            question: 'How much space do you have?',
            answers: answersFor('cf-dry-unsure'),
          },
        ],
      },
      {
        id: 'cf-boiler',
        label: 'Compare boilers and heating systems',
        question: 'What fuel type is your current boiler?',
        options: [
          {
            id: 'cf-boiler-gas',
            question: 'Which system type do you want?',
            answers: answersFor('cf-boiler-gas'),
          },
          {
            id: 'cf-boiler-oil',
            question: 'Which system type do you want?',
            answers: answersFor('cf-boiler-oil'),
          },
          {
            id: 'cf-boiler-lpg',
            question: 'Which system type do you want?',
            answers: answersFor('cf-boiler-lpg'),
          },
          {
            id: 'cf-boiler-heatpump',
            question: 'Which system type do you want?',
            answers: answersFor('cf-boiler-heatpump'),
          },
          {
            id: 'cf-boiler-unsure',
            question: 'Which system type do you want?',
            answers: answersFor('cf-boiler-unsure'),
          },
        ],
      },
    ],
  },
  {
    id: 'estimate-bill',
    question: 'I need an estimate of energy bill',
    followUpQuestion: 'How would you like to estimate?',
    options: [
      {
        id: 'eb-kwh',
        label: 'Estimate from annual kWh usage',
        question: 'Roughly what is your annual kWh use?',
        options: [
          {
            id: 'eb-kwh-low',
            question: 'How many people live in the home?',
            answers: answersFor('eb-kwh-low'),
          },
          {
            id: 'eb-kwh-mid',
            question: 'How many people live in the home?',
            answers: answersFor('eb-kwh-mid'),
          },
          {
            id: 'eb-kwh-high',
            question: 'How many people live in the home?',
            answers: answersFor('eb-kwh-high'),
          },
          {
            id: 'eb-kwh-unsure',
            question: 'How many people live in the home?',
            answers: answersFor('eb-kwh-unsure'),
          },
          {
            id: 'eb-kwh-bill',
            question: 'How many people live in the home?',
            answers: answersFor('eb-kwh-bill'),
          },
        ],
      },
      {
        id: 'eb-property',
        label: 'Estimate from my property size',
        question: 'How many bedrooms does the property have?',
        options: [
          {
            id: 'eb-prop-1',
            question: 'How is the property heated?',
            answers: answersFor('eb-prop-1'),
          },
          {
            id: 'eb-prop-2',
            question: 'How is the property heated?',
            answers: answersFor('eb-prop-2'),
          },
          {
            id: 'eb-prop-3',
            question: 'How is the property heated?',
            answers: answersFor('eb-prop-3'),
          },
          {
            id: 'eb-prop-4',
            question: 'How is the property heated?',
            answers: answersFor('eb-prop-4'),
          },
          {
            id: 'eb-prop-5',
            question: 'How is the property heated?',
            answers: answersFor('eb-prop-5'),
          },
        ],
      },
      {
        id: 'eb-last-bill',
        label: 'Estimate from my last bill',
        question: 'Do you have a recent bill to hand?',
        options: [
          {
            id: 'eb-bill-yes',
            question: 'Is your bill monthly or quarterly?',
            answers: answersFor('eb-bill-yes'),
          },
          {
            id: 'eb-bill-no',
            question: 'Is your bill monthly or quarterly?',
            answers: answersFor('eb-bill-no'),
          },
          {
            id: 'eb-bill-app',
            question: 'Is your bill monthly or quarterly?',
            answers: answersFor('eb-bill-app'),
          },
          {
            id: 'eb-bill-portal',
            question: 'Is your bill monthly or quarterly?',
            answers: answersFor('eb-bill-portal'),
          },
          {
            id: 'eb-bill-unsure',
            question: 'Is your bill monthly or quarterly?',
            answers: answersFor('eb-bill-unsure'),
          },
        ],
      },
      {
        id: 'eb-move',
        label: 'Estimate for a house move',
        question: 'When is your moving date?',
        options: [
          {
            id: 'eb-move-soon',
            question: 'Is the property already connected?',
            answers: answersFor('eb-move-soon'),
          },
          {
            id: 'eb-move-month',
            question: 'Is the property already connected?',
            answers: answersFor('eb-move-month'),
          },
          {
            id: 'eb-move-quarter',
            question: 'Is the property already connected?',
            answers: answersFor('eb-move-quarter'),
          },
          {
            id: 'eb-move-later',
            question: 'Is the property already connected?',
            answers: answersFor('eb-move-later'),
          },
          {
            id: 'eb-move-unsure',
            question: 'Is the property already connected?',
            answers: answersFor('eb-move-unsure'),
          },
        ],
      },
      {
        id: 'eb-business',
        label: 'Estimate for a business premises',
        question: 'What is the property used for?',
        options: [
          {
            id: 'eb-biz-office',
            question: 'What are your opening hours?',
            answers: answersFor('eb-biz-office'),
          },
          {
            id: 'eb-biz-retail',
            question: 'What are your opening hours?',
            answers: answersFor('eb-biz-retail'),
          },
          {
            id: 'eb-biz-warehouse',
            question: 'What are your opening hours?',
            answers: answersFor('eb-biz-warehouse'),
          },
          {
            id: 'eb-biz-hospitality',
            question: 'What are your opening hours?',
            answers: answersFor('eb-biz-hospitality'),
          },
          {
            id: 'eb-biz-other',
            question: 'What are your opening hours?',
            answers: answersFor('eb-biz-other'),
          },
        ],
      },
    ],
  },
  {
    id: 'switch-supplier',
    question: 'I want to switch my energy supplier',
    followUpQuestion: 'What do you need help with?',
    options: [
      {
        id: 'ss-near-me',
        label: 'Find current suppliers near me',
        question: 'What is your postcode?',
        options: [
          {
            id: 'ss-nm-london',
            question: 'Which tariff type interests you?',
            answers: answersFor('ss-nm-london'),
          },
          {
            id: 'ss-nm-scotland',
            question: 'Which tariff type interests you?',
            answers: answersFor('ss-nm-scotland'),
          },
          {
            id: 'ss-nm-wales',
            question: 'Which tariff type interests you?',
            answers: answersFor('ss-nm-wales'),
          },
          {
            id: 'ss-nm-ni',
            question: 'Which tariff type interests you?',
            answers: answersFor('ss-nm-ni'),
          },
          {
            id: 'ss-nm-other',
            question: 'Which tariff type interests you?',
            answers: answersFor('ss-nm-other'),
          },
        ],
      },
      {
        id: 'ss-end-date',
        label: 'Check my contract end date',
        question: 'Which supplier are you with now?',
        options: [
          {
            id: 'ss-ed-big6',
            question: 'Do you want to be reminded?',
            answers: answersFor('ss-ed-big6'),
          },
          {
            id: 'ss-ed-challenger',
            question: 'Do you want to be reminded?',
            answers: answersFor('ss-ed-challenger'),
          },
          {
            id: 'ss-ed-green',
            question: 'Do you want to be reminded?',
            answers: answersFor('ss-ed-green'),
          },
          {
            id: 'ss-ed-local',
            question: 'Do you want to be reminded?',
            answers: answersFor('ss-ed-local'),
          },
          {
            id: 'ss-ed-unsure',
            question: 'Do you want to be reminded?',
            answers: answersFor('ss-ed-unsure'),
          },
        ],
      },
      {
        id: 'ss-exit-fees',
        label: 'Understand exit fees',
        question: 'Are you still within the minimum term?',
        options: [
          {
            id: 'ss-ef-yes',
            question: 'How long is left on the contract?',
            answers: answersFor('ss-ef-yes'),
          },
          {
            id: 'ss-ef-no',
            question: 'How long is left on the contract?',
            answers: answersFor('ss-ef-no'),
          },
          {
            id: 'ss-ef-unsure',
            question: 'How long is left on the contract?',
            answers: answersFor('ss-ef-unsure'),
          },
          {
            id: 'ss-ef-fixed',
            question: 'How long is left on the contract?',
            answers: answersFor('ss-ef-fixed'),
          },
          {
            id: 'ss-ef-variable',
            question: 'How long is left on the contract?',
            answers: answersFor('ss-ef-variable'),
          },
        ],
      },
      {
        id: 'ss-green',
        label: 'Switch to a green supplier',
        question: 'Do you want to offset your gas use?',
        options: [
          {
            id: 'ss-g-offset',
            question: 'Which contract length suits you?',
            answers: answersFor('ss-g-offset'),
          },
          {
            id: 'ss-g-no-offset',
            question: 'Which contract length suits you?',
            answers: answersFor('ss-g-no-offset'),
          },
          {
            id: 'ss-g-carbon',
            question: 'Which contract length suits you?',
            answers: answersFor('ss-g-carbon'),
          },
          {
            id: 'ss-g-local',
            question: 'Which contract length suits you?',
            answers: answersFor('ss-g-local'),
          },
          {
            id: 'ss-g-unsure',
            question: 'Which contract length suits you?',
            answers: answersFor('ss-g-unsure'),
          },
        ],
      },
      {
        id: 'ss-times',
        label: 'Compare switching times',
        question: 'Do you need a smart meter installed?',
        options: [
          {
            id: 'ss-t-yes',
            question: 'When would you like to switch?',
            answers: answersFor('ss-t-yes'),
          },
          {
            id: 'ss-t-no',
            question: 'When would you like to switch?',
            answers: answersFor('ss-t-no'),
          },
          {
            id: 'ss-t-unsure',
            question: 'When would you like to switch?',
            answers: answersFor('ss-t-unsure'),
          },
          {
            id: 'ss-t-anytime',
            question: 'When would you like to switch?',
            answers: answersFor('ss-t-anytime'),
          },
          {
            id: 'ss-t-specific',
            question: 'When would you like to switch?',
            answers: answersFor('ss-t-specific'),
          },
        ],
      },
    ],
  },
  {
    id: 'reduce-bills',
    question: 'I want to reduce my energy bills',
    followUpQuestion: 'How can we help you save?',
    options: [
      {
        id: 'rb-tips',
        label: 'Tips for lowering household usage',
        question: 'Which rooms use the most energy?',
        options: [
          {
            id: 'rb-t-kitchen',
            question: 'Do you have any of these appliances?',
            answers: answersFor('rb-t-kitchen'),
          },
          {
            id: 'rb-t-living',
            question: 'Do you have any of these appliances?',
            answers: answersFor('rb-t-living'),
          },
          {
            id: 'rb-t-bedrooms',
            question: 'Do you have any of these appliances?',
            answers: answersFor('rb-t-bedrooms'),
          },
          {
            id: 'rb-t-bathroom',
            question: 'Do you have any of these appliances?',
            answers: answersFor('rb-t-bathroom'),
          },
          {
            id: 'rb-t-outside',
            question: 'Do you have any of these appliances?',
            answers: answersFor('rb-t-outside'),
          },
        ],
      },
      {
        id: 'rb-social',
        label: 'Apply for a social tariff',
        question: 'Are you receiving any benefits?',
        options: [
          {
            id: 'rb-s-uc',
            question: 'Which supplier are you with now?',
            answers: answersFor('rb-s-uc'),
          },
          {
            id: 'rb-s-pension',
            question: 'Which supplier are you with now?',
            answers: answersFor('rb-s-pension'),
          },
          {
            id: 'rb-s-disability',
            question: 'Which supplier are you with now?',
            answers: answersFor('rb-s-disability'),
          },
          {
            id: 'rb-s-lowincome',
            question: 'Which supplier are you with now?',
            answers: answersFor('rb-s-lowincome'),
          },
          {
            id: 'rb-s-other',
            question: 'Which supplier are you with now?',
            answers: answersFor('rb-s-other'),
          },
        ],
      },
      {
        id: 'rb-meter',
        label: 'Check my meter is working correctly',
        question: 'Do you have a smart meter?',
        options: [
          {
            id: 'rb-m-smart',
            question: 'What is happening with the meter?',
            answers: answersFor('rb-m-smart'),
          },
          {
            id: 'rb-m-traditional',
            question: 'What is happening with the meter?',
            answers: answersFor('rb-m-traditional'),
          },
          {
            id: 'rb-m-prepay',
            question: 'What is happening with the meter?',
            answers: answersFor('rb-m-prepay'),
          },
          {
            id: 'rb-m-fault',
            question: 'What is happening with the meter?',
            answers: answersFor('rb-m-fault'),
          },
          {
            id: 'rb-m-unsure',
            question: 'What is happening with the meter?',
            answers: answersFor('rb-m-unsure'),
          },
        ],
      },
      {
        id: 'rb-debt',
        label: 'Get help with debt',
        question: 'Is the debt more than 28 days old?',
        options: [
          {
            id: 'rb-d-recent',
            question: 'Which type of support do you need?',
            answers: answersFor('rb-d-recent'),
          },
          {
            id: 'rb-d-older',
            question: 'Which type of support do you need?',
            answers: answersFor('rb-d-older'),
          },
          {
            id: 'rb-d-plan',
            question: 'Which type of support do you need?',
            answers: answersFor('rb-d-plan'),
          },
          {
            id: 'rb-d-advice',
            question: 'Which type of support do you need?',
            answers: answersFor('rb-d-advice'),
          },
          {
            id: 'rb-d-unsure',
            question: 'Which type of support do you need?',
            answers: answersFor('rb-d-unsure'),
          },
        ],
      },
      {
        id: 'rb-cap',
        label: 'Understand the Ofgem price cap',
        question: 'Do you want the current cap rates?',
        options: [
          {
            id: 'rb-c-current',
            question: 'Which unit rate matters most?',
            answers: answersFor('rb-c-current'),
          },
          {
            id: 'rb-c-next',
            question: 'Which unit rate matters most?',
            answers: answersFor('rb-c-next'),
          },
          {
            id: 'rb-c-change',
            question: 'Which unit rate matters most?',
            answers: answersFor('rb-c-change'),
          },
          {
            id: 'rb-c-explained',
            question: 'Which unit rate matters most?',
            answers: answersFor('rb-c-explanation'),
          },
          {
            id: 'rb-c-bill',
            question: 'Which unit rate matters most?',
            answers: answersFor('rb-c-bill'),
          },
        ],
      },
    ],
  },
];

/* =========================================================
   WIDGET
========================================================= */

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [path, setPath] = useState<string[]>([]);

  const currentLevel1 =
    path.length >= 1 ? (ROOT_QUESTIONS.find((q) => q.id === path[0]) ?? null) : null;

  const currentLevel2 =
    path.length >= 2 && currentLevel1
      ? (currentLevel1.options.find((o) => o.id === path[1]) ?? null)
      : null;

  const currentLevel3 =
    path.length >= 3 && currentLevel2
      ? (currentLevel2.options.find((o) => o.id === path[2]) ?? null)
      : null;

  let panelTitle = 'Select Services';
  let panelOptions: { id: string; label: string }[] = [];

  if (path.length === 0) {
    panelOptions = ROOT_QUESTIONS.map((q) => ({ id: q.id, label: q.question }));
  } else if (path.length === 1 && currentLevel1) {
    panelTitle = currentLevel1.followUpQuestion;
    panelOptions = currentLevel1.options.map((o) => ({ id: o.id, label: o.label }));
  } else if (path.length === 2 && currentLevel2) {
    panelTitle = currentLevel2.question;
    panelOptions = currentLevel2.options.map((o) => ({
      id: o.id,
      label: o.question,
    }));
  } else if (path.length === 3 && currentLevel3) {
    panelTitle = currentLevel3.question;
    panelOptions = currentLevel3.answers;
  }

  function openChat() {
    setIsOpen(true);
  }

  function toggleChat() {
    setIsOpen((prev) => !prev);

    if (isOpen) {
      setPath([]);
    }
  }

  function selectOption(id: string) {
    if (path.length >= 3) return;

    setPath((prev) => [...prev, id]);
  }

  function goBack() {
    setPath((prev) => prev.slice(0, -1));
  }

  return (
    <div
      className="
        fixed
        bottom-4
        right-3
        z-[100]

        flex
        flex-col
        items-end

        sm:bottom-5
        sm:right-5

        md:bottom-6
        md:right-6

        lg:bottom-7
        lg:right-7
      "
    >
      {/* =====================================================
          OPEN CHAT PANEL
      ====================================================== */}
      {isOpen && (
        <div
          className="
            relative
            mb-3

            h-[470px]
            w-[calc(100vw-24px)]
            max-w-[334px]

            overflow-hidden

            rounded-[18px]

            bg-white

            shadow-[0px_8px_24px_rgba(15,30,60,0.12)]

            sm:h-[480px]
            sm:max-w-[334px]

            md:h-[500px]
            md:w-[344px]
            md:max-w-none

            lg:h-[500px]
            lg:w-[334px]
            lg:rounded-[20px]
          "
        >
          {/* GREEN HEADER */}
          <div
            className="
              absolute
              left-0
              right-0
              top-0

              h-[225px]

              rounded-t-[18px]

              bg-[#006B5F]

              px-[22px]
              pt-[20px]

              sm:h-[228px]
              sm:px-[26px]

              md:h-[230px]

              lg:h-[229px]
              lg:rounded-t-[20px]
              lg:px-[35px]
              lg:pt-[21px]
            "
          >
            {/* Goose avatar — 72x72, self-contained circular SVG */}
            <div className="relative h-[72px] w-[72px]">
              <Image
                src="/images/opened-live-chat.svg"
                alt="BillGoose assistant"
                fill
                priority
                sizes="72px"
                className="object-contain"
              />
            </div>

            <h3
              className="
                mt-[20px]
                font-red-hat-display
                text-[23px]
                font-[550]
                leading-[29px]
                tracking-[0]
                text-white
                sm:text-[24px]
                lg:text-[27px]
                lg:leading-[34px]
              "
            >
              Hi, BillGoose here 👋
            </h3>

            <p
              className="
                mt-[4px]
                max-w-[245px]
                font-red-hat-display
                text-[12px]
                font-[467]
                leading-[17px]
                tracking-[0]
                text-white/75
                sm:text-[13px]
                sm:leading-[18px]
                lg:max-w-[250px]
              "
            >
              Let us know if we can help you with anything at all.
            </p>
          </div>

          {/* WHITE LOWER AREA */}
          <div
            className="
              absolute
              bottom-0
              left-0
              right-0
              top-[225px]
              rounded-b-[18px]
              bg-white
              sm:top-[228px]
              md:top-[230px]
              lg:top-[229px]
              lg:rounded-b-[20px]
            "
          />

          {/* OPTIONS PANEL */}
          <div
            className="
              absolute
              left-[14px]
              right-[14px]
              top-[170px]
              z-20
              rounded-[12px]
              bg-white
              px-[20px]
              pb-[20px]
              pt-[20px]
              shadow-[0px_4px_15px_0px_#0000001A,0px_1px_2px_0px_#0000001A]
              sm:left-[15px]
              sm:right-[15px]
              sm:top-[172px]
              md:left-[16px]
              md:right-[16px]
              md:top-[172px]
              lg:left-[14px]
              lg:right-[14px]
              lg:top-[173px]
            "
          >
            <div className="flex items-center gap-2">
              {path.length > 0 && (
                <button
                  type="button"
                  onClick={goBack}
                  aria-label="Go back one step"
                  className="
                    flex
                    h-[22px]
                    w-[22px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#F2F4F7]
                    text-[#0C3354]
                    transition-colors
                    hover:bg-[#E4E7EC]
                  "
                >
                  <ChevronLeft
                    aria-hidden="true"
                    className="h-[14px] w-[14px]"
                    strokeWidth={2.2}
                  />
                </button>
              )}

              <p
                className="
                  min-w-0
                  flex-1
                  truncate
                  font-red-hat-display
                  text-[14px]
                  font-[550]
                  leading-[20px]
                  tracking-[0]
                  text-[#101828]
                  lg:text-[15px]
                "
                title={panelTitle}
              >
                {panelTitle}
              </p>
            </div>

            <div
              className="
                mt-[13px]
                flex
                flex-col
                gap-[8px]
                max-h-[210px]
                overflow-y-auto
                pr-[2px]
              "
            >
              {panelOptions.map((option) => {
                const isLeaf = path.length >= 3;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => selectOption(option.id)}
                    disabled={isLeaf}
                    className="
                      flex
                      min-h-[36px]
                      w-full
                      items-center
                      justify-between
                      gap-2
                      rounded-[6px]
                      bg-[#F2F4F7]
                      px-[12px]
                      py-[8px]
                      text-left
                      font-red-hat-display
                      text-[11px]
                      font-[467]
                      leading-[15px]
                      tracking-[0]
                      text-[#0C3354]
                      transition-colors
                      duration-200
                      hover:bg-[#E8F4F2]
                      disabled:cursor-default
                      disabled:hover:bg-[#F2F4F7]
                      sm:text-[12px]
                      sm:leading-[16px]
                      lg:min-h-[36px]
                      lg:text-[12px]
                    "
                  >
                    <span className="min-w-0 flex-1">{option.label}</span>

                    {!isLeaf && (
                      <ChevronRight
                        aria-hidden="true"
                        className="h-[14px] w-[14px] shrink-0 text-[#98A2B3]"
                        strokeWidth={2}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CLOSED TEXT BUBBLES */}
      {!isOpen && (
        <div className="mb-3 flex flex-col items-end gap-3">
          <button
            type="button"
            onClick={openChat}
            className="
              rounded-[6px]
              border-[0.5px]
              border-[#BFE1DE]
              bg-white
              px-3
              py-2
              font-red-hat-display
              text-[11px]
              font-[550]
              leading-[16px]
              text-[#005D50]
              shadow-[-1.6px_3px_6px_0px_#00000012]
              transition-colors
              hover:bg-[#F0FDFB]
              sm:text-[12px]
              lg:px-4
              lg:py-[10px]
              lg:text-[14px]
              lg:leading-[18px]
            "
          >
            I want to compare energy
          </button>

          <button
            type="button"
            onClick={openChat}
            className="
              rounded-[6px]
              border-[0.5px]
              border-[#BFE1DE]
              bg-white
              px-3
              py-2
              font-red-hat-display
              text-[11px]
              font-[550]
              leading-[16px]
              text-[#005D50]
              shadow-[-1.6px_3px_6px_0px_#00000012]
              transition-colors
              hover:bg-[#F0FDFB]
              sm:text-[12px]
              lg:px-4
              lg:py-[10px]
              lg:text-[14px]
              lg:leading-[18px]
            "
          >
            May I help you?
          </button>
        </div>
      )}

      {/* =====================================================
          FLOATING BUTTON
          - Closed: self-contained circular goose SVG (72x72)
          - Open: small green circle with chevron-down icon
      ====================================================== */}
      <button
        type="button"
        onClick={toggleChat}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close live chat' : 'Open live chat'}
        className="
          relative

          flex
          h-[72px]
          w-[72px]
          shrink-0
          items-center
          justify-center

          rounded-full

          transition-transform
          duration-200

          hover:scale-[1.04]

          focus-visible:outline-none
          focus-visible:ring-4
          focus-visible:ring-[#73BEB7]/30
        "
      >
        {isOpen ? (
          <span
            className="
              flex
              h-full
              w-full
              items-center
              justify-center
              rounded-full
              bg-[#00897B]
              shadow-[0px_6px_18px_rgba(0,137,123,0.24)]
            "
          >
            <ChevronDown
              aria-hidden="true"
              className="h-[24px] w-[24px] text-white"
              strokeWidth={2.6}
            />
          </span>
        ) : (
          <Image
            src="/images/live-chat.svg"
            alt="Open BillGoose live chat"
            fill
            priority
            sizes="72px"
            className="
              rounded-full

              object-contain

              drop-shadow-[0px_6px_8px_rgba(0,0,0,0.18)]
            "
          />
        )}
      </button>
    </div>
  );
}
