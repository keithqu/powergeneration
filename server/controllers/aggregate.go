package controllers

import (
	"encoding/json"
	"net/http"

	DB "powergeneration/db"
	"powergeneration/models"
)

func getAggregates(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	countryAggregates := []models.CountryAggregates{}

	DB.Raw(`select country, country_long, sum(gwh) as total from (
		select country, country_long,
		CASE when generation_gwh2017=0 OR generation_gwh2017='' or generation_gwh2017 is null THEN estimated_generation_gwh
			 else generation_gwh2017
		END as gwh
		from global_power_plants) a
		group by country order by total desc`).Scan(&countryAggregates)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(countryAggregates)
}
