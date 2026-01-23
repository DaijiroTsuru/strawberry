import { writeFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

// .envファイルを読み込む
config();

const GOOGLE_PLACES_API_KEY = process.env.VITE_GOOGLE_PLACES_API_KEY;
const PLACE_ID = process.env.VITE_GOOGLE_PLACE_ID;

interface GoogleReview {
  author_name: string;
  rating: number;
  text: string;
  time: number;
  profile_photo_url?: string;
  relative_time_description: string;
}

interface GooglePlaceDetails {
  result: {
    name: string;
    rating: number;
    user_ratings_total: number;
    reviews: GoogleReview[];
  };
}

interface Review {
  name: string;
  rating: number;
  comment: string;
  date: string;
  photoUrl?: string;
}

async function fetchGoogleReviews(): Promise<Review[]> {
  if (!GOOGLE_PLACES_API_KEY) {
    console.error('Error: VITE_GOOGLE_PLACES_API_KEY is not set in .env file');
    process.exit(1);
  }

  if (!PLACE_ID) {
    console.error('Error: VITE_GOOGLE_PLACE_ID is not set in .env file');
    process.exit(1);
  }

  console.log('Fetching reviews from Google Places API...');

  try {
    const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
    url.searchParams.append('place_id', PLACE_ID);
    url.searchParams.append('fields', 'name,rating,user_ratings_total,reviews');
    url.searchParams.append('key', GOOGLE_PLACES_API_KEY);
    url.searchParams.append('language', 'ja');

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: GooglePlaceDetails = await response.json();

    if (!data.result?.reviews) {
      console.warn('No reviews found');
      return [];
    }

    console.log(`Found ${data.result.reviews.length} reviews`);
    console.log(`Overall rating: ${data.result.rating} (${data.result.user_ratings_total} reviews)`);

    // レビューを変換
    const reviews: Review[] = data.result.reviews
      .filter(review => review.rating >= 4) // 4星以上のみ
      .slice(0, 6) // 最大6件
      .map(review => ({
        name: review.author_name,
        rating: review.rating,
        comment: review.text,
        date: review.relative_time_description,
        photoUrl: review.profile_photo_url,
      }));

    return reviews;
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    throw error;
  }
}

async function main() {
  try {
    const reviews = await fetchGoogleReviews();
    
    const outputPath = join(process.cwd(), 'src', 'data', 'reviews.json');
    writeFileSync(outputPath, JSON.stringify(reviews, null, 2), 'utf-8');
    
    console.log(`✅ Successfully saved ${reviews.length} reviews to ${outputPath}`);
  } catch (error) {
    console.error('❌ Failed to fetch and save reviews:', error);
    process.exit(1);
  }
}

main();
