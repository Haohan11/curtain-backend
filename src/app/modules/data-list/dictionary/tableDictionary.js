const enable_label = "啟用狀態";
const comments_label = "備註";

export const fullData = {
  products: {
    searchPlaceholder: "商品",
    createHeaderText: "商品資料",
    modalConfig: {
      avatar: false,
      name_label: "商品型號",
      name_placeholder: "請輸入商品型號",
      style_label: "商品樣式",
      style_placeholder: "請輸入商品樣式",
      vendor_label: "供應廠商",
      available_label: "上架狀態",
      series_label: "商品系列",
      color_label: "商品顏色",
      material_label: "面料材質",
      environment_label: "適用場景",
      design_label: "商品風格",
      absorption_label: "吸音效果",
      block_label: "遮光效果",
      description_label: "商品描述",
    },
    formField: {
      name: "",
      style: "",
      vendor: "",
      avaliable: "",
      series: "",
      color: "",
      material: "",
      design: "",
      absorption: 1,
      block: 1,
      description: "",
    },
  },
  series: {
    searchPlaceholder: "系列",
    createHeaderText: "商品系列",
    modalConfig: {
      enable_label,
      name_label: "系列名稱",
      code_label: "系列編號",
      comments_label,
    },
    formField: {
      name: "",
      code: "",
    },
  },
  colorScheme: {
    searchPlaceholder: "色系",
    createHeaderText: "色系類別",
    modalConfig: {
      enable_label,
      name_label: "色系名稱",
      comments_label,
    },
    formField: {
      name: "",
    },
  },
  design: {
    searchPlaceholder: "風格",
    createHeaderText: "風格類別",
    modalConfig: {
      enable_label,
      name_label: "風格名稱",
      comments_label,
    },
    formField: {
      name: "",
    },
  },
  material: {
    searchPlaceholder: "材質",
    createHeaderText: "面料材質",
    modalConfig: {
      enable_label,
      name_label: "面料名稱",
      comments_label,
    },
    formField: {
      name: "",
    },
  },
  vendor: {
    searchPlaceholder: "供應商",
    createHeaderText: "供應商",
    modalConfig: {
      enable_label,
      name_label: "供應商名稱",
      code_label: "供應商編號",
      comments_label,
    },
    formField: {
      name: "",
    },
  },
  accounts: {
    searchPlaceholder: "員工",
    createHeaderText: "員工資料",
    modalConfig: {
      avatar: true,
      name_label: "姓名",
      email: true,
      role_label: "員工角色",
      enable_label,
      code_label: "員工編號",
      id_code_label: "身分證號",
      id_code_placeholder: "輸入身分證號",
      phone_number_label: "手機號碼",
      phone_number_placeholder: "輸入手機號碼",
      password_label: "登入密碼",
      password_placeholder: "輸入密碼",
    },
    formField: {
      name: "",
    },
  },
  role: {
    searchPlaceholder: "角色類別",
    createHeaderText: "角色類別",
    modalConfig: {
      name_label: "角色名稱",
      members_label: "員工列表",
      auth_label: "權限設定",
      auth_list: ["顯示模組", "顯示操作項", "勾選修改/檢視"],
      comments_label,
    },
    formField: {
      name: "",
    },
  },
  environment: {
    searchPlaceholder: "場景",
    createHeaderText: "場景",
    modalConfig: {
      enable_label,
      name_label: "場景名稱",
      comments_label,
    },
    formField: {
      name: "",
    },
  },
};

const ArrangeWithProperty = Object.entries(fullData).reduce(
  (tableDict, [table, content]) => {
    Object.entries(content).reduce((dict, [key, value]) => {
      dict[key] === undefined && (dict[key] = {});
      dict[key][table] = value;
      return dict;
    }, tableDict);
    return tableDict;
  },
  {}
);

export default ArrangeWithProperty;
