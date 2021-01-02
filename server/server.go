package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"

	// _ "powergeneration/controllers"
	_ "powergeneration/database"

	_ "github.com/jinzhu/gorm/dialects/mysql"
	"github.com/joho/godotenv"
	"github.com/keithqu/powergeneration/server/db"

	"github.com/gorilla/mux"
)

type spaHandler struct {
	staticPath string
	indexPath  string
}

// var db *gorm.DB

// var dataset string = "e0f47930-c021-4632-8b4d-87cea97d85b5"
// var apikey string = os.Getenv("APIKEY")
// var organizationid string = os.Getenv("ORGANIZATIONID")
// var baseurl string = "https://api.namara.io/v0/data_sets/" + dataset + "/data/en-0?geometry_format=wkt&api_key=" + apikey + "&organization_id=" + organizationid
// var mysqlhost = os.Getenv("MYSQL_HOST")
// var mysqlport = os.Getenv("MYSQL_PORT")
// var mysqluser = os.Getenv("MYSQL_USER")
// var mysqlpwd = os.Getenv("MYSQL_PASSWORD")
// var mysqldb = os.Getenv("MYSQL_DB")

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

	router.HandleFunc("/api/aggregate/", controllers.getAggregates).Methods("GET")
	router.HandleFunc("/api/country/", controllers.getAllCountries).Methods("GET")
	router.HandleFunc("/api/country/{code:[a-zA-Z]+}", controllers.getOneCountry).Methods("GET")

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

	// db, err = gorm.Open("mysql", mysqluser+":"+mysqlpwd+"@tcp("+mysqlhost+":"+mysqlport+")/"+mysqldb)

	if err := db.Open(); err != nil {
		log.Println("Connected to MySQL server")
	} else {
		log.Println("MySQL connection failed")
	}
	defer db.Close()

	db.AutoMigrate(&GlobalPowerPlants{})

	handleRequests()
}
