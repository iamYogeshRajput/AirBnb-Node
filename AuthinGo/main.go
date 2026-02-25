package main

import (
	"AuthinGo/app"
)

func main() {
	cfg := app.Config{
		Addr: ":3001",
	}
	app := app.Application{
		Config: cfg,
	}
	app.Run()
}
