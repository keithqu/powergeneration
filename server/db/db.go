package database

import (
	"os"

	"github.com/jinzhu/gorm"
)

var DB *gorm.DB

var mysqlhost = os.Getenv("MYSQL_HOST")
var mysqlport = os.Getenv("MYSQL_PORT")
var mysqluser = os.Getenv("MYSQL_USER")
var mysqlpwd = os.Getenv("MYSQL_PASSWORD")
var mysqldb = os.Getenv("MYSQL_DB")

// Open opens database
func Open() error {
	var err error
	DB, err = gorm.Open("mysql", mysqluser+":"+mysqlpwd+"@tcp("+mysqlhost+":"+mysqlport+")/"+mysqldb)

	if err != nil {
		return err
	}

	return nil
}

// Close closes database
func Close() error {
	return DB.Close()
}
