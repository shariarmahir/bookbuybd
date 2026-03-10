import type {
  CreatePrintingRequestPayload,
  CreatePrintingRequestResponse,
  PrintingCategory,
  PrintingEstimatePayload,
  PrintingEstimateResponse,
  PrintingItemOption,
  PrintingRequestStatus,
  UploadAssetRequest,
  UploadAssetResponse,
} from '@/lib/api/contracts/printing';

interface StoredPrintingRequest extends CreatePrintingRequestPayload, PrintingRequestStatus {}

const PRINTING_CATEGORIES: PrintingCategory[] = [
  {
    id: 'books',
    label: 'Books & Academic',
    icon: '📚',
    items: [
      { id: 'custom-printed-books', name: 'Custom Printed Books', description: 'Full-color or B&W book printing, any size', icon: '📖' },
      { id: 'thesis-dissertations', name: 'Thesis & Dissertations', description: 'Hard/soft cover thesis binding & printing', icon: '🎓' },
      { id: 'notebooks-journals', name: 'Notebooks & Journals', description: 'Custom branded notebooks with logo', icon: '📓' },
      { id: 'calendars', name: 'Calendars', description: 'Wall and desk calendars, custom design', icon: '📅' },
    ],
  },
  {
    id: 'office',
    label: 'Office & Corporate',
    icon: '🏢',
    items: [
      { id: 'id-cards', name: 'ID Cards', description: 'PVC, laminated ID cards with lanyards', icon: '🪪' },
      { id: 'visiting-cards', name: 'Visiting Cards', description: 'Matte, gloss, spot UV business cards', icon: '💳' },
      { id: 'brochures-leaflets', name: 'Brochures & Leaflets', description: 'Bi-fold, tri-fold, DL brochures', icon: '📋' },
      { id: 'invoices-forms', name: 'Invoices & Forms', description: 'Carbonless NCR pads, custom forms', icon: '🧾' },
      { id: 'certificates', name: 'Certificates', description: 'A4/A3 certificates, gold foil borders', icon: '📜' },
      { id: 'letterheads', name: 'Letterheads', description: 'Branded company letterhead pads', icon: '✉️' },
    ],
  },
  {
    id: 'display',
    label: 'Banners & Display',
    icon: '🏳️',
    items: [
      { id: 'banners', name: 'Banners', description: 'Vinyl, fabric, retractable roll-up banners', icon: '🏷️' },
      { id: 'posters', name: 'Posters', description: 'A0-A3 glossy/matte large-format posters', icon: '🖼️' },
      { id: 'stickers-labels', name: 'Stickers & Labels', description: 'Die-cut, roll, sheet stickers', icon: '🔖' },
      { id: 'prize-cards', name: 'Prize Cards', description: 'Custom award & prize cards, foil finish', icon: '🏅' },
    ],
  },
  {
    id: 'ceremony',
    label: 'Ceremony & Events',
    icon: '🎉',
    items: [
      { id: 'custom-printed-bags', name: 'Custom Printed Bags', description: 'Gift bags, tote bags, carry bags with branding', icon: '🛍️' },
      { id: 'event-backdrops', name: 'Event Backdrops', description: 'Photo booth, step-and-repeat backdrops', icon: '🎭' },
      { id: 'table-cards-menus', name: 'Table Cards & Menus', description: 'Wedding/event table cards and menus', icon: '🍽️' },
      { id: 'invitation-cards', name: 'Invitation Cards', description: 'Premium invitation & greeting cards', icon: '💌' },
    ],
  },
];

const ITEM_BASE_RATE: Record<string, number> = {
  'custom-printed-books': 80,
  'thesis-dissertations': 120,
  'notebooks-journals': 55,
  calendars: 40,
  'id-cards': 60,
  'visiting-cards': 25,
  'brochures-leaflets': 20,
  'invoices-forms': 18,
  certificates: 35,
  letterheads: 12,
  banners: 380,
  posters: 140,
  'stickers-labels': 16,
  'prize-cards': 28,
  'custom-printed-bags': 60,
  'event-backdrops': 950,
  'table-cards-menus': 35,
  'invitation-cards': 45,
};

const printingRequests = new Map<string, StoredPrintingRequest>();
let requestSequence = 0;

function toMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

function buildRequestId(now: Date): string {
  requestSequence += 1;
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  return `PRN-${date}-${String(requestSequence).padStart(4, '0')}`;
}

function getCategory(categoryId: string | null): PrintingCategory | null {
  if (!categoryId) return null;
  return PRINTING_CATEGORIES.find((category) => category.id === categoryId) ?? null;
}

function getItemRate(itemId: string): number {
  return ITEM_BASE_RATE[itemId] ?? 30;
}

export function listPrintingCategories(): PrintingCategory[] {
  return PRINTING_CATEGORIES;
}

export function listCategoryItems(categoryId: string): PrintingItemOption[] | null {
  return getCategory(categoryId)?.items ?? null;
}

export function estimatePrinting(payload: PrintingEstimatePayload): PrintingEstimateResponse {
  const quantity = payload.quantity && payload.quantity > 0 ? Math.floor(payload.quantity) : 1;
  const subtotal = payload.itemIds.reduce((sum, itemId) => sum + getItemRate(itemId), 0) * quantity;
  const emergencyFee = payload.emergency ? 350 : 0;
  const estimatedTotal = toMoney(subtotal + emergencyFee);

  return {
    estimatedTotal,
    currency: 'BDT',
    minimumLeadDays: payload.emergency ? 1 : 3,
    maximumLeadDays: payload.emergency ? 2 : 5,
  };
}

export function createPrintingRequest(payload: CreatePrintingRequestPayload): CreatePrintingRequestResponse {
  const now = new Date();
  const submittedAt = now.toISOString();
  const requestId = buildRequestId(now);
  const status: CreatePrintingRequestResponse['status'] = 'received';

  printingRequests.set(requestId, {
    ...payload,
    requestId,
    status,
    submittedAt,
    updatedAt: submittedAt,
  });

  return {
    requestId,
    status,
    submittedAt,
  };
}

export function listPrintingRequests(): StoredPrintingRequest[] {
  return Array.from(printingRequests.values()).sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
  );
}

export function getPrintingRequestStatus(requestId: string): PrintingRequestStatus | null {
  const record = printingRequests.get(requestId);
  if (!record) return null;
  return {
    requestId: record.requestId,
    status: record.status,
    submittedAt: record.submittedAt,
    updatedAt: record.updatedAt,
  };
}

export function createMockUploadUrl(payload: UploadAssetRequest): UploadAssetResponse {
  const safeName = encodeURIComponent(payload.fileName.trim() || 'asset.bin');
  const token = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  return {
    uploadUrl: `https://uploads.bookbuybd.local/put/${token}/${safeName}`,
    fileUrl: `https://cdn.bookbuybd.local/assets/${token}/${safeName}`,
    expiresAt,
  };
}
