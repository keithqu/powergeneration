package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/gorilla/mux"
	"github.com/keithqu/powergeneration/db"
	"github.com/keithqu/powergeneration/models"
)

func filterCountryCode(code string, arr []models.ComparisonAggregates) (out []models.ComparisonAggregates) {
	f := make(map[string]interface{}, len(arr))
	upperCode := strings.ToUpper(code)
	f[upperCode] = struct{}{}
	for _, c := range arr {
		country := strings.ToUpper(c.Country)
		if country == upperCode {
			out = append(out, c)
		}
	}
	return
}

// GetCompareCountries ... gets aggregates by fuel type for 2 countries
func GetCompareCountries(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	vars := mux.Vars(r)
	finalResponse := map[string]interface{}{}
	fuelData := []models.ComparisonAggregates{}
	country1Data := []models.ComparisonAggregates{}
	country2Data := []models.ComparisonAggregates{}

	db.DB.Raw(`select country, primary_fuel, sum(gwh) as total, sum(capacity_mw) as capacity_total from
		(select country, primary_fuel, capacity_mw,
		CASE when generation_gwh2017=0 OR generation_gwh2017='' or generation_gwh2017 is null THEN estimated_generation_gwh
			else generation_gwh2017
		END as gwh
		from global_power_plants where country=? or country=?) a
		group by country, primary_fuel order by country ASC, total desc`, vars["code1"], vars["code2"]).Scan(&fuelData)

	country1Data = filterCountryCode(vars["code1"], fuelData)
	country2Data = filterCountryCode(vars["code2"], fuelData)

	// countries := []string{strings.ToUpper(vars["code1"]), strings.ToUpper(vars["code2"])}
	// countryData := map[string]interface{}{
	// 	fmt.Sprintf("%s", strings.ToUpper(vars["code1"])): country1Data,
	// 	fmt.Sprintf("%s", strings.ToUpper(vars["code2"])): country2Data,
	// }

	finalResponse["countries"] = []string{strings.ToUpper(vars["code1"]), strings.ToUpper(vars["code2"])}
	finalResponse["countryData"] = map[string]interface{}{
		fmt.Sprintf("%s", strings.ToUpper(vars["code1"])): country1Data,
		fmt.Sprintf("%s", strings.ToUpper(vars["code2"])): country2Data,
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(finalResponse)
}
