import React, { useEffect, useRef } from "react";

// 먼저 useRef(false)를 통해 didMount 라는 레퍼런스를 생성하고, false 값을 저장합니다.

// useEffect를 사용하여 컴포넌트가 마운트 또는 업데이트될 때마다 함수가 실행되도록 합니다.

// 처음 컴포넌트가 마운트될 때 didMount.current 값은 false 이므로 if 문을 통해 func() 를 실행하지 않습니다.
//  그리고 didMount.current 값을 true로 바꾸어 마운트되었음을 표시합니다.

// 그 후, 컴포넌트가 업데이트될 때마다 useEffect가 실행되지만 이때 didMount.current 값이 true 이므로 if 문을 통해 func() 를 실행합니다.
//  이렇게 하면 컴포넌트가 처음 마운트될 때만 func() 함수가 실행되도록 할 수 있습니다.

const useDidMountEffect = (func, deps) => {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) func();
    else didMount.current = true;
  }, deps);
};

export default useDidMountEffect;
