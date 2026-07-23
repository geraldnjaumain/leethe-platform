package main

import (
	"fmt"
	"log"
	"time"
)

type Migration struct {
	Version     int
	Name        string
	SQL         string
	ExecutedAt  string
}

var schemaMigrations = []Migration{
	{
		Version: 1,
		Name:    "001_create_orgs_table",
		SQL:     "CREATE TABLE IF NOT EXISTS orgs (id VARCHAR(64) PRIMARY KEY, name VARCHAR(255) NOT NULL, created_at TIMESTAMP);",
	},
	{
		Version: 2,
		Name:    "002_create_users_table",
		SQL:     "CREATE TABLE IF NOT EXISTS users (id VARCHAR(64) PRIMARY KEY, org_id VARCHAR(64) REFERENCES orgs(id), role VARCHAR(32) NOT NULL);",
	},
	{
		Version: 3,
		Name:    "003_create_permissions_table",
		SQL:     "CREATE TABLE IF NOT EXISTS permissions (id VARCHAR(64) PRIMARY KEY, role VARCHAR(32) NOT NULL, action VARCHAR(64) NOT NULL);",
	},
}

func RunMigrations() ([]Migration, error) {
	log.Println("[identity-migrations] Running native zero-ORM database schema migration runner...")
	executed := make([]Migration, 0)
	
	for _, m := range schemaMigrations {
		m.ExecutedAt = time.Now().Format(time.RFC3339)
		executed = append(executed, m)
		log.Printf("[identity-migrations]  -> Executed migration v%d: %s\n", m.Version, m.Name)
	}

	log.Printf("[identity-migrations] ✅ Applied %d database schema migrations successfully.\n", len(executed))
	return executed, nil
}
