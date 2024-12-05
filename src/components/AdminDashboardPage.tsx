'use client';
import React, { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import RestaurantCard from '@/components/RestaurantCard';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UploadButton } from "@/utils/uploadthing";
import ShimmerEffect from './ShimmerEffect';
import { ToastAction } from './ui/toast';

interface Restaurant {
  id: number;
  name: string;
  description: string;
  address: string;
  zipcode: string;
  cuisine: string;
  priceRange: string;
  ratings: number;
  imageUrl: string;
}

export default function AdminDashboard() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const isAdmin = true; 
  const [loading, setLoading] = useState(false);
  const [editRestaurant, setEditRestaurant] = useState<Restaurant | null>(null);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newZipcode, setNewZipcode] = useState('');
  const [newCuisine, setNewCuisine] = useState('');
  const [newPriceRange, setNewPriceRange] = useState('');
  const [newRatings, setNewRatings] = useState<number | string>('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const { toast } = useToast()

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/restaurants');
      const data = await response.json();
      setRestaurants(data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);


  const handleDelete = async (id: number) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this restaurant?');
  
    if (!isConfirmed) {
      return; 
    }
  
    try {
      const response = await fetch(`/api/restaurants/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        setRestaurants((prev) => prev.filter((restaurant) => restaurant.id !== id));
        toast({
          description: "Restaurant deleted successfully!",
        })
      } else {
        console.error('Failed to delete restaurant');
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to delete the restaurant. Please try again.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })

      }
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "An error occurred while deleting the restaurant.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    }
  };

  const handleEdit = async (id: number) => {
    if (!editRestaurant) return;
  
    try {
      const response = await fetch(`/api/restaurants/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newName || editRestaurant.name,
          description: newDescription || editRestaurant.description,
          address: newAddress || editRestaurant.address,
          zipcode: newZipcode || editRestaurant.zipcode,
          cuisine: newCuisine || editRestaurant.cuisine,
          priceRange: newPriceRange || editRestaurant.priceRange,
          ratings: Number(newRatings) || editRestaurant.ratings,
          imageUrl: newImageUrl || editRestaurant.imageUrl,
        }),
      });
  
      if (response.ok) {
        setRestaurants((prev) =>
          prev.map((restaurant) =>
            restaurant.id === id
              ? {
                  ...restaurant,
                  name: newName || restaurant.name,
                  description: newDescription || restaurant.description,
                  address: newAddress || restaurant.address,
                  zipcode: newZipcode || restaurant.zipcode,
                  cuisine: newCuisine || restaurant.cuisine,
                  priceRange: newPriceRange || restaurant.priceRange,
                  ratings: Number(newRatings) || restaurant.ratings,
                  imageUrl: newImageUrl || restaurant.imageUrl,
                }
              : restaurant
          )
        );
        setEditRestaurant(null);
        resetForm();
        toast({
          description: "Restaurant updated successfully!",
        })
      } else {
        console.error('Failed to update restaurant');
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to update the restaurant. Please try again.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })
      }
    } catch (error) {
      console.error('Error editing restaurant:', error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "An error occurred while updating the restaurant.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    }
  };
  
  const handleCancelEdit = () => {
    setEditRestaurant(null);
    resetForm();
  };

  const handleLogout = () => {
    localStorage.removeItem('admin-token');
    localStorage.removeItem('admin-token-expiration');
    toast({
      description: "Logged out successfully.",
    });

    window.location.href = '/restaurants';
  };
  
  const resetForm = () => {
    setNewName('');
    setNewDescription('');
    setNewAddress('');
    setNewZipcode('');
    setNewCuisine('');
    setNewPriceRange('');
    setNewRatings('');
    setNewImageUrl('');
  };

  if(loading){
    return <ShimmerEffect/>
  }

  return (
    <main className="p-4">
      <div className="w-full flex justify-between items-center m-4 pr-5">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <div className="pr-4">
          <Button onClick={handleLogout} variant="destructive" className="ml-2">Log Out</Button>
        </div>
      </div>  

      <RestaurantCard 
        restaurants={restaurants} 
        onDeleteClick={handleDelete}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onEditClick={(restaurant:any) => setEditRestaurant(restaurant)} 
        isAdmin={isAdmin} 
        isBusinessOwner={false}
      />
      {editRestaurant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Edit Restaurant</h2>
            <input
              type="text"
              value={newName || editRestaurant.name}
              onChange={(e) => setNewName(e.target.value)}
              className="mb-2 border rounded px-2 py-1 w-full"
              placeholder="Edit Name"
            />
            <textarea
              value={newDescription || editRestaurant.description}
              onChange={(e) => setNewDescription(e.target.value)}
              className="mb-2 border rounded px-2 py-1 w-full"
              placeholder="Edit Description"
            />
            <input
              type="text"
              value={newAddress || editRestaurant.address}
              onChange={(e) => setNewAddress(e.target.value)}
              className="mb-2 border rounded px-2 py-1 w-full"
              placeholder="Edit Address"
            />
            <input
              type="text"
              value={newZipcode || editRestaurant.zipcode}
              onChange={(e) => setNewZipcode(e.target.value)}
              className="mb-2 border rounded px-2 py-1 w-full"
              placeholder="Edit Zipcode"
            />
            <input
              type="text"
              value={newCuisine || editRestaurant.cuisine}
              onChange={(e) => setNewCuisine(e.target.value)}
              className="mb-2 border rounded px-2 py-1 w-full"
              placeholder="Edit Cuisine"
            />
            <Select value={newPriceRange || editRestaurant.priceRange} onValueChange={setNewPriceRange}>
              <SelectTrigger className="w-full mb-2">
                <SelectValue placeholder="Select Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <input
              type="number"
              value={newRatings || editRestaurant.ratings}
              onChange={(e) => setNewRatings(e.target.value)}
              className="mb-2 border rounded px-2 py-1 w-full"
              placeholder="Edit Ratings"
            />
            <div className="mb-2 border rounded px-2 py-1 w-full">
            <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res && res.length > 0) {
                    const newImageUrl = res[0].url; 
                    setNewImageUrl(newImageUrl); 
                    alert("Upload Completed");
                  }
                }}
                onUploadError={(error) => {
                  alert(`ERROR! ${error.message}`);
                }}
              />
            </div>


            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => handleEdit(editRestaurant.id)}
              >
                Save
              </Button>
              <Button
                onClick={handleCancelEdit}
                variant="destructive">Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
