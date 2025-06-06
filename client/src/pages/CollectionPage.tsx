import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import "./HomePage.css";
import "./CollectionPage.css";

interface Photo {
  id: number;
  url: string;
  type: number;
  displayUrl: string;
  originalUrl: string;
}
// 增强图片组件，支持加载失败时使用原始URL重试
const EnhancedImage = ({ primarySrc, fallbackSrc, alt, className, style }) => {
  const [src, setSrc] = useState(primarySrc);
  const [errorOccurred, setErrorOccurred] = useState(false);

  useEffect(() => {
    setSrc(primarySrc);
    setErrorOccurred(false);
  }, [primarySrc]);

  const handleError = () => {
    // 如果有备用URL且未使用过，则切换为备用URL
    if (!errorOccurred && fallbackSrc && fallbackSrc !== primarySrc) {
      setSrc(fallbackSrc);
      setErrorOccurred(true);
    }
  };

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onError={handleError}
    />
  );
};

// 图片详情模态框组件
const PhotoDetailModal = ({ photo, photos, currentIndex, onClose }) => {
  const [currentIndexState, setCurrentIndexState] = useState(currentIndex);
  const [zoomLevel, setZoomLevel] = useState(1);

  const nextPhoto = () => {
    setCurrentIndexState((prev) => (prev + 1) % photos.length);
    setZoomLevel(1);
  };

  const prevPhoto = () => {
    setCurrentIndexState((prev) => (prev - 1 + photos.length) % photos.length);
    setZoomLevel(1);
  };

  const handleZoom = (e) => {
    e.stopPropagation();
    if (zoomLevel === 1) {
      setZoomLevel(2);
    } else if (zoomLevel === 2) {
      setZoomLevel(1);
    }
  };

  const currentPhoto = photos[currentIndexState];

  // 点击背景关闭模态框
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleBackgroundClick}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* 顶部浏览器标签栏 */}
        <div className="fake-browser-bar"></div>

        <div className="main-content">
          {/* 左侧预览图 */}
          {photos.length > 1 && (
            <div className="preview prev" onClick={prevPhoto}>
              <EnhancedImage
                primarySrc={
                  photos[
                    (currentIndexState - 1 + photos.length) % photos.length
                  ].url
                }
                alt="预览"
                className="blurred"
              />
              <div className="preview-label">上⼀张</div>
            </div>
          )}

          {/* 主图展示 */}
          <div className="main-image-container" onClick={handleZoom}>
            <EnhancedImage
              primarySrc={currentPhoto.url}
              alt={currentPhoto.description}
              className="main-image"
              style={{
                transform: `scale(${zoomLevel})`,
                cursor: zoomLevel === 1 ? "zoom-in" : "zoom-out",
              }}
            />
          </div>

          {/* 右侧预览图 */}
          {photos.length > 1 && (
            <div className="preview next" onClick={nextPhoto}>
              <EnhancedImage
                primarySrc={photos[(currentIndexState + 1) % photos.length].url}
                alt="预览"
                className="blurred"
              />
              <div className="preview-label">下⼀张</div>
            </div>
          )}
        </div>

        {/* 底部导航 */}
        <div className="navigation-indicators">
          <div className="nav-counter">
            <span className="counter-number">{currentIndexState + 1}</span>
            <span className="counter-number">/</span>
            <span className="counter-number">{photos.length}</span>
          </div>

          <div className="nav-dots">
            {photos.map((_, index) => (
              <div
                key={index}
                className={`dot ${index === currentIndexState ? "active" : ""}`}
                onClick={() => setCurrentIndexState(index)}
              />
            ))}
          </div>
        </div>

        {/* 关闭按钮 */}
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
};

const CollectionPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [photos1, setPhotos1] = useState([]); // 横型图片 (type=1)
  const [photos2, setPhotos2] = useState([]); // 竖型图片 (type=2)
  const [currentPage, setCurrentPage] = useState(1); // 当前页码
  const [totalPortraits, setTotalPortraits] = useState(0); // 竖图总数
  const [totalLandscapes, setTotalLandscapes] = useState(0); // 横图总数
  const { description } = useParams(); // 获取路由参数
  const purchase = 0;

  // 模态框状态
  const [showModal, setShowModal] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [allPhotos, setAllPhotos] = useState([]); // 组合所有照片

  // 每页显示图片数量
  const PORTRAIT_PER_PAGE = 9; // 每页竖图数量 (3x3)
  const LANDSCAPE_PER_PAGE = 4; // 每页横图数量 (2x2)

  // 获取照片数据的函数
  const fetchCollectionPhotos = async (page) => {
    try {
      setLoading(true);

      // 分别获取两种类型的照片并带上分页参数
      const [response1, response2] = await Promise.all([
        fetch(
          `/api/stats/list?description=${description}&type=1&page=${page}&pageSize=${LANDSCAPE_PER_PAGE}`
        ),
        fetch(
          `/api/stats/list?description=${description}&type=2&page=${page}&pageSize=${PORTRAIT_PER_PAGE}`
        ),
      ]);

      if (!response1.ok || !response2.ok) {
        throw new Error("获取照片数据失败");
      }

      const result1 = await response1.json();
      const result2 = await response2.json();

      // 添加质量参数函数
      const addQualityParam = (url) => {
        if (url.includes("?")) {
          return `${url}&x-oss-process=image/quality,q_85`;
        } else {
          return `${url}?x-oss-process=image/quality,q_85`;
        }
      };

      // 为每个照片添加原始URL和显示URL
      const processedPhotos1 = (result1.data?.photos || []).map((photo) => ({
        ...photo,
        displayUrl: addQualityParam(photo.url), // 添加质量参数的URL用于列表显示
        originalUrl: photo.url, // 保留原始URL
      }));

      const processedPhotos2 = (result2.data?.photos || []).map((photo) => ({
        ...photo,
        displayUrl: addQualityParam(photo.url), // 添加质量参数的URL用于列表显示
        originalUrl: photo.url, // 保留原始URL
      }));
      // 存储照片数据和总数
      setPhotos1(processedPhotos1);
      setPhotos2(processedPhotos2);
      setTotalLandscapes(result1.data?.total || 0);
      setTotalPortraits(result2.data?.total || 0);

      // 组合所有照片用于模态框（使用原始URL）
      setAllPhotos([
        ...(processedPhotos2.map((p: Photo) => ({
          ...p,
          url: p.originalUrl,
        })) || []),
        ...(processedPhotos1.map((p: Photo) => ({
          ...p,
          url: p.originalUrl,
        })) || []),
      ]);
    } catch (error: unknown) {
      console.error("获取照片失败:", error);
    } finally {
      setLoading(false);
    }
  };

  // 翻页处理 - 加载指定页的数据
  const handlePageChange = (page) => {
    if (page < 1 || page > getTotalPages()) return;

    setCurrentPage(page);
    fetchCollectionPhotos(page);
  };

  // 计算总页数
  const getTotalPages = () => {
    const portraitPages = Math.ceil(totalPortraits / PORTRAIT_PER_PAGE);
    const landscapePages = Math.ceil(totalLandscapes / LANDSCAPE_PER_PAGE);
    return Math.max(portraitPages, landscapePages, 1);
  };

  // 上一页
  const goToPreviousPage = () => {
    handlePageChange(currentPage - 1);
  };

  // 下一页
  const goToNextPage = () => {
    handlePageChange(currentPage + 1);
  };

  // 处理图片点击
  const handlePhotoClick = (photoId, photoType) => {
    // 找到点击图片在allPhotos数组中的索引
    const index = allPhotos.findIndex(
      (photo) => photo.id === photoId && photo.type === photoType
    );

    if (index !== -1) {
      setSelectedPhotoIndex(index);
      setShowModal(true);

      // 打开模态框时禁止页面滚动
      document.body.style.overflow = "hidden";
    }
  };

  // 关闭模态框时恢复页面滚动
  const handleCloseModal = () => {
    setShowModal(false);
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    // 初始化加载第一页数据
    fetchCollectionPhotos(1);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      // 确保在组件卸载时恢复滚动
      document.body.style.overflow = "auto";
    };
  }, [description]); // 依赖项只有description，当描述改变时重新加载

  // 渲染竖型图片组 (3x3)
  const renderPortraitGroup = () => {
    if (photos2.length === 0) return null;

    return (
      <div style={{ marginBottom: "30px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "15px",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 20px",
          }}
        >
          {photos2.map((photo) => (
            <div
              key={photo.id}
              className="image-container"
              style={{
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "4px",
                overflow: "hidden",
                aspectRatio: "2/3", // 竖型图片比例
                cursor: "pointer",
              }}
              onClick={() => handlePhotoClick(photo.id, 2)}
            >
              <EnhancedImage
                primarySrc={photo.displayUrl} // 使用带质量参数的URL
                fallbackSrc={photo.originalUrl} // 当失败时使用原始URL
                alt={`Photo ${photo.id}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 渲染横型图片组 (2x2)
  const renderLandscapeGroup = () => {
    if (photos1.length === 0) return null;

    return (
      <div style={{ marginBottom: "40px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "15px",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 20px",
          }}
        >
          {photos1.map((photo) => (
            <div
              key={photo.id}
              className="image-container"
              style={{
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "4px",
                overflow: "hidden",
                aspectRatio: "3/2", // 横型图片比例
                cursor: "pointer",
              }}
              onClick={() => handlePhotoClick(photo.id, 1)}
            >
              <EnhancedImage
                primarySrc={photo.displayUrl} // 使用带质量参数的URL
                fallbackSrc={photo.originalUrl} // 当失败时使用原始URL
                alt={`Photo ${photo.id}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <p>加载中...</p>
      </div>
    );
  }

  const totalPages = getTotalPages();
  const noPhotos = photos1.length === 0 && photos2.length === 0;

  return (
    <div
      className="s-content s-font-body-gotham-rounded"
      style={{
        backgroundColor: "#fff",
        position: "relative",
        minHeight: "100vh",
        paddingBottom: "100px", // 为版权信息预留空间
      }}
    >
      <Helmet>
        <title>{description}系列 - 223nobody</title>
        <meta name="description" content={`223nobody-${description}系列照片`} />
      </Helmet>

      <div className={`brand-header ${isScrolled ? "collapsed" : ""}`}>
        <h1 className="brand-title">223nobody自由摄影师</h1>
      </div>

      <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
        <ul
          style={{
            display: "flex",
            justifyContent: "center",
            listStyle: "none",
            marginTop: "20px",
            gap: "30px",
          }}
        >
          <li>
            <a href="/" className="nav-link">
              首页
            </a>
          </li>
          <li>
            <a href="/works" className="nav-link">
              作品
            </a>
          </li>
          <li>
            <a href="/about" className="nav-link1">
              关于
            </a>
          </li>
          <li>
            <a href="/contact" className="nav-link">
              联系
            </a>
          </li>
          <li className="purchase-link">
            <div style={{ position: "relative" }}>
              {/* 购物车图标 */}
              <svg
                style={{ width: "24px", height: "24px" }}
                viewBox="0 0 24 24"
              >
                <path
                  d="M17,18C15.89,18 15,18.89 15,20A2,2 0 0,0 17,22A2,2 0 0,0 19,20C19,18.89 18.1,18 17,18M1,2V4H3L6.6,11.59L5.24,14.04C5.09,14.32 5,14.65 5,15A2,2 0 0,0 7,17H19V15H7.42A0.25,0.25 0 0,1 7.17,14.75C7.17,14.7 7.18,14.66 7.2,14.63L8.1,13H15.55C16.3,13 16.96,12.58 17.3,11.97L20.88,5.5C20.95,5.34 21,5.17 21,5A1,1 0 0,0 20,4H5.21L4.27,2M7,18C5.89,18 5,18.89 5,20A2,2 0 0,0 7,22A2,2 0 0,0 9,20C9,18.89 8.1,18 7,18Z"
                  fill="#000"
                />
              </svg>

              {/* 红色标记 */}
              <div className="purchase-red">
                <span className="purchase-span">{purchase}</span>
              </div>
            </div>
          </li>
        </ul>
      </nav>

      <div style={{ paddingTop: isScrolled ? "200px" : "300px" }}>
        <h1
          className="hstyle"
          style={{ fontFamily: "中易宋体, SimSun, serif" }}
        >
          {description === "wudang"
            ? "武当山系列"
            : description === "25chunjie"
            ? "春节系列"
            : "日常系列"}
        </h1>

        {noPhotos && (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <p>暂无照片数据</p>
          </div>
        )}

        {!noPhotos && (
          <>
            {/* 显示竖图 (3x3) */}
            {renderPortraitGroup()}

            {/* 显示横图 (2x2) */}
            {renderLandscapeGroup()}

            {/* 分页控件 */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "40px 0",
                alignItems: "center",
              }}
            >
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                style={{
                  padding: "8px 16px",
                  margin: "0 10px",
                  background: currentPage === 1 ? "#f0f0f0" : "#007bff",
                  color: currentPage === 1 ? "#777" : "white",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                }}
              >
                上一页
              </button>

              <span
                style={{
                  padding: "0 15px",
                  fontSize: "1rem",
                  color: "#555",
                }}
              >
                第 {currentPage} 页 / 共 {totalPages} 页
              </span>

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages || totalPages === 0}
                style={{
                  padding: "8px 16px",
                  margin: "0 10px",
                  background:
                    currentPage === totalPages || totalPages === 0
                      ? "#f0f0f0"
                      : "#007bff",
                  color:
                    currentPage === totalPages || totalPages === 0
                      ? "#777"
                      : "white",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  cursor:
                    currentPage === totalPages || totalPages === 0
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                下一页
              </button>
            </div>
          </>
        )}
      </div>

      {/* 模态框组件 - 显示在CollectionPage内部 */}
      {showModal && allPhotos.length > 0 && (
        <PhotoDetailModal
          photo={allPhotos[selectedPhotoIndex]}
          photos={allPhotos}
          currentIndex={selectedPhotoIndex}
          onClose={handleCloseModal}
        />
      )}

      <div
        className="copyright"
        style={{
          padding: "15px 0",
          color: "#000",
          textAlign: "center",
          position: "absolute",
          bottom: "20px",
          left: 0,
          right: 0,
        }}
      >
        ©2025 - 223nobody
      </div>
    </div>
  );
};

export default CollectionPage;
