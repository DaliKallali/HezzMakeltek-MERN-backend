import { Request, Response } from "express";
import Restaurant, { MenuItemType } from "../models/restaurant";
import Order from "../models/order";

const FRONTEND_URL = process.env.FRONTEND_URL as string;

const getMyOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate("restaurant")
      .populate("user");

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

type CheckoutSessionRequest = {
  cartItems: {
    menuItemId: string;
    name: string;
    quantity: string;
  }[];
  deliveryDetails: {
    email: string;
    name: string;
    addressLine1: string;
    city: string;
  };
  restaurantId: string;
};

const calculateTotalAmount = (
  cartItems: CheckoutSessionRequest["cartItems"],
  menuItems: MenuItemType[],
  deliveryPrice: number
): number => {
  let totalAmount = 0;

  cartItems.forEach((cartItem) => {
    const menuItem = menuItems.find(
      (item) => item._id.toString() === cartItem.menuItemId.toString()
    );

    if (!menuItem) {
      throw new Error(`Menu item not found: ${cartItem.menuItemId}`);
    }

    totalAmount += menuItem.price * parseInt(cartItem.quantity);
  });

  totalAmount += deliveryPrice;

  return totalAmount;
};

const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const checkoutSessionRequest: CheckoutSessionRequest = req.body;

    const restaurant = await Restaurant.findById(
      checkoutSessionRequest.restaurantId
    );

    if (!restaurant) {
      throw new Error("Restaurant not found");
    }
    const totalAmount = calculateTotalAmount(
      checkoutSessionRequest.cartItems,
      restaurant.menuItems,
      restaurant.deliveryPrice
    );

    const newOrder = new Order({
      restaurant: restaurant,
      user: req.userId,
      status: "placed",
      deliveryDetails: checkoutSessionRequest.deliveryDetails,
      cartItems: checkoutSessionRequest.cartItems,
      totalAmount: totalAmount,
      createdAt: new Date(),
    });

    await newOrder.save();
    res.json({ message: "Order placed successfully" });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export default {
  getMyOrders,
  createCheckoutSession,
};
