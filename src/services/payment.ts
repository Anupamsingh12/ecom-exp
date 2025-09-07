import { PaymentInitRequest, PaymentInitResponse } from "@/types/payment.types";
import { apiCall } from "@/lib/apiUtils";

export const initializePayment = async (
  data: PaymentInitRequest
): Promise<PaymentInitResponse> => {
  try {
    const response = await apiCall<PaymentInitResponse>("/payments/init", {
      method: "POST",
      body: data,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
