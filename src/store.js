import { createSlice } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";

// Redux Toolkit를 사용하여 auth 슬라이스를 생성
//Slice 는 useState와 비슷하다고 생각하면 된다.
const authSlice = createSlice({
  name: "auth", //slice 이름
  initialState: {
    username: "",
    userUid: "", //state 내용
  },

  //reducers는 Redux state 객체의 상태를 변경하는 함수이다.
  reducers: {
    //username을 설정하는 리듀서
    //파라미터 state는 initialState다.
    setUserName: (state, action) => {
      //payload 메소드는  전달하는 데이터를 담고 있는 프로퍼티다.
      state.username = action.payload;
    },
    //userUid을 설정하는 리듀서
    setUserUid: (state, action) => {
      state.userUid = action.payload;
    },
  },
});

const filteredProductSlice = createSlice({
  name: "filteredProduct",
  initialState: {
    filteredProduct: [],
  },
  reducers: {
    setFilteredProduct: (state, action) => {
      state.filteredProduct = action.payload;
    },
  },
});

export const { setFilteredProduct } = filteredProductSlice.actions;

//slice이름.actions 라고 적으면 state 변경함수가 전부 그 자리에 출력
export const { setUserName, setUserUid } = authSlice.actions;

//state 등록
export default configureStore({
  reducer: {
    auth: authSlice.reducer,
    filteredProduct: filteredProductSlice.reducer,
  },
});
