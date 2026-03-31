import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const UNSPLASH_BY_KEYWORD = {
	backpack: 'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?auto=format&fit=crop&w=900&q=80',
	sneakers: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
	shoe: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
	watch: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=80',
	headphones: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
	hoodie: 'https://images.unsplash.com/photo-1618354691321-e851c56960d1?auto=format&fit=crop&w=900&q=80',
	lamp: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
	coffee: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
	electronics: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
	fashion: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80',
	home: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=900&q=80',
};

const UNSPLASH_FALLBACKS = [
	'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
	'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80',
	'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
	'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80',
];

function pickRelevantUnsplashImage(title, category, index) {
	const haystack = `${title ?? ''} ${category ?? ''}`.toLowerCase();
	const key = Object.keys(UNSPLASH_BY_KEYWORD).find(keyword => haystack.includes(keyword));

	if (key) {
		return UNSPLASH_BY_KEYWORD[key];
	}

	return UNSPLASH_FALLBACKS[index % UNSPLASH_FALLBACKS.length];
}

function isBadImageUrl(url) {
	if (!url) return true;

	const normalized = String(url).toLowerCase();
	return (
		normalized.includes('via.placeholder.com') ||
		normalized.includes('placeholder.com') ||
		normalized.includes('dummyimage.com')
	);
}

const fallbackProducts = [
	{
		id: 1,
		title: 'Urban Backpack',
		price: 69.99,
		category: 'Accessories',
		image: 'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?auto=format&fit=crop&w=900&q=80',
		description: 'Durable backpack for work and weekend travel.',
	},
	{
		id: 2,
		title: 'Classic Sneakers',
		price: 89.5,
		category: 'Footwear',
		image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
		description: 'Lightweight everyday sneakers with premium comfort.',
	},
	{
		id: 3,
		title: 'Minimal Watch',
		price: 129,
		category: 'Watches',
		image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=80',
		description: 'Clean design with stainless steel body and leather strap.',
	},
	{
		id: 4,
		title: 'Wireless Headphones',
		price: 149,
		category: 'Electronics',
		image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
		description: 'Immersive sound and all-day battery life.',
	},
	{
		id: 5,
		title: 'Everyday Hoodie',
		price: 54.95,
		category: 'Apparel',
		image: 'https://images.unsplash.com/photo-1618354691321-e851c56960d1?auto=format&fit=crop&w=900&q=80',
		description: 'Soft cotton hoodie for casual comfort.',
	},
	{
		id: 6,
		title: 'Desk Lamp',
		price: 45,
		category: 'Home',
		image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
		description: 'Adjustable warm light lamp for your workspace.',
	},
];

function normalizeProduct(product, index) {
	const title = product.title ?? product.name ?? 'Untitled Product';
	const category = product.category ?? 'General';
	const imageFromDb = product.image_url ?? product.image;
	const image = isBadImageUrl(imageFromDb)
		? pickRelevantUnsplashImage(title, category, index)
		: imageFromDb ?? pickRelevantUnsplashImage(title, category, index);

	return {
		id: product.id ?? index + 1,
		title: title,
		price: Number(product.price ?? 0),
		category,
		image,
		description: product.description ?? 'No description available.',
	};
}

export function useProducts() {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		let isMounted = true;

		async function fetchProducts() {
			try {
				const { data, error: queryError } = await supabase.from('products').select('*');

				if (queryError) {
					throw queryError;
				}

				const normalized = (data ?? []).map(normalizeProduct);
				if (isMounted) {
					setProducts(normalized.length > 0 ? normalized : fallbackProducts);
					setError('');
				}
			} catch {
				if (isMounted) {
					setProducts(fallbackProducts);
					setError('Using demo products because live data is unavailable.');
				}
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		}

		fetchProducts();

		return () => {
			isMounted = false;
		};
	}, []);

	return { products, loading, error };
}
