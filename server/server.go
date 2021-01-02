package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"

	_ "./controllers"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"github.com/joho/godotenv"

	"github.com/gorilla/mux"
)

type spaHandler struct {
	staticPath string
	indexPath  string
}

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

var db *gorm.DB

// var dataset string = "e0f47930-c021-4632-8b4d-87cea97d85b5"
// var apikey string = os.Getenv("APIKEY")
// var organizationid string = os.Getenv("ORGANIZATIONID")
// var baseurl string = "https://api.namara.io/v0/data_sets/" + dataset + "/data/en-0?geometry_format=wkt&api_key=" + apikey + "&organization_id=" + organizationid
var mysqlhost = os.Getenv("MYSQL_HOST")
var mysqlport = os.Getenv("MYSQL_PORT")
var mysqluser = os.Getenv("MYSQL_USER")
var mysqlpwd = os.Getenv("MYSQL_PASSWORD")
var mysqldb = os.Getenv("MYSQL_DB")

// Function for serving the React build SPA
func (h spaHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	path, err := filepath.Abs(r.URL.Path)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	path = filepath.Join(h.staticPath, path)

	_, err = os.Stat(path)
	if os.IsNotExist(err) {
		http.ServeFile(w, r, filepath.Join(h.staticPath, h.indexPath))
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	http.FileServer(http.Dir(h.staticPath)).ServeHTTP(w, r)
}

func handleRequests() {
	router := mux.NewRouter().StrictSlash(true)

	var port string
	if os.Getenv("PORT") != "" {
		port = os.Getenv("PORT")
	} else {
		port = "3001"
	}

	router.HandleFunc("/api/aggregate/", aggregate.getAggregates).Methods("GET")
	router.HandleFunc("/api/country/", country.getAllCountries).Methods("GET")
	router.HandleFunc("/api/country/{code:[a-zA-Z]+}", country.getOneCountry).Methods("GET")

	spa := spaHandler{staticPath: "build", indexPath: "index.html"}
	router.PathPrefix("/").Handler(spa)

	router.Use(mux.CORSMethodMiddleware(router))

	log.Fatal(http.ListenAndServe(":"+port, router))
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	db, err = gorm.Open("mysql", mysqluser+":"+mysqlpwd+"@tcp("+mysqlhost+":"+mysqlport+")/"+mysqldb)

	if err != nil {
		log.Println("MySQL connection failed")
	} else {
		log.Println("Connected to MySQL server")
	}

	db.AutoMigrate(&GlobalPowerPlants{})

	handleRequests()
}
