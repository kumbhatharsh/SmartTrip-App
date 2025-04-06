
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, CreditCard, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const checkoutSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  zip: z.string().min(5, "ZIP code must be at least 5 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  paymentMethod: z.enum(["credit", "paypal", "applepay"]),
  cardName: z.string().optional(),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      paymentMethod: "credit",
    },
  });

  const paymentMethod = form.watch("paymentMethod");

  const onSubmit = async (values: CheckoutValues) => {
    setIsLoading(true);
    try {
      // This would be replaced with actual payment processing
      console.log("Checkout values:", values);
      setTimeout(() => {
        setIsLoading(false);
        setOrderComplete(true);
      }, 2000);
    } catch (error) {
      console.error("Checkout error:", error);
      setIsLoading(false);
    }
  };

  const orderSummary = {
    subtotal: 2198,
    tax: 175.84,
    total: 2373.84,
    items: [
      {
        name: "Luxury Resort & Spa",
        price: 299,
        quantity: 1,
      },
      {
        name: "New York to Paris",
        price: 649,
        quantity: 1,
      },
      {
        name: "Tokyo Adventure",
        price: 1250,
        quantity: 1,
      },
    ],
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8 bg-gray-50 flex items-center justify-center">
          <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. We've sent a confirmation email to your inbox with all the details.
            </p>
            <div className="bg-gray-50 p-4 rounded-md text-left mb-6">
              <p className="text-sm font-medium text-gray-900 mb-2">Order Summary</p>
              <p className="text-sm text-gray-600">Order #: SM-{Math.floor(Math.random() * 100000)}</p>
              <p className="text-sm text-gray-600">Total: ${orderSummary.total.toFixed(2)}</p>
            </div>
            <Button className="w-full bg-ocean-600 hover:bg-ocean-700" onClick={() => window.location.href = "/"}>
              Return to Home
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                      <CardDescription>
                        We'll use this email to send your confirmation and updates.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="your.email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Billing Address</CardTitle>
                      <CardDescription>
                        Enter the billing address associated with your payment method.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="zip"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>ZIP</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Method</CardTitle>
                      <CardDescription>
                        All transactions are secure and encrypted.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-2"
                              >
                                <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50">
                                  <RadioGroupItem value="credit" id="credit" />
                                  <label htmlFor="credit" className="flex-1 cursor-pointer font-medium">
                                    Credit / Debit Card
                                  </label>
                                  <CreditCard className="h-5 w-5 text-gray-400" />
                                </div>
                                <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50">
                                  <RadioGroupItem value="paypal" id="paypal" />
                                  <label htmlFor="paypal" className="flex-1 cursor-pointer font-medium">
                                    PayPal
                                  </label>
                                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                                    <path d="M7.5 21.5L8.85 14.1H6L6.75 10.5C10.5 10 12.5 7.5 14 3.5H18L17.4 7C19.2 7.2 20 8.5 20 10.5C19 17.5 16.2 18.5 13 18.5H11L10.4 21.5H7.5Z" fill="#039de0" />
                                  </svg>
                                </div>
                                <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50">
                                  <RadioGroupItem value="applepay" id="applepay" />
                                  <label htmlFor="applepay" className="flex-1 cursor-pointer font-medium">
                                    Apple Pay
                                  </label>
                                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                                    <path d="M17.72 12.71c-.07-.94.27-2.25 1.02-3 .78-.81 1.41-1.95 1.26-3.12-.16-1.24-.91-2.26-1.92-2.88-.83-.51-1.89-.83-3.04-.54 0 0-.77.22-1.33.55-.56.33-1 .33-1.56 0-.56-.33-1.33-.55-1.33-.55-1.15-.29-2.21.03-3.04.54-1.01.62-1.76 1.63-1.92 2.88-.15 1.17.48 2.31 1.26 3.12.75.75 1.1 2.06 1.02 3-.08 1.12-.49 2.14-.95 3.06C5.31 18.5 6.26 21 8.37 21c.97 0 1.36-.38 2.13-.38.77 0 1.16.38 2.13.38 2.11 0 3.06-2.5 2.04-5.24-.47-.91-.88-1.93-.95-3.06z" fill="black" />
                                    <path d="M15 3c.83 0 1.5.67 1.5 1.5 0 .14-.02.28-.06.41-.28.22-.6.4-.94.54v-.01c-.41.16-.86.24-1.28.15-1.8-.37-2.08-1.94-.72-2.59-.21 0-.41 0-.6.03C13.32 3.01 13.74 3 14 3h1z" fill="black" />
                                  </svg>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {paymentMethod === "credit" && (
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="cardName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name on Card</FormLabel>
                                <FormControl>
                                  <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="cardNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Card Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="•••• •••• •••• ••••" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="cardExpiry"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Expiry Date</FormLabel>
                                  <FormControl>
                                    <Input placeholder="MM/YY" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="cardCvc"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>CVC</FormLabel>
                                  <FormControl>
                                    <Input placeholder="•••" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <p className="text-xs text-gray-500 flex items-center">
                        <Lock className="h-3 w-3 mr-1" /> Your payment information is secure and encrypted
                      </p>
                    </CardFooter>
                  </Card>

                  <Button
                    type="submit"
                    className="w-full bg-ocean-600 hover:bg-ocean-700 py-6 text-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : `Pay $${orderSummary.total.toFixed(2)}`}
                  </Button>
                </form>
              </Form>
            </div>

            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {orderSummary.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium">${item.price.toFixed(2)}</p>
                    </div>
                  ))}

                  <Separator />

                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600">Subtotal</p>
                    <p className="text-sm font-medium">${orderSummary.subtotal.toFixed(2)}</p>
                  </div>

                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600">Taxes</p>
                    <p className="text-sm font-medium">${orderSummary.tax.toFixed(2)}</p>
                  </div>

                  <Separator />

                  <div className="flex justify-between">
                    <p className="text-base font-medium">Total</p>
                    <p className="text-base font-bold">${orderSummary.total.toFixed(2)}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
