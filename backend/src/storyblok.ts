import type { OrderingSettings } from './orderDates.js';

interface StoryblokProductContent {
  name: string;
  price: string | number;
  stock?: string | number;
  order_type?: string;
  daily_capacity?: string | number;
  image?: { filename: string; alt?: string };
}

export type OrderType = 'weekly' | 'standing';

interface StoryblokBlackoutDateBlok {
  date?: string;
}

interface StoryblokOrderingSettingsContent {
  pickup_days?: string[];
  cutoff_day?: string;
  cutoff_time?: string;
  blackout_dates?: StoryblokBlackoutDateBlok[];
}

const DEFAULT_ORDERING_SETTINGS: OrderingSettings = {
  pickupDays: ['friday', 'saturday', 'sunday'],
  cutoffDay: 'tuesday',
  cutoffTime: '12:00',
  blackoutDates: [],
};

export interface Product {
  name: string;
  price: number;
  stock: number;
  orderType: OrderType;
  dailyCapacity: number;
  image?: { filename: string; alt?: string };
  updatedAt: string;
}

export async function getProductByUuid(uuid: string): Promise<Product | null> {
  const token = process.env.STORYBLOK_DELIVERY_API_TOKEN;
  const version = process.env.NODE_ENV === 'production' ? 'published' : 'draft';
  const url = `https://api.storyblok.com/v2/cdn/stories/${uuid}?find_by=uuid&token=${token}&version=${version}`;

  const res = await fetch(url);
  if (!res.ok) {
    return null;
  }

  const data = (await res.json()) as {
    story: { content: StoryblokProductContent; updated_at: string };
  };
  const content = data.story.content;

  return {
    name: content.name,
    price: Number(content.price),
    stock: Number(content.stock ?? 0),
    orderType: content.order_type === 'standing' ? 'standing' : 'weekly',
    dailyCapacity: Number(content.daily_capacity ?? 0),
    image: content.image?.filename ? content.image : undefined,
    updatedAt: data.story.updated_at,
  };
}

export async function getOrderingSettings(): Promise<OrderingSettings> {
  const token = process.env.STORYBLOK_DELIVERY_API_TOKEN;
  const version = process.env.NODE_ENV === 'production' ? 'published' : 'draft';
  const url = `https://api.storyblok.com/v2/cdn/stories/ordering-settings?token=${token}&version=${version}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return DEFAULT_ORDERING_SETTINGS;
    }

    const data = (await res.json()) as {
      story: { content: StoryblokOrderingSettingsContent };
    };
    const content = data.story.content;

    const blackoutDates = (content.blackout_dates ?? [])
      .map((blok) => blok.date?.split(' ')[0])
      .filter((date): date is string => Boolean(date));

    return {
      pickupDays: content.pickup_days?.length
        ? content.pickup_days
        : DEFAULT_ORDERING_SETTINGS.pickupDays,
      cutoffDay: content.cutoff_day ?? DEFAULT_ORDERING_SETTINGS.cutoffDay,
      cutoffTime: content.cutoff_time ?? DEFAULT_ORDERING_SETTINGS.cutoffTime,
      blackoutDates,
    };
  } catch {
    return DEFAULT_ORDERING_SETTINGS;
  }
}
