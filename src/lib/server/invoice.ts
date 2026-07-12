export function generateInvoiceNumber(): string {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const random = Math.floor(1000 + Math.random() * 9000);
	const timestampSuffix = now.getTime().toString().slice(-5);
	return `FF-${year}${month}-${timestampSuffix}${random}`;
}

export function calculateEstimatedDeliveryDate(productionDaysList: number[]): string {
	const maxProductionDays = productionDaysList.length > 0 ? Math.max(...productionDaysList) : 7;
	const shippingBufferDays = 3;
	const date = new Date();
	date.setDate(date.getDate() + maxProductionDays + shippingBufferDays);
	return date.toISOString();
}
