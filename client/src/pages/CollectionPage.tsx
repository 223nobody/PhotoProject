import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import "./HomePage.css"; // 引入自定义样式
const CollectionPage = () => {
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

  return (
    <div
      className="s-content s-font-body-gotham-rounded"
      style={{ backgroundColor: "#fff" }}
    >
      {/* 设置页面标题 */}
      <Helmet>
        <title>关于 - 223nobody</title>
        <meta
          name="description"
          content="223nobody-关于页面，介绍摄影经历和专业领域"
        />
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

      {/* 版权信息 - 新增 */}
      <div className="copyright" style={{ color: "#000" }}>
        ©2025 - 223nobody
      </div>

      <div style={{ overflow: "auto" }}></div>
    </div>
  );
};
export default CollectionPage;
