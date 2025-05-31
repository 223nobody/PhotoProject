import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import "./HomePage.css"; // 引入自定义样式
import "./AboutPage.css"; // 引入自定义样式
const AboutPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const purchase = 0;
  const brands = [
    { id: 1, name: "BenQ", img: "../brands/benu.png" },
    { id: 2, name: "Canon", img: "../brands/canon.png" },
    { id: 3, name: "SONY", img: "../brands/sony.png" },
    { id: 4, name: "Leica", img: "../brands/leica.png" },
    { id: 5, name: "DJI", img: "../brands/dji.png" },
    { id: 6, name: "HasselBlad", img: "../brands/hasselblad.png" },
  ];

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

      {/* 内容部分 - 添加顶部内边距以避免被固定导航栏遮挡 */}
      <div style={{ paddingTop: isScrolled ? "200px" : "200px" }}>
        <h1 style={{ textAlign: "center", marginBottom: 20 }}>About</h1>
        <section
          style={{
            display: "flex",
            alignItems: "center",
            padding: "40px 20px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <div style={{ flex: 1 }}>
            <img
              src="homeimage1.jpg"
              alt="223"
              style={{ width: "100%", maxWidth: "573px" }}
            />
          </div>
          <div style={{ flex: 1, paddingLeft: "40px" }}>
            <h1 className="upline">Hi, I'm 223</h1>
            <p className="downline1">
              I'm a freelance photographer/ videographer based in WuHan, China.
            </p>
            <p className="downline1">
              With a passion for both photography and videography, I specialize
              in helping brands to get more exposure and reach more customers
              through videos and photos.
            </p>
            <p className="downline1">
              I've been fortunate to work with many of the world's top brands
              such as Sony, Canon, Google, BenQ, Msi, Weider, and more.
            </p>
            <p className="downline2" style={{ marginTop: 40 }}>
              嗨! 我是223
            </p>
            <p className="downline2">我是来自武汉的一名摄影爱好者。</p>
            <p className="downline2">
              秉持着对影像的热情,
              我负责利用照片和影片协助品牌建立形象以及取得更多的曝机会,并且更被大众所认知。
            </p>
            <p className="downline2">
              我也非常荣幸和一些世界上顶尖的品牌合作。
            </p>
            <p className="downline2">
              例如: Sony, Canon, Lecia, BenQ, HasselBlad, Weider, SYM等等...
            </p>
          </div>
        </section>

        <section
          style={{
            padding: "80px 20px 120px", // 增加底部内边距给版权信息留空间
            position: "relative",
          }}
        >
          <h1
            style={{
              fontSize: 36,
              fontWeight: "bold",
              textAlign: "center",
              fontFamily: "华文细黑",
            }}
          >
            Selected clients I've worked with
          </h1>

          <div
            style={{
              backgroundColor: "#fff",
              padding: "60px 20px",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "40px",
                maxWidth: "1200px",
                margin: "0 auto",
              }}
            >
              {brands.map((brand) => (
                <div
                  key={brand.id}
                  style={{
                    width: "130px",
                    height: "110px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    className="brandstyle"
                    style={{
                      backgroundImage: `url(${brand.img})`,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 版权信息 - 新增 */}
          <div className="copyright" style={{ color: "#000" }}>
            ©2025 - 223nobody
          </div>
        </section>
      </div>
      <div style={{ overflow: "auto" }}></div>
    </div>
  );
};
export default AboutPage;
