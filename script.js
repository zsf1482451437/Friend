// 等待页面加载完成后执行
window.addEventListener("load", function () {
  // 隐藏加载动画，显示内容
  document.querySelector(".loader").style.display = "none";
  document.querySelector(".container").style.opacity = "1";

  // 图标旋转效果
  const icons = document.querySelectorAll(".task-icon");
  icons.forEach((icon) => {
    icon.classList.add("rotating");
  });

  // 文字欢乐动画
  const tasks = document.querySelectorAll(".task");
  const animations = ["bounce", "shake", "wobble"];

  tasks.forEach((task, index) => {
    // 给每个任务文字添加不同的动画
    const textNode = task.childNodes[1];
    if (textNode && textNode.nodeValue) {
      // 添加空值检查
      textNode.nodeValue = textNode.nodeValue.trim();

      // 替换纯文本节点为带动画的span
      const span = document.createElement("span");
      span.textContent = textNode.nodeValue;
      span.classList.add(animations[index % animations.length]);
      task.replaceChild(span, textNode);
    }

    // 点击任务时的心跳动画
    task.addEventListener("click", function () {
      this.classList.add("animate__animated", "animate__heartBeat");
      setTimeout(() => {
        this.classList.remove("animate__heartBeat");
      }, 1000);
    });
  });

  // 自动播放背景音乐（解决自动播放限制）
  const bgMusic = document.getElementById("bg-music");
  if (bgMusic) {
    // 尝试自动播放
    const playPromise = bgMusic.play();

    // 处理可能的播放失败（浏览器策略限制）
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        // 当用户与页面交互时再次尝试播放
        document.addEventListener(
          "click",
          function () {
            bgMusic.play();
          },
          { once: true }
        );
      });
    }
  }

  // 紧急呼叫按钮跳转微信
  const emergencyBtn = document.querySelector(".emergency-btn");
  if (emergencyBtn) {
    // 添加空值检查
    emergencyBtn.addEventListener("click", function () {
      window.location.href = "weixin://"; // 如果没安装微信会提示
    });
  }

  // 照片墙轮播功能
  const photos = document.querySelectorAll(".photo");
  const dots = document.querySelectorAll(".nav-dot");
  const arrowLeft = document.querySelector(".arrow-left");
  const arrowRight = document.querySelector(".arrow-right");
  let currentPhotoIndex = 0;
  let isAnimating = false;

  // 点击导航点切换照片
  dots.forEach((dot) => {
    dot.addEventListener("click", function () {
      if (isAnimating) return;
      const index = parseInt(this.getAttribute("data-index"));
      if (index > currentPhotoIndex) {
        slidePhoto(index, "right");
      } else if (index < currentPhotoIndex) {
        slidePhoto(index, "left");
      }
    });
  });

  // 点击左右箭头
  if (arrowLeft) {
    // 添加空值检查
    arrowLeft.addEventListener("click", function () {
      if (isAnimating) return;
      const prevIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
      slidePhoto(prevIndex, "left");
    });
  }

  if (arrowRight) {
    // 添加空值检查
    arrowRight.addEventListener("click", function () {
      if (isAnimating) return;
      const nextIndex = (currentPhotoIndex + 1) % photos.length;
      slidePhoto(nextIndex, "right");
    });
  }

  // 手指滑动支持
  let touchStartX = 0;
  let touchEndX = 0;
  const photoContainer = document.querySelector(".photo-container");

  if (photoContainer) {
    // 添加空值检查
    photoContainer.addEventListener("touchstart", function (e) {
      touchStartX = e.changedTouches[0].screenX;
    });

    photoContainer.addEventListener("touchend", function (e) {
      if (isAnimating) return;
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });
  }

  function handleSwipe() {
    const swipeThreshold = 70; // 滑动距离阈值
    if (touchEndX - touchStartX > swipeThreshold) {
      // 向右滑动，显示上一张
      const prevIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
      slidePhoto(prevIndex, "left");
    } else if (touchStartX - touchEndX > swipeThreshold) {
      // 向左滑动，显示下一张
      const nextIndex = (currentPhotoIndex + 1) % photos.length;
      slidePhoto(nextIndex, "right");
    }
  }

  // 自动轮播
  let autoplayInterval = setInterval(() => {
    if (isAnimating) return;
    const nextIndex = (currentPhotoIndex + 1) % photos.length;
    slidePhoto(nextIndex, "right");
  }, 5000); // 每5秒切换一次

  // 滑动切换照片
  function slidePhoto(index, direction) {
    if (index === currentPhotoIndex) return;
    isAnimating = true;

    // 清除所有动画类
    photos.forEach((photo) => {
      photo.classList.remove(
        "slide-left-in",
        "slide-right-in",
        "slide-left-out",
        "slide-right-out"
      );
    });

    const currentPhoto = photos[currentPhotoIndex];
    const nextPhoto = photos[index];

    if (direction === "right") {
      currentPhoto.classList.add("slide-left-out");
      nextPhoto.classList.add("slide-left-in");
    } else {
      currentPhoto.classList.add("slide-right-out");
      nextPhoto.classList.add("slide-right-in");
    }

    // 更新导航点
    dots.forEach((dot) => dot.classList.remove("active"));
    dots[index].classList.add("active");

    // 动画结束后更新当前索引
    setTimeout(() => {
      currentPhoto.classList.remove("active");
      nextPhoto.classList.add("active");
      currentPhotoIndex = index;
      isAnimating = false;
    }, 500);

    // 重置自动轮播计时器
    clearInterval(autoplayInterval);
    autoplayInterval = setInterval(() => {
      if (!isAnimating) {
        const nextIndex = (currentPhotoIndex + 1) % photos.length;
        slidePhoto(nextIndex, "right");
      }
    }, 5000);
  }
});
