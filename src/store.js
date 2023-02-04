import { createSlice } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";

// Redux Toolkit를 사용하여 auth 슬라이스를 생성
//Slice 는 useState와 비슷하다고 생각하면 된다.
const authSlice = createSlice({
  name: "auth", //slice 이름
  initialState: {
    username: "",
    userUid: "", //state 내용
    displayName: "",
    email: "",
    password: "",
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
    setDisplayName: (state, action) => {
      state.displayName = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
  },
});

const uploadSlice = createSlice({
  name: "uploadData",
  initialState: {
    title: "",
    image: null,
    price: "",
    content: "",
    seller: "",
    sellerUid: "",
    tagValue: "",
    tag: [],
    imgFile: [],
    imgCount: 0,
  },
  reducers: {
    setTitle: (state, action) => {
      state.title = action.payload;
    },
    setImage: (state, action) => {
      state.image = action.payload;
    },
    setPrice: (state, action) => {
      state.price = action.payload;
    },
    setContent: (state, action) => {
      state.content = action.payload;
    },
    setSeller: (state, action) => {
      state.seller = action.payload;
    },
    setSellerUid: (state, action) => {
      state.sellerUid = action.payload;
    },
    setTagValue: (state, action) => {
      state.tagValue = action.payload;
    },
    setTag: (state, action) => {
      state.tag = action.payload;
    },
    setImgFile: (state, action) => {
      state.imgFile = action.payload;
    },

    setImgCount: (state, action) => {
      state.imgCount = action.payload;
    },
  },
});

const productSlice = createSlice({
  name: "product",
  initialState: {
    productId: "",
    product: [],
  },
  reducers: {
    setProductId: (state, action) => {
      state.productId = action.payload;
    },
    setProduct: (state, action) => {
      state.product = action.payload;
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
export const { setProductId, setProduct } = productSlice.actions;
//slice이름.actions 라고 적으면 state 변경함수가 전부 그 자리에 출력
export const {
  setUserName,
  setUserUid,
  setDisplayName,
  setEmail,
  setPassword,
} = authSlice.actions;

export const {
  setContent,
  setImage,
  setImgCount,
  setImgFile,
  setPrice,
  setSeller,
  setSellerUid,
  setTag,
  setTagValue,
  setTitle,
} = uploadSlice.actions;
//state 등록
export default configureStore({
  reducer: {
    auth: authSlice.reducer,
    filteredProduct: filteredProductSlice.reducer,
    uploadData: uploadSlice.reducer,
    product: productSlice.reducer,
  },
});
