import React, { useEffect, useRef, useState } from 'react';
import App from './App';
import styles from './Entry.module.css';

export const Entry: React.FC<{}> = () => {
  const iconElRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (iconElRef.current == null) return;
    return dragElement(iconElRef.current);
  }, [iconElRef]);

  return (
    <>
      <div className={`${styles.appContainer} ${show ? styles.showApp : ''}`}>
        <App></App>
      </div>
      <div
        ref={iconElRef}
        className={styles.entryIcon}
        onClick={() => {
          setShow(!show);
        }}
      >
        E
      </div>
    </>
  );
};

function dragElement(el: HTMLElement): () => void {
  // 被拖拽元素位置
  let elStartX = 0;
  let elStartY = 0;
  // 鼠标按下位置
  let touchStartX = 0;
  let touchStartY = 0;
  let maxLeft = 100;
  let maxTop = 100;

  const onStart = ({
    clientX,
    clientY,
  }: {
    clientX: number;
    clientY: number;
  }): void => {
    touchStartX = clientX;
    touchStartY = clientY;

    const { x, y, width, height } = el.getBoundingClientRect();
    elStartX = x;
    elStartY = y;

    maxLeft =
      ((document.documentElement.clientWidth - width) /
        document.documentElement.clientWidth) *
      100;
    maxTop =
      ((document.documentElement.clientHeight - height) /
        document.documentElement.clientHeight) *
      100;
  };

  const onMove = ({
    clientX,
    clientY,
  }: {
    clientX: number;
    clientY: number;
  }): void => {
    const curX = clientX;
    const curY = clientY;
    const left =
      ((elStartX + curX - touchStartX) / document.documentElement.clientWidth) *
      100;
    const top =
      ((elStartY + curY - touchStartY) /
        document.documentElement.clientHeight) *
      100;
    el.style.left = `${clamp(left, 0, maxLeft)}%`;
    el.style.top = `${clamp(top, 0, maxTop)}%`;
  };

  const onTouchStart = (evt: TouchEvent): void => {
    onStart(evt.touches[0]);
  };

  const onTouchMove = (evt: TouchEvent): void => {
    evt.preventDefault();
    onMove(evt.touches[0]);
  };

  let moved = false;
  const onMouseMove = (evt: MouseEvent): void => {
    if (
      Math.abs(evt.clientX - touchStartX) > 10 ||
      Math.abs(evt.clientY - touchStartY) > 10
    ) {
      moved = true;
    }

    evt.preventDefault();
    evt.stopPropagation();
    onMove(evt);
  };

  const onMouseDown = (evt: MouseEvent): void => {
    onStart(evt);
    document.body.addEventListener('mouseup', onMouseUp);
    document.body.addEventListener('mousemove', onMouseMove);
  };

  const onMouseUp = (evt: MouseEvent): void => {
    evt.preventDefault();
    evt.stopPropagation();
    document.body.removeEventListener('mouseup', onMouseUp);
    document.body.removeEventListener('mousemove', onMouseMove);
  };

  const onClick = (evt: MouseEvent) => {
    if (moved) {
      evt.preventDefault();
      evt.stopPropagation();
    }
    moved = false;
  };

  el.addEventListener('touchstart', onTouchStart);
  el.addEventListener('touchmove', onTouchMove);
  el.addEventListener('mousedown', onMouseDown);
  el.addEventListener('click', onClick);

  return () => {
    el.removeEventListener('touchstart', onTouchStart);
    el.removeEventListener('touchmove', onTouchMove);
    el.removeEventListener('mousedown', onMouseDown);

    document.body.removeEventListener('mouseup', onMouseUp);
    document.body.removeEventListener('mousemove', onMouseMove);
    document.body.removeEventListener('click', onClick);
  };

  function clamp(v: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, v));
  }
}
