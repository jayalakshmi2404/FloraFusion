export type FlowerCategory =
	| 'Rose Family'
	| 'Wildflower'
	| 'Tropical'
	| 'Bulb Flower'
	| 'Herb Flower'
	| 'Filler Flower'
	| 'Everlasting';

export type ColorCategory =
	| 'Red'
	| 'Pink'
	| 'White'
	| 'Yellow'
	| 'Purple'
	| 'Orange'
	| 'Blue'
	| 'Mixed';

export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter' | 'Year-Round';

export interface FlowerReview {
	id: string;
	uid: string;
	userName: string;
	rating: number;
	comment: string;
	createdAt: string;
}

export interface Flower {
	id: string;
	commonName: string;
	botanicalName: string;
	scientificName: string;
	category: FlowerCategory;
	manufacturer: string;
	supplier: string;
	country: string;
	availableStock: number;
	remainingStock: number;
	price: number;
	description: string;
	preservationMethod: 'Silica Gel Drying' | 'Pressed Preservation' | 'Glycerin Preservation' | 'Freeze-Drying' | 'Resin Casting';
	expectedPreservedLife: string;
	colorCategory: ColorCategory;
	rating: number;
	reviews: FlowerReview[];
	galleryImages: string[];
	mainImage: string;
	tags: string[];
	season: Season;
	availability: boolean;
}

export interface FlowerSubmission {
	id: string;
	uid: string;
	flowerType: string;
	flowerWeightGrams: number;
	occasion:
		| 'Wedding'
		| 'Birthday'
		| 'Anniversary'
		| 'Memorial'
		| 'Graduation'
		| 'Corporate Event'
		| 'Religious Event';
	photos: string[];
	description: string;
	preferredDeliveryDate: string;
	status: 'Submitted' | 'Under Review' | 'Accepted' | 'In Production' | 'Completed' | 'Rejected';
	createdAt: string;
	updatedAt: string;
	weightEngineResult?: WeightEngineResult;
}

export interface WeightEngineResult {
	eligibleKeepsakes: string[];
	requiredFlowerQuantityGrams: number;
	productionFeasible: boolean;
	wastePercentage: number;
	estimatedManufacturingDays: number;
	estimatedCompletionDate: string;
	estimatedCost: number;
}
