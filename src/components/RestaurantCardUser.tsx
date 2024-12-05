import { Button } from "./ui/button";
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type Restaurant = {
  id: number;
  name: string;
  description: string;
  address: string;
  cuisine: string;
  priceRange: string;
  ratings: number;
  imageUrl: string;
};

type RestaurantGridProps = {
  restaurants: Restaurant[];
  onEditClick?: (restaurant: Restaurant) => void;
  onDeleteClick?: (id: number) => void;
  isAdmin?: boolean;
  isBusinessOwner?: boolean;
};

export default function RestaurantCardUser({ restaurants, onDeleteClick, onEditClick, isAdmin, isBusinessOwner }: RestaurantGridProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
      {restaurants.map((restaurant: Restaurant) => (
        <div
          key={restaurant.id}
          className="border rounded p-4 shadow hover:shadow-lg cursor-pointer"
          onClick={() => router.push(`/restaurants/${restaurant.id}`)}
        >
          <Image
            src={restaurant.imageUrl}
            alt={`${restaurant.name} image`}
            width={400}
            height={300}
            className="mb-4 rounded object-cover"
            loading="lazy"
          />
          <h3 className="text-lg font-semibold truncate">{restaurant.name}</h3>
          <p className="truncate">{restaurant.description}</p>
          <p className="truncate">
            <strong>Address:</strong> {restaurant.address}
          </p>
          <p className="truncate">
            <strong>Cuisine:</strong> {restaurant.cuisine}
          </p>
          <p className="truncate">
            <strong>Price Range:</strong> {restaurant.priceRange}
          </p>
          <p>
            <strong>Ratings:</strong> {restaurant.ratings} ★
          </p>
          {isAdmin && (
            <div className="mt-4 flex justify-end space-x-2">
              <Button
                onClick={() => onEditClick && onEditClick(restaurant)}
              >
                Edit
              </Button>

              <button
                onClick={() => onDeleteClick && onDeleteClick(restaurant.id)}
                className="bg-red-500 text-white py-1 px-3 rounded">Delete</button>
            </div>
          )}
          {isBusinessOwner && (
            <div className="mt-4 flex justify-end space-x-2">
              <Button
                onClick={() => onEditClick && onEditClick(restaurant)}
              >
                Edit
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
