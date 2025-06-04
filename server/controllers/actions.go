package controllers

import (
	"PhotoProject/api"
	"PhotoProject/storage"
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

type PhotosHandler struct {
	db *storage.Database
}

// 分页请求结构体（支持描述和类型查询）
type PageRequest struct {
	Page        int    `form:"page,default=1"`        // 页码
	PageSize    int    `form:"pageSize,default=10"`   // 每页数量
	Description string `form:"description"`           // 描述搜索
	Type        int    `form:"type"`                  // 类型过滤
	Score 	 int    `form:"score"`                 // 分数过滤
}

type PageResult struct {
	Total  int          `json:"total"`
	Photos []photoInfo  `json:"photos"`
}

type photoInfo struct {
	ID          int    `json:"id"`
	Url         string `json:"url"`
	Description string `json:"description"`
	Type        int    `json:"type"`
	Score 	 int    `json:"score"` 
}

func NewStatsHandler(db *storage.Database) *PhotosHandler {
	return &PhotosHandler{db: db}
}

// 统一处理照片的分页请求
func handlePhotoPagination(h *PhotosHandler, c *gin.Context) {
	var req PageRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		api.Error(c, http.StatusBadRequest, "参数格式错误")
		return
	}

	if req.Page < 1 || req.PageSize < 1 || req.PageSize > 100 {
		api.Error(c, http.StatusBadRequest, "分页参数超出范围")
		return
	}

	// 构建动态查询条件
	var conditions []string
	var args []interface{}

	// 添加描述搜索条件
	if req.Description != "" {
		conditions = append(conditions, "description LIKE ?")
		args = append(args, "%"+req.Description+"%")
	}

	// 添加类型过滤条件
	if req.Type != 0 {
		conditions = append(conditions, "type = ?")
		args = append(args, req.Type)
	}
	
	// 添加分数过滤条件
	if req.Score != 0 {
		conditions = append(conditions, "score >= ?")
		args = append(args, req.Score)
	}

	baseQuery := "FROM photos"
	if len(conditions) > 0 {
		baseQuery += " WHERE " + strings.Join(conditions, " AND ")
	}

	// 获取总数
	countQuery := "SELECT COUNT(*) " + baseQuery
	var total int
	if err := h.db.Get(&total, countQuery, args...); err != nil {
		api.Error(c, http.StatusInternalServerError, "获取照片总数失败")
		return
	}

	// 分页查询
	offset := (req.Page - 1) * req.PageSize
	dataQuery := fmt.Sprintf(`
		SELECT id, url, description, type, score
		%s 
		ORDER BY score DESC, id DESC 
		LIMIT ? OFFSET ?`, baseQuery)

	// 添加分页参数
	args = append(args, req.PageSize, offset)

	var photos []photoInfo
	if err := h.db.Select(&photos, dataQuery, args...); err != nil {
		api.Error(c, http.StatusInternalServerError, "获取照片列表失败")
		return
	}

	api.Success(c, PageResult{
		Total:  total,
		Photos: photos,
	})
}

// 照片列表查询接口
func (h *PhotosHandler) ListPhotos(c *gin.Context) {
	handlePhotoPagination(h, c)
}

// 按ID查询照片详情
func (h *PhotosHandler) Random(c *gin.Context) {
	// 2. 执行查询
	num := c.Param("num")
	var photos []photoInfo
	err := h.db.Select(&photos, `
		SELECT id, url, description, type, score
		FROM photos 
		WHERE type=1 and score > 4
		ORDER BY RANDOM()
		LIMIT ?`, num)

	if err != nil {
		api.Error(c, http.StatusInternalServerError, "获取照片失败: "+err.Error())
		return
	}

	api.Success(c, photos)
}