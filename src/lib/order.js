// lib/order.js
// Native MongoDB structural formatter to replace Mongoose schemas

export function formatOrderDocument(payload) {
  if (!payload) throw new Error("Order payload payload vector is empty");

  return {
    userId: payload.userId || null,
    items: (payload.items || []).map((item) => ({
      productId: String(item.productId),
      name: String(item.name),
      price: Number(item.price || 0),
      quantity: Number(item.quantity || 1),
      image: item.image ? String(item.image) : "",
      category: item.category ? String(item.category) : "",
    })),
    shippingAddress: {
      firstName: String(payload.shippingAddress?.firstName || "").trim(),
      lastName: String(payload.shippingAddress?.lastName || "").trim(),
      email: String(payload.shippingAddress?.email || "").trim(),
      phone: String(payload.shippingAddress?.phone || "").trim(),
      address: String(payload.shippingAddress?.address || "").trim(),
      apartment: payload.shippingAddress?.apartment ? String(payload.shippingAddress.apartment).trim() : "",
      city: String(payload.shippingAddress?.city || "").trim(),
      postalCode: String(payload.shippingAddress?.postalCode || "").trim(),
      country: String(payload.shippingAddress?.country || "Bangladesh").trim(),
    },
    payment: {
      method: payload.payment?.method === "bkash" ? "bkash" : "cod",
      transactionId: payload.payment?.transactionId ? String(payload.payment.transactionId).trim().toUpperCase() : null,
    },
    totals: {
      subtotal: Number(payload.totals?.subtotal || 0),
      shippingCosts: Number(payload.totals?.shippingCosts || 0),
      appliedDiscount: Number(payload.totals?.appliedDiscount || 0),
      grandTotal: Number(payload.totals?.grandTotal || 0),
    },
    status: payload.status || "Pending",
    createdAt: new Date(),
    updatedAt: new Date()
  };
}