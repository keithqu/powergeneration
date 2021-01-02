package controllers

import (
	"encoding/json"
	"net/http"

	DB "powergeneration/db"
	_ "powergeneration/models"

	"github.com/gorilla/mux"
	"github.com/keithqu/powergeneration/server/models"
)

func getAllCountries(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	powerData := []models.GlobalPowerPlants{}
	DB.Find(&powerData, []int{1, 2, 3})

	json.NewEncoder(w).Encode(powerData)
}

func getOneCountry(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	vars := mux.Vars(r)
	powerData := []models.GlobalPowerPlants{}
	DB.Where("country = ?", vars["code"]).Find(&powerData)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(powerData)
}
