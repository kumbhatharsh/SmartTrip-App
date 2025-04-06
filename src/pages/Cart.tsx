
import { useState } from "react";
import { Link } from "react-router-dom";
import { MinusCircle, PlusCircle, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface CartItem {
  id: string;
  name: string;
  type: "hotel" | "flight" | "itinerary";
  image: string;
  price: number;
  quantity: number;
  details: string;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Luxury Resort & Spa",
      type: "hotel",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      price: 299,
      quantity: 1,
      details: "3 nights, Ocean View Suite, Breakfast Included",
    },
    {
      id: "2",
      name: "New York to Paris",
      type: "flight",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      price: 649,
      quantity: 1,
      details: "Round Trip, Business Class, Jun 15 - Jun 22",
    },
    {
      id: "3",
      name: "Tokyo Adventure",
      type: "itinerary",
      image: "https://images.unsplash.com/photo-1554797589-7241bb691973?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      price: 1250,
      quantity: 1,
      details: "7-day guided tour, includes hotel and activities",
    },
  ]);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(
      cartItems.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <h2 className="text-xl font-medium text-gray-900 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Add items to your cart to continue with your booking.</p>
              <Link to="/">
                <Button>Browse Trips</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {cartItems.map((item, index) => (
                    <div key={item.id}>
                      <div className="p-6">
                        <div className="flex flex-col sm:flex-row">
                          <div className="sm:w-24 sm:h-24 mb-4 sm:mb-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover rounded-md"
                            />
                          </div>
                          <div className="flex-1 sm:ml-6">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                                <p className="mt-1 text-sm text-gray-500">{item.details}</p>
                                <div className="mt-1 text-sm font-medium text-ocean-600">
                                  ${item.price.toFixed(2)}
                                </div>
                              </div>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-gray-400 hover:text-gray-500"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </div>
                            <div className="mt-4 flex items-center">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="text-gray-500 hover:text-ocean-600"
                              >
                                <MinusCircle className="h-5 w-5" />
                              </button>
                              <span className="mx-2 text-gray-700 w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="text-gray-500 hover:text-ocean-600"
                              >
                                <PlusCircle className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      {index < cartItems.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>
                  <div className="flow-root">
                    <div className="flex justify-between mb-4">
                      <p className="text-sm text-gray-600">Subtotal</p>
                      <p className="text-sm font-medium text-gray-900">${subtotal.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between mb-4">
                      <p className="text-sm text-gray-600">Taxes (8%)</p>
                      <p className="text-sm font-medium text-gray-900">${tax.toFixed(2)}</p>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex justify-between mb-6">
                      <p className="text-base font-medium text-gray-900">Total</p>
                      <p className="text-base font-medium text-gray-900">${total.toFixed(2)}</p>
                    </div>
                    <Link to="/checkout">
                      <Button className="w-full flex items-center justify-center bg-ocean-600 hover:bg-ocean-700">
                        Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
