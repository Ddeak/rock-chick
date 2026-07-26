interface StoryblokProductContent {
  name: string;
  price: string | number;
  image?: { filename: string; alt?: string };
}

export interface Product {
  name: string;
  price: number;
  image?: { filename: string; alt?: string };
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
    story: { content: StoryblokProductContent };
  };
  const content = data.story.content;

  return {
    name: content.name,
    price: Number(content.price),
    image: content.image?.filename ? content.image : undefined,
  };
}
