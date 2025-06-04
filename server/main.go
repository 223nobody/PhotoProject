package main

import (
	"PhotoProject/controllers"
	"PhotoProject/storage"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"runtime"

	"github.com/gin-gonic/gin"
)

func main() {

	// 初始化数据库
	db, err := storage.InitDB("photos.db")
	if err != nil {
		log.Fatal("数据库初始化失败: ", err)
	}
	defer db.Close()

	statsHandler := controllers.NewStatsHandler(db)

	// 配置路由
	router := gin.Default()

	// 获取项目根目录（关键修改）
	_, mainPath, _, _ := runtime.Caller(0)
	rootDir := filepath.Dir(filepath.Dir(mainPath))

	// 通用CORS配置（开发和生产通用）
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "*") // 允许所有方法
		c.Writer.Header().Set("Access-Control-Allow-Headers", "*") // 允许所有头
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// 静态资源托管（自动检测）
	distPath := filepath.Join(rootDir, "client", "dist")
	if _, err := os.Stat(distPath); !os.IsNotExist(err) {
		router.Static("/assets", filepath.Join(distPath, "assets"))
		router.StaticFile("/favicon.ico", filepath.Join(distPath, "favicon.ico"))
		router.NoRoute(func(c *gin.Context) {
			c.File(filepath.Join(distPath, "index.html"))
		})
		log.Printf("已加载静态资源: %s", distPath)
	} else {
		log.Printf("未找到静态资源目录: %s", distPath)
	}

	// API路由组
	statsGroup := router.Group("/api/stats")
	{
		statsGroup.GET("/list", statsHandler.ListPhotos)
		statsGroup.GET("/random/:num", statsHandler.Random)
	}

	// 健康检查
	router.GET("/api/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	// 启动服务
	port := "8080"
	log.Printf("服务启动于 :%s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatal("服务启动失败:", err)
	}
}
