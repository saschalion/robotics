declare namespace GeoCoder
{
	export interface LatLong
	{
		lat: number;
		lng: number;
	}

	export interface Bounds
	{
		northeast: LatLong;
		southwest: LatLong;
	}

	export interface Geometry
	{
		bounds: Bounds;

		location_type: string;

		location: LatLong;

		viewport: Bounds;
	}

	export interface GeoResult
	{
		formatted_address: string;

		address_components: {
			long_name: string,
			short_name: string,
			types: string[]
		}[];

		geometry: Geometry;

		place_id: string;

		types: string[];
	}

	export function geocode(address: string, handler: (error, data: {results: GeoResult[]}) => void);

	export function reverseGeocode(lat: number, long: number, handler: (error, data: {results: GeoResult[]}) => void);

	export function reverseGeocode(lat: number, long: number, handler: (error, data: {results: GeoResult[]}) => void, options: {sensor?: boolean, language?: string});

	export function selectProvider(options: {username?: string, appid?: string});
}