package controllers

import (
	"encoding/json"
	"net/http"

	_ "powergeneration/models"

	"github.com/gorilla/mux"
)

func getAllCountries(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	powerData := []GlobalPowerPlants{}
	db.Find(&powerData, []int{1, 2, 3})

	json.NewEncoder(w).Encode(powerData)
}

func getOneCountry(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	vars := mux.Vars(r)
	powerData := []GlobalPowerPlants{}
	db.Where("country = ?", vars["code"]).Find(&powerData)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(powerData)
}
