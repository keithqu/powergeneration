package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"

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

func getAll(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	url := "https://api.namara.io/v0/data_sets/e0f47930-c021-4632-8b4d-87cea97d85b5/data/en-0?geometry_format=wkt&api_key=1bcddff30001f86aa86bcfc16b56b6d89d23b0659479cb7a20adaa588acfe0d6&organization_id=5bfd52abb25822140d6e23fc"
	resp, err := http.Get(url)
	if err != nil {
		log.Fatalln("Error making request")
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)

	var powerData interface{}
	json.Unmarshal(body, &powerData)

	json.NewEncoder(w).Encode(powerData)
}

func runServer() {
	router := mux.NewRouter().StrictSlash(true)
	router.Use(mux.CORSMethodMiddleware(router))

	router.HandleFunc("/api/all", getAll).Methods("GET")
	spa := spaHandler{staticPath: "build", indexPath: "index.html"}
	router.PathPrefix("/").Handler(spa)

	log.Fatal(http.ListenAndServe(":5000", router))
}

func main() {
	runServer()
}
