package main

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/keithqu/powergeneration/db"
	"github.com/keithqu/powergeneration/models"
)

func getAggregates(w http.ResponseWriter, r *http.Request) {
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

func getAggregatesByGroup(w http.ResponseWriter, r *http.Request) {
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

func getAllCountries(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	powerData := []models.GlobalPowerPlants{}
	db.DB.Find(&powerData, []int{1, 2, 3})

	json.NewEncoder(w).Encode(powerData)
}

func getOneCountry(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	vars := mux.Vars(r)
	powerData := []models.GlobalPowerPlants{}
	db.DB.Where("country = ?", vars["code"]).Find(&powerData)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(powerData)
}
