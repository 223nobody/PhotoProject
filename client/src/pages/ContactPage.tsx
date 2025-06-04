import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import "./HomePage.css"; // 引入自定义样式
import "./ContactPage.css"; // 引入联系页面样式

const ContactPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showWechatQR, setShowWechatQR] = useState(false);
  const [showQQQR, setShowQQQR] = useState(false);
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

  // 点击模态框外部关闭二维码
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (showWechatQR && !event.target.closest(".wechat-modal")) ||
        (showQQQR && !event.target.closest(".qq-modal"))
      ) {
        setShowWechatQR(false);
        setShowQQQR(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showWechatQR, showQQQR]);

  return (
    <div
      className="s-content s-font-body-gotham-rounded"
      style={{ backgroundColor: "#fff" }}
    >
      {/* 设置页面标题 */}
      <Helmet>
        <title>联系 - 223nobody</title>
        <meta
          name="description"
          content="223nobody-联系页面,介绍摄影师联系方式和社交媒体"
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
            <a href="/about" className="nav-link">
              关于
            </a>
          </li>
          <li>
            <a href="/contact" className="nav-link1">
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

      <div style={{ paddingTop: isScrolled ? "100px" : "150px" }}>
        <h1
          style={{
            textAlign: "center",
            marginBottom: 60,
            fontFamily: '"Cormorant SC", serif',
          }}
        >
          Contact
        </h1>

        <div
          style={{
            justifyContent: "center", // 图标居中
            display: "flex",
            gap: "20px", // 增加图标间距
          }}
        >
          {/* Bilibili 图标 */}
          <a
            href="https://space.bilibili.com/1663704071?spm_id_from=333.1007.0.0"
            style={{ display: "block" }}
          >
            <img
              className="iconstyle"
              src="https://photoproject.oss-cn-wuhan-lr.aliyuncs.com/public/bilibili2.png"
              alt="bilibili"
              style={{ borderRadius: "20%" }}
            />
          </a>

          {/* 微信图标 - 添加点击事件 */}
          <div
            style={{ cursor: "pointer", position: "relative" }}
            onClick={() => setShowWechatQR(true)}
          >
            <img
              className="iconstyle"
              src="https://photoproject.oss-cn-wuhan-lr.aliyuncs.com/public/weixin.png"
              alt="weixin"
            />
          </div>

          {/* QQ图标 - 添加点击事件 */}
          <div
            style={{ cursor: "pointer", position: "relative" }}
            onClick={() => setShowQQQR(true)}
          >
            <img
              className="iconstyle"
              src="https://photoproject.oss-cn-wuhan-lr.aliyuncs.com/public/qq.png"
              alt="qq"
            />
          </div>
        </div>
      </div>

      {/* 微信二维码弹窗 */}
      {showWechatQR && (
        <div className="windowstyle">
          <div className="modalstyle">
            <h3 style={{ marginBottom: "15px" }}>微信二维码</h3>
            <div className="QRstyle">
              <img
                src="https://photoproject.oss-cn-wuhan-lr.aliyuncs.com/public/weixinQR.png"
                alt="微信二维码"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
            <p style={{ marginTop: "15px", marginBottom: "15px" }}>
              扫码添加我的微信
            </p>
            <button
              className="buttonstyle"
              onClick={() => setShowWechatQR(false)}
            >
              关闭
            </button>
          </div>
        </div>
      )}

      {/* QQ二维码弹窗 */}
      {showQQQR && (
        <div className="windowstyle">
          <div className="modalstyle">
            <h3 style={{ marginBottom: "15px" }}>QQ二维码</h3>
            <div className="QRstyle">
              <img
                src="https://photoproject.oss-cn-wuhan-lr.aliyuncs.com/public/qqQR.jpg"
                alt="qq二维码"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
            <p style={{ marginTop: "15px", marginBottom: "15px" }}>
              扫码添加我的QQ
            </p>
            <button className="buttonstyle" onClick={() => setShowQQQR(false)}>
              关闭
            </button>
          </div>
        </div>
      )}

      <div
        style={{
          textAlign: "center", // 文本居中
          marginTop: "50px", // 增加顶部间距
        }}
      >
        <p>电话: +86 15972901567</p>
        <p style={{ marginTop: "10px" }}>邮箱: byfukun@foxmail.com</p>
      </div>
      {/* 版权信息 - 新增 */}
      <div className="copyright" style={{ color: "#000" }}>
        ©2025 - 223nobody
      </div>

      <div style={{ overflow: "auto" }}></div>
    </div>
  );
};

export default ContactPage;
