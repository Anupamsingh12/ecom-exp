export type PaymentMethod = "card" | "cash" | "paypal" | "";

export interface PaymentInitRequest {
    order_id: number;
    amount: string;
}

export interface PaymentOrder {
    amount: number;
    amount_due: number;
    amount_paid: number;
    attempts: number;
    created_at: number;
    currency: string;
    entity: string;
    id: string;
    notes: any[];
    offer_id: null | string;
    receipt: string;
    status: string;
}

export interface PaymentInitResponse {
    success: boolean;
    order: PaymentOrder;
}
