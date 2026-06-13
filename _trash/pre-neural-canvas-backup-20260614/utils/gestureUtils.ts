/**
 * 手势处理工具函数
 */

export interface TouchPoint {
  x: number;
  y: number;
}

export interface GestureState {
  scale: number;
  x: number;
  y: number;
  rotation?: number;
}

export interface PinchGestureData {
  center: TouchPoint;
  distance: number;
  scale: number;
}

/**
 * 计算两点之间的距离
 */
export const getDistance = (touch1: Touch, touch2: Touch): number => {
  return Math.sqrt(
    Math.pow(touch2.clientX - touch1.clientX, 2) + 
    Math.pow(touch2.clientY - touch1.clientY, 2)
  );
};

/**
 * 计算两点的中心点
 */
export const getCenter = (touch1: Touch, touch2: Touch): TouchPoint => {
  return {
    x: (touch1.clientX + touch2.clientX) / 2,
    y: (touch1.clientY + touch2.clientY) / 2
  };
};

/**
 * 计算两点之间的角度
 */
export const getAngle = (touch1: Touch, touch2: Touch): number => {
  return Math.atan2(
    touch2.clientY - touch1.clientY,
    touch2.clientX - touch1.clientX
  ) * 180 / Math.PI;
};

/**
 * 限制数值在指定范围内
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * 处理缩放边界
 */
export const constrainScale = (scale: number, minScale = 0.5, maxScale = 3): number => {
  return clamp(scale, minScale, maxScale);
};

/**
 * 处理平移边界（基于容器和图片尺寸）
 */
export const constrainTranslation = (
  x: number,
  y: number,
  scale: number,
  containerWidth: number,
  containerHeight: number,
  imageWidth: number,
  imageHeight: number
): { x: number; y: number } => {
  if (scale <= 1) {
    return { x: 0, y: 0 };
  }

  const scaledImageWidth = imageWidth * scale;
  const scaledImageHeight = imageHeight * scale;
  
  const maxX = Math.max(0, (scaledImageWidth - containerWidth) / 2);
  const maxY = Math.max(0, (scaledImageHeight - containerHeight) / 2);

  return {
    x: clamp(x, -maxX, maxX),
    y: clamp(y, -maxY, maxY)
  };
};

/**
 * 手势识别类
 */
export class GestureRecognizer {
  private startTouches: Touch[] = [];
  private lastTouches: Touch[] = [];
  private initialDistance = 0;
  private initialAngle = 0;
  private initialCenter: TouchPoint = { x: 0, y: 0 };

  /**
   * 开始手势识别
   */
  start(touches: TouchList): void {
    this.startTouches = Array.from(touches);
    this.lastTouches = Array.from(touches);

    if (touches.length === 2) {
      this.initialDistance = getDistance(touches[0], touches[1]);
      this.initialAngle = getAngle(touches[0], touches[1]);
      this.initialCenter = getCenter(touches[0], touches[1]);
    }
  }

  /**
   * 更新手势状态
   */
  update(touches: TouchList): PinchGestureData | null {
    if (touches.length !== 2 || this.startTouches.length !== 2) {
      return null;
    }

    const currentDistance = getDistance(touches[0], touches[1]);
    const currentCenter = getCenter(touches[0], touches[1]);
    const scale = currentDistance / this.initialDistance;

    this.lastTouches = Array.from(touches);

    return {
      center: currentCenter,
      distance: currentDistance,
      scale: constrainScale(scale)
    };
  }

  /**
   * 结束手势识别
   */
  end(): void {
    this.startTouches = [];
    this.lastTouches = [];
    this.initialDistance = 0;
    this.initialAngle = 0;
    this.initialCenter = { x: 0, y: 0 };
  }

  /**
   * 检测是否为点击手势
   */
  isTap(touches: TouchList, threshold = 10): boolean {
    if (this.startTouches.length !== 1 || touches.length !== 1) {
      return false;
    }

    const startTouch = this.startTouches[0];
    const endTouch = touches[0];
    const distance = Math.sqrt(
      Math.pow(endTouch.clientX - startTouch.clientX, 2) +
      Math.pow(endTouch.clientY - startTouch.clientY, 2)
    );

    return distance < threshold;
  }

  /**
   * 检测是否为双击手势
   */
  isDoubleTap(
    touches: TouchList,
    lastTapTime: number,
    threshold = 300,
    distanceThreshold = 50
  ): boolean {
    if (!this.isTap(touches)) {
      return false;
    }

    const now = Date.now();
    const timeDiff = now - lastTapTime;

    if (timeDiff > threshold) {
      return false;
    }

    // 检查两次点击的位置是否接近
    const currentTouch = touches[0];
    const distance = Math.sqrt(
      Math.pow(currentTouch.clientX - this.initialCenter.x, 2) +
      Math.pow(currentTouch.clientY - this.initialCenter.y, 2)
    );

    return distance < distanceThreshold;
  }
}

/**
 * 防抖函数
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * 节流函数
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};