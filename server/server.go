package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/keithqu/powergeneration/db"
	"github.com/keithqu/powergeneration/handlers"
	"github.com/keithqu/powergeneration/models"

	_ "github.com/jinzhu/gorm/dialects/mysql"
	"github.com/joho/godotenv"

	"github.com/gorilla/mux"
)

type spaHandler struct {
	staticPath string
	indexPath  string
}

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

	router.HandleFunc("/api/aggregate/", handlers.GetAggregates).Methods("GET")
	router.HandleFunc("/api/aggregate/{group}", handlers.GetAggregatesByGroup).Methods("GET")
	router.HandleFunc("/api/country/", handlers.GetAllCountries).Methods("GET")
	router.HandleFunc("/api/country/{code:[a-zA-Z]+}", handlers.GetOneCountry).Methods("GET")
	router.HandleFunc("/api/comparison/{code1:[a-zA-Z]+}/{code2:[a-zA-Z]+}", handlers.GetCompareCountries).Methods("GET")

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

	if err := db.Open(); err != nil {
		log.Println("Connected to MySQL server")
	} else {
		log.Println("MySQL connection failed")
	}
	defer db.Close()

	db.DB.AutoMigrate(&models.GlobalPowerPlants{})

	handleRequests()
}
