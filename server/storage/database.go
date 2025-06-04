package storage

import (
	"fmt"

	"github.com/jmoiron/sqlx"
	_ "modernc.org/sqlite"
)

const createTableSQL = `
CREATE TABLE IF NOT EXISTS photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
	description TEXT NOT NULL,
	type INTEGER NOT NULL,
	score INTEGER 
);
`

// Database 包装器结构体
type Database struct {
	db *sqlx.DB
}

// InitDB 返回自定义 Database 类型
func InitDB(dsn string) (*Database, error) {
	db, err := sqlx.Connect("sqlite", dsn)
	if err != nil {
		return nil, fmt.Errorf("数据库连接失败: %w", err)
	}

	// 执行建表语句
	if _, err := db.Exec(createTableSQL); err != nil {
		return nil, fmt.Errorf("初始化表失败: %w", err)
	}

	return &Database{db: db}, nil
}

// 补充数据库操作方法
func (d *Database) Close() error {
	return d.db.Close()
}

// 在 Database 结构体中添加事务方法
func (d *Database) Beginx() (*sqlx.Tx, error) {
	return d.db.Beginx()
}

// Select 查询多条记录
func (d *Database) Select(dest interface{}, query string, args ...interface{}) error {
	return d.db.Select(dest, query, args...)
}

// Get 查询单条记录
func (d *Database) Get(dest interface{}, query string, args ...interface{}) error {

	return d.db.Get(dest, query, args...)
}


