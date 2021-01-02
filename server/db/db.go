package db

import (
	"log"
	"os"

	_ "powergeneration/models"

	"github.com/jinzhu/gorm"
)

var db *gorm.DB

var mysqlhost = os.Getenv("MYSQL_HOST")
var mysqlport = os.Getenv("MYSQL_PORT")
var mysqluser = os.Getenv("MYSQL_USER")
var mysqlpwd = os.Getenv("MYSQL_PASSWORD")
var mysqldb = os.Getenv("MYSQL_DB")

// Open opens database
func Open() error {
	var err error
	db, err = gorm.Open("mysql", mysqluser+":"+mysqlpwd+"@tcp("+mysqlhost+":"+mysqlport+")/"+mysqldb)

	if err != nil {
		log.Println("MySQL connection failed")
	} else {
		log.Println("Connected to MySQL server")
	}

	db.AutoMigrate(&GlobalPowerPlants{})
}

// Close closes database
func Close() error {
	return db.Close()
}
