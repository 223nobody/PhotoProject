import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import "./HomePage.css"; // 引入自定义样式
import "./WorkPage.css"; // 引入联系页面样式
const WorkPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const purchase = 0;
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const photos = [
    { id: 1, image: "bilibili.png", type: "风景摄影" },
    { id: 2, image: "bilibili2.png", type: "风景摄影" },
    { id: 3, image: "bilibili.png", type: "风景摄影" },
    { id: 4, image: "bilibili2.png", type: "风景摄影" },
    { id: 5, image: "bilibili.png", type: "风景摄影" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // 自动播放 - 1秒切换一次
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % photos.length);
      }, 1500);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, photos.length]);

  // 导航函数
  const goToPrevious = () => {
    setIsPaused(true);
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
    setTimeout(() => setIsPaused(false), 1000); // 2秒后恢复自动播放
  };

  const goToNext = () => {
    setIsPaused(true);
    setCurrentIndex((prev) => (prev + 1) % photos.length);
    setTimeout(() => setIsPaused(false), 1000); // 2秒后恢复自动播放
  };

  return (
    <div
      className="s-content s-font-body-gotham-rounded"
      style={{ backgroundColor: "#fff" }}
    >
      {/* 设置页面标题 */}
      <Helmet>
        <title>作品 - 223nobody</title>
        <meta name="description" content="223nobody-作品页面,介绍优秀作品" />
      </Helmet>
      {/* 顶部标题 - 滚动时会折叠 */}
      <div className={`brand-header ${isScrolled ? "collapsed" : ""}`}>
        <h1 className="brand-title">223nobody自由摄影师</h1>
      </div>

      {/* 导航栏 */}
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
            <a href="/works" className="nav-link1">
              作品
            </a>
          </li>
          <li>
            <a href="/about" className="nav-link">
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

      {/* 内容部分 - 添加顶部内边距以避免被固定导航栏遮挡 */}
      <div style={{ paddingTop: isScrolled ? "200px" : "300px" }}></div>
      <section>
        <h1 style={{ textAlign: "center", marginBottom: 40 }}>Recommend</h1>

        <div
          className="auto-carousel"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* 上一张按钮 */}
          <button
            className="nav-btn prev-btn"
            onClick={goToPrevious}
            aria-label="Previous photo"
          >
            &lt;
          </button>

          {/* 轮播内容 */}
          <div className="carousel-track">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className={`carousel-slide ${
                  index === currentIndex ? "active" : ""
                }`}
                style={{ backgroundImage: `url(${photo.image})` }}
              />
            ))}
          </div>

          {/* 下一张按钮 */}
          <button
            className="nav-btn next-btn"
            onClick={goToNext}
            aria-label="Next photo"
          >
            &gt;
          </button>
        </div>
      </section>
      <h1 style={{ textAlign: "center", marginTop: 100 }}>Photo Collection</h1>
      <section
        style={{
          display: "flex",
          alignItems: "center",
          padding: "0px 20px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "nowrap", // 确保不换行
            gap: "15px", // 图片间距
            minWidth: "100%", // 确保容器足够宽
            padding: "10px",
            justifyContent: "center", // 居中对齐
          }}
        >
          {photos.map((photo) => (
            <div key={photo.id} style={{ flex: 1 }}>
              <div
                className="image-container"
                style={{
                  flex: "0 0 auto", // 防止图片被压缩
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s ease",
                  width: "400px", // 固定宽度
                  height: "500px", // 固定高度
                }}
              >
                <a href="/works/type">
                  <img
                    src={photo.image}
                    alt={`Photo ${photo.id}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover", // 保持比例，填充容器
                      display: "block",
                    }}
                  />
                </a>
              </div>
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <p className="downline">{photo.type}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 版权信息 - 新增 */}
      <div className="copyright" style={{ marginTop: 100, color: "#000" }}>
        ©2025 - 223nobody
      </div>

      <div style={{ overflow: "auto" }}></div>
    </div>
  );
};
export default WorkPage;
