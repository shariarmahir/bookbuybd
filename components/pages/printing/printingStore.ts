export interface PrintingDetails {
    categoryId: string | null;
    items: string[];
    file: File | null;
    quantity: number;
    color: 'BW' | 'Color';
    isEmergency: boolean;
    notes: string;
}

export interface PrintingCheckoutForm {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    division: string;
    paymentMethod: 'cod' | 'bkash';
}

export const EMPTY_PRINTING_DETAILS: PrintingDetails = {
    categoryId: null,
    items: [],
    file: null,
    quantity: 1,
    color: 'BW',
    isEmergency: false,
    notes: ''
};

export const EMPTY_PRINTING_FORM: PrintingCheckoutForm = {
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    division: '',
    paymentMethod: 'cod'
};
