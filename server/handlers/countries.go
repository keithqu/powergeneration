package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/keithqu/powergeneration/db"
	"github.com/keithqu/powergeneration/models"
)

// GetAggregates ... total generation data by country in descending order
func GetAggregates(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	countryAggregates := []models.CountryAggregates{}

	db.DB.Raw(`select country, country_long, sum(gwh) as total from (
		select country, country_long,
		CASE when generation_gwh2017=0 OR generation_gwh2017='' or generation_gwh2017 is null THEN estimated_generation_gwh
			 else generation_gwh2017
		END as gwh
		from global_power_plants) a
		group by country order by total desc`).Scan(&countryAggregates)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(countryAggregates)
}

// GetAggregatesByGroup ... Aggregated fuel data by fuel type or by both country and fuel type (/fuel or /countryfuel)
func GetAggregatesByGroup(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	queryMiddle := `(SELECT country, primary_fuel,
	CASE when generation_gwh2017=0 OR generation_gwh2017='' or generation_gwh2017 is null THEN estimated_generation_gwh
		 ELSE generation_gwh2017
	END as gwh
	FROM global_power_plants) a`

	vars := mux.Vars(r)

	if vars["group"] == "fuel" {
		results := []models.FuelAggregates{}

		query := "SELECT primary_fuel, sum(gwh) as total from " + queryMiddle + " GROUP BY primary_fuel order by total desc"

		db.DB.Raw(query).Scan(&results)

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(results)
	} else if vars["group"] == "countryfuel" {
		results := []models.CountryFuelAggregates{}

		query := "SELECT country, primary_fuel, sum(gwh) as total from " + queryMiddle + " GROUP BY country, primary_fuel order by country ASC, total desc"

		db.DB.Raw(query).Scan(&results)

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(results)
	} else {
		w.WriteHeader(http.StatusBadRequest)
		errMsg := models.ErrorMessage{
			Error: "Bad request, use fuel, countryfuel or no parameters",
		}

		json.NewEncoder(w).Encode(errMsg)
		return
	}
}

// GetAllCountries ... gets the first three rows of data, not that useful
func GetAllCountries(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	powerData := []models.GlobalPowerPlants{}
	db.DB.Find(&powerData, []int{1, 2, 3})

	json.NewEncoder(w).Encode(powerData)
}

// GetOneCountry ... gets aggregated data for one country grouped by fuel type
func GetOneCountry(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	vars := mux.Vars(r)
	finalResponse := map[string]interface{}{}
	powerData := []models.GlobalPowerPlants{}
	fuelData := []models.FuelAggregates{}

	db.DB.Where("country = ?", vars["code"]).Find(&powerData)

	db.DB.Raw(`select primary_fuel, sum(gwh) as total from
		(select country, primary_fuel,
		CASE when generation_gwh2017=0 OR generation_gwh2017='' or generation_gwh2017 is null THEN estimated_generation_gwh
			else generation_gwh2017
		END as gwh
		from global_power_plants where country=?) a
	group by primary_fuel order by total desc`, vars["code"]).Scan(&fuelData)

	finalResponse["power"] = powerData
	finalResponse["fuel"] = fuelData

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(finalResponse)
}
