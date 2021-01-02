package models

// GlobalPowerPlants ... main data type for all power generation data
type GlobalPowerPlants struct {
	ID                     int     `json:"id"`
	Country                string  `json:"country"`
	CountryLong            string  `json:"country_long"`
	Name                   string  `json:"name"`
	GppdIdnr               string  `json:"gppd_idnr"`
	CapacityMW             float32 `json:"capacity_mw"`
	Latitude               float32 `json:"latitude"`
	Longitude              float32 `json:"longitude"`
	PrimaryFuel            string  `json:"primary_fuel"`
	OtherFuel1             string  `json:"other_fuel1"`
	OtherFuel2             string  `json:"other_fuel2"`
	OtherFuel3             string  `json:"other_fuel3"`
	CommissioningYear      int     `json:"commissioning_year"`
	Owner                  int     `json:"owner"`
	Source                 string  `json:"source"`
	URL                    string  `json:"url"`
	GeolocationSource      string  `json:"geolocation_source"`
	WeppID                 string  `json:"wepp_id"`
	YearOfCapacityData     int     `json:"year_of_capacity_data"`
	GenerationGWH2013      float32 `json:"generation_gwh_2013"`
	GenerationGWH2014      float32 `json:"generation_gwh_2014"`
	GenerationGWH2015      float32 `json:"generation_gwh_2015"`
	GenerationGWH2016      float32 `json:"generation_gwh_2016"`
	GenerationGWH2017      float32 `json:"generation_gwh_2017"`
	EstimatedGenerationGWH float32 `json:"estimated_generation_gwh"`
}

// CountryAggregates ... total estimated generation
type CountryAggregates struct {
	Country     string  `json:"country"`
	CountryLong string  `json:"country_long"`
	Total       float32 `json:"total"`
}

// FuelAggregates ... production grouped by fuel type
type FuelAggregates struct {
	PrimaryFuel string  `json:"primary_fuel"`
	Total       float32 `json:"total"`
}

// CountryFuelAggregates ... production grouped by fuel type per country
type CountryFuelAggregates struct {
	Country string `json:"country"`
	*FuelAggregates
}

// ErrorMessage ... generic error message type
type ErrorMessage struct {
	Error string `json:"error"`
}
