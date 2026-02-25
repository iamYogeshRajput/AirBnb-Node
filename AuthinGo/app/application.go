package app

import (
	"fmt"
	"net/http"
	"time"
)
// Config holds the configuration for the server
type Config struct {
	Addr		 string
}

type Application struct {
	Config Config
}

func (app *Application) Run() error	{
	server := &http.Server{
		Addr: app.Config.Addr,
		Handler: nil,
		ReadTimeout: 10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}
	fmt.Printf("Starting server on %s\n", app.Config.Addr)
	return server.ListenAndServe()
}